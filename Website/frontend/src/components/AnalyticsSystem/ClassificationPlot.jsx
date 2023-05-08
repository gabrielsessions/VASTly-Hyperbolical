// Import Stuff Here!
import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, scaleLinear, scaleSequential, scaleOrdinal, axisRight, interpolateRainbow, symbolCircle, symbolCross, symbolSquare, symbolTriangle, symbolStar, symbolDiamond, symbolWye, symbolX, symbol} from "d3";

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

function RunButton(props){
  function handleClick(){
    const clusters = props.checkboxes.reduce(
      (acc, val, index) => (val ? acc.concat(index-1) : acc),
      []
    );
  
    let filterClause = "";

    if (Array.isArray(clusters) && clusters.length > 0) {
      filterClause = `car.cluster IN (${clusters.map((item) => `${item}`).join(", ")})`;
    }
    
    console.log(filterClause)
    props.setFilters((prev)=>{
      const newFilters = {...prev};
      newFilters["TSNE"] = [filterClause];

      return newFilters
    });
  }

  return (
    <div>
      <button onClick={handleClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">Run</button>
    </div>
  )
}

function CheckboxGroup(props) {

  function handleCheckboxChange(index) {
    props.setCheckboxes((prev)=>{
    const newCheckboxes = [...props.checkboxes];
    newCheckboxes[index] = !newCheckboxes[index];
    return newCheckboxes });
  }

  return (
        <div className="checks">
          <div className = "col1">
            {props.checkboxes.slice(0, 10).map((checked, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  value={index-1}
                  style={{"color":colorRecode(myColor(index-1)), "background-color": colorRecode(myColor(index-1))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}
                  checked={checked}
                  onChange={() => handleCheckboxChange(index)}
                />
                <label>{index - 1}</label>
              </div>
            ))}
          </div>
          <br/>
          <div className = "col2">
            {props.checkboxes.slice(10).map((checked, index) => (
              <div key={index + 10}>
                <input
                  type="checkbox"
                  value={index+9}
                  style={{"color":colorRecode(myColor(index+9)), "background-color": colorRecode(myColor(index+9))}} className={`w-4 h-4 border-gray-300 rounded focus:ring-0 focus:ring-offset-0`}
                  checked={checked}
                  onChange={() => handleCheckboxChange(index + 10)}
                />
                <label>{index + 9}</label>
              </div>
          ))}
          </div>
        </div>
  );
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

export default function ClassificationPlot(props) {
  const [checkboxes, setCheckboxes] = useState(
    new Array(20).fill(true)
  );

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
    const xbuffer=(axesLimits[1]-axesLimits[0])*.05
    const ybuffer=(axesLimits[3]-axesLimits[2])*.05

    if (!dimensions) return;

    //define scales
    const xScale = scaleLinear()
      .domain([axesLimits[0]-xbuffer, axesLimits[1]+xbuffer])
      .range([0, dimensions.width]);

    const yScale = scaleLinear()
      .domain([axesLimits[2]-ybuffer, axesLimits[3]+ybuffer])
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

    const cartypes = ["1","2","2P","3","4","5","6"]

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
    svg.selectAll(".dot").remove();

    svg
      .selectAll(".dot")
      .data(data)
      .join(
        enter =>{console.log("enter");
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
        <h1>DBSCAN Clusters</h1>
        <CheckboxGroup checkboxes={checkboxes} setCheckboxes={setCheckboxes}/>
        <br />
        <div className='buttons'> 
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded shadow-md">
            &#10226;
          </button>
          <br />
          <RunButton interTSNE ={props.interTSNE} checkboxes={checkboxes} setFilters={props.setFilters}/>
        </div>
        <div className="symbology">
          <h1>&#x25CF; 2 axle car</h1>
          <h1>&#10010; 2 axle truck</h1>
          <h1>&#x25A0; 3 axle truck</h1>
          <h1>&#x2605; 4+ axle truck</h1>
          <h1>&#x25B2; 2 axle bus</h1>
          <h1>&#x311A; 3 axle bus</h1>
          <h1>&#x25C6; park vehicle</h1>
        </div>
      </div>
      <div className="pointplot scatter">
        <svg ref={svgRef} width="35vw" height="75vh" className="scatter">
{/*           <g className="x-axis" />
          <g className="y-axis" />  */}
        </svg>
      </div>
    </div>

  </React.Fragment>
)
}

