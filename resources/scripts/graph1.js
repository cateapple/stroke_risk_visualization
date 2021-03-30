document.addEventListener('DOMContentLoaded', _ => {
      const svg = d3.select("svg#lifefactors");

      const width = svg.attr("width");
      const height = svg.attr("height");
      const margins = {
        "top": 50,
        "right": 20,
        "bottom": 100,
        "left": 150
      };

      const chartWidth = width - margins.left - margins.right;
      const chartHeight = height - margins.top - margins.bottom;

      let annotated = svg.append("g");
      let chartArea = svg.append("g")
        .attr("transform", "translate(" + margins.left + "," + margins.top + ")");

      var lifedata;
      //promise function for life_factors
      d3.json("resources/data/life_factors.json", d3.autoType).then((data) => {

        //decides colors for each bar. Colors vary by hue over 3 categories and intensity over sub categories
        function colorGiver(d) {
          let cat = String(d.category).charAt(0);
          let sub = String(d.subcategory).charAt(0);
          let intensity = {
            P: .2,
            S: .4,
            G: .6,
            c: .8,
            N: .8,
            Y: 0.5,
            U: 0.5,
            R: .8
          }
          if (cat == "R") {
            return d3.interpolateGreens(intensity[sub]);
          } else if (cat == "e") {
            return d3.interpolateBlues(intensity[sub]);
          } else {
            return d3.interpolatePurples(intensity[sub]);
          }

        }

        //labels for graph
        function labelGraph() {

          svg.append("text")
            .text("Life Factors")
            .attr("transform", `rotate(270,50,${height/2})`)
            .attr("text-anchor", "middle")
            .attr("x", 50)
            .attr("y", height / 2 - 5)

          svg.append("text")
            .text("Percentage of Strokes")
            .attr("x", width / 2)
            .attr("y", 700)

          svg.append("text")
            .text("Residence type")
            .attr("fill", "grey")
            .attr("transform", "rotate(-90, 20, 50)")
            .attr("x", -570)
            .attr("y", 100)

          svg.append("text")
            .text("Ever Married?")
            .attr("fill", "grey")
            .attr("transform", "rotate(-90, 20, 50)")
            .attr("x", -430)
            .attr("y", 100)

          svg.append("text")
            .text("Occupation")
            .attr("fill", "grey")
            .attr("transform", "rotate(-90, 20, 50)")
            .attr("x", -180)
            .attr("y", 100)

          svg.append("line")
            .attr("x1", margins.left - 88)
            .attr("x2", margins.left)
            .attr("y1", yScale("Rural") + margins.top)
            .attr("y2", yScale("Rural") + margins.top)
            .attr("stroke", "black")

          svg.append("line")
            .attr("x1", margins.left - 90)
            .attr("x2", margins.left)
            .attr("y1", yScale("No") + margins.top)
            .attr("y2", yScale("No") + margins.top)
            .attr("stroke", "black")
        }

        //lists of categories and subcategories:
        let Lgroups = Array.from(new Set(Object.values(data).map(d => d.category)));
        let Lsubgroups = Array.from(new Set(Object.values(data).map(d => d.subcategory)));

        //scales
        let xScale = d3.scaleLinear().domain([0, 5]).range([0, chartWidth]);
        let yScale = d3.scaleBand().domain(Lsubgroups).range([chartHeight, 0]).padding([0.03]);

        //make left axis and ticks
        let leftAxis = d3.axisLeft(yScale)
          .tickFormat(tick => tick.charAt(0).toUpperCase() + tick.slice(1).replace(/_/g, " "));

        annotated.append("g").attr("class", "y axis")
          .attr("transform", "translate(" + (margins.left - 5) + "," + (margins.top) + ")")
          .call(leftAxis);


        //make bottom axis and ticks
        let bottomAxis = d3.axisBottom(xScale);
        let bottomGridLines = d3.axisBottom(xScale).tickFormat("").tickSize(-chartHeight);
        annotated.append("g").attr("class", "x axis")
          .attr("transform", "translate(" + (margins.left) + "," + (margins.top + chartHeight) + ")")
          .call(bottomAxis);
        annotated.append("g").attr("class", "x gridlines")
          .attr("transform", "translate(" + (margins.left) + "," + (margins.top + chartHeight) + ")")
          .call(bottomGridLines);

        //put bars onto graph
        Object.values(data).forEach(d => {

          chartArea.append("rect")
            .attr("x", xScale(0))
            .attr("y", yScale(d.subcategory))
            .attr("width", xScale(d.percentage))
            .attr("height", yScale.bandwidth())
            .attr("fill", colorGiver(d));
          //label bars
          svg.append("text")
            .text(d.percentage.toFixed(2) + "%")
            .attr("x", margins.left + 10)
            .attr("y", yScale(d.subcategory) + margins.top + yScale.bandwidth() / 2 + 5)
            .attr("fill", "black");
        });

        labelGraph();

      });

    })
