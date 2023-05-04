// Import Stuff Here!
import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, scaleLinear, scaleSequential, scaleOrdinal, axisRight, interpolateRainbow} from "d3";

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
    const data = props.TSNEQuery.data;
    //const clusters = props.TSNEQuery.data;

    if (!dimensions) return;

    //define scales
    const xScale = scaleLinear()
      .domain([-230000, 230000])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([-230000, 230000])
      .range([dimensions.height, 0]);


    var myColor = scaleSequential()
    .domain([-1,18])
    .interpolator(interpolateRainbow);
    console.log(data)

    //draw axes
    const xAxis = axisBottom(xScale)
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisRight(yScale);
    svg
      .select(".y-axis")
      .style("transform", `translateX(${dimensions.width}px)`)
      .call(yAxis);

    //draw points
    svg
      .selectAll("circle")
      .data(data)
      .join(
        enter =>{console.log("enter");
        return enter.append("circle")
          .attr("r", 1)
          .attr("cx", value => xScale(value.x))
          .attr("cy", value => yScale(value.y))
          .style('opacity', 0.75)
          .style('fill', 'black')},
        update => update.attr("class", "updated")
        .attr("r", 1)
        .attr("cx", value => xScale(value.xcoord))
        .attr("cy", value => yScale(value.ycoord))
        .style('opacity', 0.75)
        .style('fill', value => { return myColor(value.cluster)}),
        exit => exit
        .transition()
        .delay(1000)
        .attr('r', 0)
        .remove()
  )
}, [props.TSNEQuery, dimensions])

return (
  <React.Fragment>
    <div class="flex space-x-4"> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
          &#10226;
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
          Run
        </button>
    </div>
    <br />
    <svg ref={svgRef} width="100%" height="50vh">
      <g className="x-axis" />
      <g className="y-axis" />
    </svg>

  </React.Fragment>
)
}

