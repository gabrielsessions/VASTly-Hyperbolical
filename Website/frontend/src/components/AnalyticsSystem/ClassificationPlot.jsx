// Import Stuff Here!
import React, {useRef, useEffect, useState} from "react";
import {select, axisBottom, scaleLinear, axisRight} from "d3";

//dummy data
const data = [
  {
    "x":20,
    "y":50
  },
  {
    "x":40,
    "y":80
  },
  {
    "x":90,
    "y":30
  },
  {
    "x":10,
    "y":50
  },
  {
    "x":30,
    "y":110
  },
  {
    "x":120,
    "y":40
  },
  {
    "x":20,
    "y":80
  },
];

//dimension hook
const useResizeObserver = ref => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observeTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach(entry => {
        setDimensions(entry.contentRect);
      })
    });
    resizeObserver.observe(observeTarget);
    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref])
  return dimensions;
}

export default function ClassificationPlot(props) {
  const svgRef = useRef();
  const dimensions = useResizeObserver(svgRef)


  useEffect(() => {
    const svg = select(svgRef.current);

    if (!dimensions) return;

    //define scales
    const xScale = scaleLinear()
      .domain([0,150])
      .range([0,dimensions.width]);

    const yScale = scaleLinear()
      .domain([0,150])
      .range([dimensions.height,0]);

    //draw axes
    const xAxis = axisBottom(xScale)
    svg
    .select(".x-axis")
    .style("transform",`translateY(${dimensions.height}px)`)
    .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
    .select(".y-axis")
    .style("transform",`translateX(${dimensions.width}px)`)
    .call(yAxis);

    //draw points
    svg
      .selectAll("circle")
      .data(data)
      .join(
        enter => enter.append("circle")
        .attr("r", 5)
        .attr("cx", value => xScale(value.x))
        .attr("cy", value => yScale(value.y))
        .style('opacity',0.75)
        .style('fill', 'black'),
        update => update.attr("class", "updated")
        .attr("r", 5)
        .attr("cx", value => xScale(value.x))
        .attr("cy", value => yScale(value.y))
        .style('opacity',0.75)
        .style('fill', 'black'),
        exit => exit
        .transition()
        .delay(1000)
        .attr('r', 0)
        .remove()
      )
  },[data, dimensions])

  return(
    <React.Fragment>
      <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
        Test Button
      </button>
      <br />
      <svg ref={svgRef} width="100%" height="100%">
        <g className="x-axis"/>
        <g className="y-axis"/>
      </svg>

    </React.Fragment>
  )
}

