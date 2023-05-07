import React, { useEffect, useRef } from "react";
import * as d3 from "d3";

function brushed() {
  const selection = d3.event.selection();
  if (selection) {
    const [x0, x1] = selection.map(xScale.invert);
    xScale.domain([x0, x1]);
    xAxis.call(d3.axisBottom(xScale));
    linePath.attr("d", line);
  }
}

const TimelineGraph = ({ data }) => {
  const svgRef = useRef(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");

    const margin = { top: 20, right: 20, bottom: 20, left: 50 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain([d3.min(data, d => d.date), d3.max(data, d => d.date)])
      .range([0, innerWidth]);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([innerHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const brush = d3.brushX()
      .extent([[0, 0], [innerWidth, innerHeight]])
      .on("brush", brushed);

    const brushOverlay = svg.append("g")
      .attr("class", "brush")
      .call(brush)
      .attr("transform", `translate(${margin.left}, ${margin.bottom})`);;


    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${innerHeight + margin.top})`)
      .call(xAxis);

    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .call(yAxis);


    //data.forEach(element => {
      console.log(data[0]);
      svg.append("path")
      .datum(new Array(...data[0]))
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))
      )
      .attr("transform", `translate(${margin.left}, ${margin.bottom})`);
    //});

   


  }, [data]);

  return (
    <svg ref={svgRef} width={500} height={200}>

      <g />
    </svg>
  );
};

export default TimelineGraph;
