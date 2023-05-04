// Import Stuff Here!
import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, scaleLinear, scaleSequential, scaleOrdinal, axisRight, interpolateRainbow, symbolCircle, symbolCross, symbolSquare, symbolTriangle, symbolStar, symbolDiamond, symbolWye, symbol} from "d3";

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

  function calcMinMax(data){
    var xMin = Math.floor(Math.min(...Object.values(data).map(point => parseFloat(point.xcoord))))
    var xMax = Math.ceil(Math.max(...Object.values(data).map(point => parseFloat(point.xcoord))))
    var yMin = Math.floor(Math.min(...Object.values(data).map(point => parseFloat(point.ycoord))))
    var yMax = Math.ceil(Math.max(...Object.values(data).map(point => parseFloat(point.ycoord))))

    return [xMin,xMax,yMin,yMax]
}

  useEffect(() => {
    const svg = select(svgRef.current);
    const data = props.TSNEQuery.data;
    //const clusters = props.TSNEQuery.data;
    var axesLimits=calcMinMax(data)

    if (!dimensions) return;

    //define scales
    const xScale = scaleLinear()
      .domain([axesLimits[0]*1.05, axesLimits[1]*1.05])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([axesLimits[2]*1.05, axesLimits[3]*1.05])
      .range([dimensions.height, 0]);


    var myColor = scaleSequential()
    .domain([-1,18])
    .interpolator(interpolateRainbow);

    var determineDotSize = scaleLinear()
      .domain([0, 18708])
      .range([50,5])

      var determineDotOpacity = scaleLinear()
      .domain([0, 18708])
      .range([.8,.2])

    function determineDotShape(value){
            
      if (value.cartype=="1"){
          return symbol().size(determineDotSize(data.length)).type(symbolCircle)()
      }
      else if (value.cartype=="2"){
        return symbol().size(determineDotSize(data.length)).type(symbolCross)()
      }
      else if (value.cartype=="2P"){
        return symbol().size(determineDotSize(data.length)).type(symbolDiamond)()
      }
      else if (value.cartype=="3"){
        return symbol().size(determineDotSize(data.length)).type(symbolSquare)()
      }
      else if (value.cartype=="4"){
        return symbol().size(determineDotSize(data.length)).type(symbolStar)()
      }
      else if (value.cartype=="5"){
        return symbol().size(determineDotSize(data.length)).type(symbolTriangle)()
      }
      else if (value.cartype=="6"){
        return symbol().size(determineDotSize(data.length)).type(symbolWye)()
      }
    }

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
      .selectAll(".dot")
      .data(data)
      .join(
        enter =>{console.log(data);console.log(determineDotSize(data.length));
        return enter.append("path")
          .attr("class", "dot")
          .attr("opacity", determineDotOpacity(data.length))
          .attr("stroke","black")
          .attr("stroke-opacity", 0)
          .attr("r", 1)
          .attr('d', value => determineDotShape(value))
          .attr("cx", value => xScale(value.xcoord))
          .attr("cy", value => yScale(value.ycoord))
          .attr('transform', value => 'translate(' + xScale(value.xcoord) + ', ' + yScale(value.ycoord) + ')')
          .attr('fill', value => { return myColor(value.cluster)})},
        update => update.attr("class", "updated")
          .transition()
          .attr("opacity", determineDotOpacity(data.length))
          .attr("stroke","black")
          .attr("stroke-opacity", 0)
          .attr("r", 1)
          .attr('d', value => determineDotShape(value))
          .attr("cx", value => xScale(value.xcoord))
          .attr("cy", value => yScale(value.ycoord))
          .attr('transform', value => 'translate(' + xScale(value.xcoord) + ', ' + yScale(value.ycoord) + ')')
          .attr('fill', value => { return myColor(value.cluster)}),
        exit => exit
          .remove()
  )
}, [props.TSNEQuery, dimensions])

return (
  <React.Fragment>
    <div class='display:flex;'> 
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
          &#10226;
        </button>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
          Run
        </button>
    </div>

    <div className="scatterplot">
      <div className = "legend" id="clusters">
        <label><input type="checkbox" value="-1" className="w-4 h-4 text-[ ${myColor(-1) }] bg-[ ${myColor(-1) }] border-gray-300 rounded focus:ring-0 focus:ring-offset-0"/>unclustered</label><br />
        <label><input type="checkbox" value="0" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"/>0</label><br />
        <label><input type="checkbox" value="1" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"/>1</label><br />
        <label><input type="checkbox" value="2" className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-0 focus:ring-offset-0"/>2</label><br />
      </div>
      <div className="pointplot">
        <svg ref={svgRef} width="100%" height="50vh">
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>

  </React.Fragment>
)
}

