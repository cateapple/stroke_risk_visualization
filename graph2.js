document.addEventListener('DOMContentLoaded', _ => {
  //graph area for health factors graph
  const svghealth = d3.select("svg#healthfactors");
  const widthH = svghealth.attr("width");
  const heightH = svghealth.attr("height");
  const marginsH = {
    "top": 50,
    "right": 20,
    "bottom": 100,
    "left": 150
  };
  const chartWidthH = widthH - marginsH.left - marginsH.right;
  const chartHeightH = heightH - marginsH.top - marginsH.bottom;
  let annotations = svghealth.append("g");
  let chart = svghealth.append("g").attr("transform", "translate(" + marginsH.left + "," + marginsH.top + ")");
  d3.json("./health_factors.json", d3.autoType).then((data) => {
    let groups = Array.from(new Set(Object.values(data).map(d => d.risk_factor)));
    let subgroups = Array.from(new Set(Object.values(data).map(d => d.gender))).slice(0, 2);
    let xScaleH = d3.scaleLinear().domain([0, 20]).range([0, chartWidthH]);
    let yScaleH = d3.scaleBand().domain(groups).range([chartHeightH, 0]).padding([0.05]);
    let ySubgroup = d3.scaleBand()
      .domain(subgroups)
      .range([0, yScaleH.bandwidth()])
      .padding([0.03]);
    let bottomAxisH = d3.axisBottom(xScaleH);
    let bottomGridLinesH = d3.axisBottom(xScaleH).tickFormat("").tickSize(-chartHeightH);
    annotations.append("g").attr("class", "x axis")
      .attr("transform", "translate(" + (marginsH.left) + "," + (marginsH.top + chartHeightH) + ")")
      .raise()
      .call(bottomAxisH);
    annotations.append("g").attr("class", "gridlines")
      .attr("transform", "translate(" + (marginsH.left) + "," + (marginsH.top + chartHeightH) + ")")
      .call(bottomGridLinesH);
    let leftAxisH = d3.axisLeft(yScaleH).tickFormat(tick => tick.charAt(0).toUpperCase() + tick.slice(1).replace(/_/g, " "));
    annotations.append("g").attr("class", "y axis")
      .attr("transform", "translate(" + (marginsH.left) + "," + (marginsH.top) + ")")
      .raise()
      .call(leftAxisH);
    const groupEnter = chart.selectAll("g").data(groups)
      .enter()
      .append("g")
      .attr("transform", d => `translate(0, ${yScaleH(d)})`)
      .selectAll("rect")
      .data(d => Object.values(data).filter(e => e.risk_factor === d))
      .enter()
    groupEnter.append("rect")
      .lower()
      .attr("x", xScaleH(0))
      .attr("y", d => ySubgroup(d.gender))
      .attr("width", d => xScaleH(d.percentage))
      .attr("height", d => ySubgroup.bandwidth())
      .attr("fill", d => {
        if (d.gender === "Male") {
          return d3.interpolateBlues(0.8);
        }
        if (d.gender === "Female") {
          return d3.interpolateReds(0.75);
        }
      })
    groupEnter.append("text")
      .text(d => d.percentage.toFixed(2) + "%")
      .attr("x", 10)
      .attr("y", d => ySubgroup(d.gender) + ySubgroup.bandwidth() / 2 + 7)
      .attr("fill", "white")
    svghealth.append("text")
      .text("Health Factors")
      .attr("transform", `rotate(270,50,${heightH/2})`)
      .attr("text-anchor", "middle")
      .attr("x", 50)
      .attr("y", heightH / 2)
    svghealth.append("text")
      .text("Percentage of Strokes")
      .attr("x", widthH / 2)
      .attr("y", 700)
    svghealth.append("circle").attr("cx", 900).attr("cy", 80).attr("r", 8).style("fill", d3.interpolateBlues(0.8))
    svghealth.append("circle").attr("cx", 900).attr("cy", 110).attr("r", 8).style("fill", d3.interpolateReds(0.75))
    svghealth.append("text").attr("x", 920).attr("y", 85).text("Male").style("font-size", "15px").attr("alignment-baseline", "middle")
    svghealth.append("text").attr("x", 920).attr("y", 115).text("Female").style("font-size", "15px").attr("alignment-baseline", "middle")
  });
});
