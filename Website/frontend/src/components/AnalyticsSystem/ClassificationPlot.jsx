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

var myColor = scaleSequential()
.domain([-1,18])
.interpolator(interpolateRainbow);

function itemToHex(c) {
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function colorRecode(color){
  function rgbToHex(rgb) {
    // Convert each RGB component to its corresponding hex value
    const r = rgb[0].toString(16).padStart(2, "0");
    const g = rgb[1].toString(16).padStart(2, "0");
    const b = rgb[2].toString(16).padStart(2, "0");
    
    // Concatenate the hex values to form the final hex code
    const hexCode = `#${r}${g}${b}`;
    
    return hexCode;
  }

  const integerRegex = /\d+/g; // Match one or more digits
  const matches = color.match(integerRegex); // Find all matches of the regex in the string
  const integers = matches.map(Number); // Convert each match to a number
  
  return rgbToHex(integers);
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
        enter =>{console.log("enter");console.log(colorRecode(myColor(-1)));
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


    <div className="scatterplot">
      <div className = "legend" id="clusters">

        <div className="checks">
          <div className = "col1">
            <label ><input type="checkbox" value="-1" style={{"color":colorRecode(myColor(-1)), "background-color": colorRecode(myColor(-1))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>unclustered</label><br />
            <label ><input type="checkbox" value="0" style={{"color":colorRecode(myColor(0)), "background-color": colorRecode(myColor(0))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>0</label><br />
            <label ><input type="checkbox" value="1" style={{"color":colorRecode(myColor(1)), "background-color": colorRecode(myColor(1))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>1</label><br />
            <label ><input type="checkbox" value="2" style={{"color":colorRecode(myColor(2)), "background-color": colorRecode(myColor(2))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>2</label><br />
            <label ><input type="checkbox" value="3" style={{"color":colorRecode(myColor(3)), "background-color": colorRecode(myColor(3))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>3</label><br />
            <label ><input type="checkbox" value="4" style={{"color":colorRecode(myColor(4)), "background-color": colorRecode(myColor(4))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>4</label><br />
            <label ><input type="checkbox" value="5" style={{"color":colorRecode(myColor(5)), "background-color": colorRecode(myColor(5))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>5</label><br />
            <label ><input type="checkbox" value="6" style={{"color":colorRecode(myColor(6)), "background-color": colorRecode(myColor(6))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>6</label><br />
            <label ><input type="checkbox" value="7" style={{"color":colorRecode(myColor(7)), "background-color": colorRecode(myColor(7))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>7</label><br />
            <label ><input type="checkbox" value="8" style={{"color":colorRecode(myColor(8)), "background-color": colorRecode(myColor(8))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>8</label><br />
          </div>
          <div className = "col2">
            <label ><input type="checkbox" value="9" style={{"color":colorRecode(myColor(9)), "background-color": colorRecode(myColor(9))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>9</label><br />
            <label ><input type="checkbox" value="10" style={{"color":colorRecode(myColor(10)), "background-color": colorRecode(myColor(10))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>10</label><br />
            <label ><input type="checkbox" value="11" style={{"color":colorRecode(myColor(11)), "background-color": colorRecode(myColor(11))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>11</label><br />
            <label ><input type="checkbox" value="12" style={{"color":colorRecode(myColor(12)), "background-color": colorRecode(myColor(12))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>12</label><br />
            <label ><input type="checkbox" value="13" style={{"color":colorRecode(myColor(13)), "background-color": colorRecode(myColor(13))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>13</label><br />
            <label ><input type="checkbox" value="14" style={{"color":colorRecode(myColor(14)), "background-color": colorRecode(myColor(14))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>14</label><br />
            <label ><input type="checkbox" value="15" style={{"color":colorRecode(myColor(15)), "background-color": colorRecode(myColor(15))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>15</label><br />
            <label ><input type="checkbox" value="16" style={{"color":colorRecode(myColor(16)), "background-color": colorRecode(myColor(16))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>16</label><br />
            <label ><input type="checkbox" value="17" style={{"color":colorRecode(myColor(17)), "background-color": colorRecode(myColor(17))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>17</label><br />
            <label ><input type="checkbox" value="18" style={{"color":colorRecode(myColor(18)), "background-color": colorRecode(myColor(18))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}/>18</label><br />
          </div>
        </div>
        <br />
        <div className='buttons'> 
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
            &#10226;
          </button>
          <br />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
            Run
          </button>
        </div>

      </div>

      <div className="pointplot">
        <svg ref={svgRef} width="35vw" height="50vh">
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </div>

  </React.Fragment>
)
}

