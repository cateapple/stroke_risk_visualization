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
        stats = pd.DataFrame([[total_strokes],[stroke_percentage]],
                             index=['strokes','percentage'], columns=[j+': '+i])
        life_factors = pd.concat([life_factors, stats], axis=1)

life_factors.to_json('life_factors.json')
