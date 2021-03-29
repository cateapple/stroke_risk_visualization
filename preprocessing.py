import pandas as pd 
import numpy as np 


strokes = pd.read_csv('healthcare-dataset-stroke-data.csv')

features = ['Residence_type', 'stroke']
total = len(strokes)

factors = ['Residence_type', 'ever_married','work_type']
life_factors = pd.DataFrame([],columns=[])
for j in factors:
    for i in strokes[j].unique():
        total_strokes = len(strokes[strokes[j] == i][strokes.stroke == 1])
        stroke_percentage = total_strokes*100/total
        stats = pd.DataFrame([[j],[i],[total_strokes],[stroke_percentage]],
                             index=['category','subcategory','strokes','percentage'], columns=[j+': '+i])
        life_factors = pd.concat([life_factors, stats], axis=1)

life_factors.to_json('life_factors.json')

def concat_stats(total, label, health_factors):
    if (len(total) == 0):
        total_strokes = None
        stroke_percentage = None
    else:
        total_strokes = len(total[total['stroke'] == 1])
        stroke_percentage = total_strokes*100/len(total)
    stats = pd.DataFrame([[label],[g],[total_strokes],[stroke_percentage]],
                             index=['risk_factor','gender','strokes','percentage'], columns=[g+"_"+label])
    return pd.concat([health_factors, stats], axis=1)
    
h_factors = ['heart_disease', 'avg_glucose_level']
health_factors =  pd.DataFrame([],columns=[])
genders = ['Male', 'Female']
for g in genders:
    gender_data = strokes[strokes['gender'] == g]
    # age over 50
    total = gender_data[gender_data['age'] >= 50]
    health_factors = concat_stats(total, 'over_50', health_factors)
    # hypertension
    total = gender_data[gender_data['hypertension'] == 1]
    health_factors = concat_stats(total, 'hypertension', health_factors)
    # obesity
    total = gender_data[gender_data['bmi'] >= 30]
    health_factors = concat_stats(total, 'obese_bmi', health_factors)
    # smoked
    total = gender_data[gender_data['smoking_status'] == 'smokes']
    health_factors = concat_stats(total, 'smokes', health_factors)
    #heart_disease
    total = gender_data[gender_data['heart_disease'] == 1]
    health_factors = concat_stats(total, 'heart_disease', health_factors)
    #hyperglycemic
    total = gender_data[gender_data['avg_glucose_level'] > 130]
    health_factors = concat_stats(total, 'hyperglycemic', health_factors)
health_factors.to_json('health_factors.json')