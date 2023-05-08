import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';

function brushed() {
  const selection = d3.event.selection();
  if (selection) {
    const [x0, x1] = selection.map(xScale.invert);
    xScale.domain([x0, x1]);
    xAxis.call(d3.axisBottom(xScale));
    linePath.attr("d", line);
  }
}

const carTypeNameToNum = {
  "2 Axle Car": "1",
  "2 Axle Truck": "2",
  "2 Axle Park Truck": "2P",
  "3 Axle Truck": "3",
  "4+ Axle Truck": "4",
  "2 Axle Bus": "5",
  "3 Axle Bus": "6"
}

const carTypeToIndex = {
  "2 Axle Car": 0,
  "2 Axle Truck": 1,
  "2 Axle Park Truck": 2,
  "3 Axle Truck": 3,
  "4+ Axle Truck": 4,
  "2 Axle Bus": 5,
  "3 Axle Bus": 6
}

const MultipleLinePlot = ({ data, setTimeRange, selectCarType }) => {
  const svgRef = useRef();

  const [carSelection, setCarSelection] = useState(0);


  useEffect(() => {
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const width = window.innerWidth / 2 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;


    d3.selectAll('.line').remove();
    d3.selectAll(".axis").remove();

    const svg = d3.select(svgRef.current)
      .selectAll('svg')
      .data([null])
      .join('svg') 
      .attr('width', '100vh')
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('class','axis')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    

    const xScale = d3.scaleTime()
      .range([0, width])
      .domain(d3.extent(data[carSelection].values, d => new Date(d.date)));

    const yScale = d3.scaleLinear()
      .range([height, 0])
      .domain([0, d3.max(data, d => d3.max(d.values, v => v.value))]);

    const xAxis = d3.axisBottom(xScale)
      .tickFormat(d3.timeFormat('%Y-%m-%d'));

    const yAxis = d3.axisLeft(yScale);
    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .attr('class', 'axis')
      .attr('id', 'x-axis')
      .call(xAxis);

    svg.append('g')
      .attr('class', 'axis')
      .call(yAxis);

    
    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis)
      .append('text')
      .attr('x', width / 2)
      .attr('y', margin.bottom / 2 + 10)
      .attr('fill', '#000')
      .attr('text-anchor', 'middle')
      .text('Date');

      // append the y axis
      svg.append('g')
        .call(yAxis)
        .append('text')
        .attr('transform', 'rotate(-90)')
        .attr('x', -height / 2)
        .attr('y', -margin.left + 15)
        .attr('fill', '#000')
        .attr('text-anchor', 'middle')
        .text('Number of Gate Triggers');

      
    // define the brush
    const brush = d3.brushX()
      .extent([[0, 0], [width, height]])
      .on('start', () => {
 
        //setSelectedRange(null);
      })
      .on('brush', ({ selection }) => {

        if (selection) {
          const [x0, x1] = selection.map(xScale.invert);

          // filter the data based on the selected range
          const filteredData = data.map((d) => ({
            name: d.name,
            values: d.values.filter((v) => {
              const date = new Date(v.date);
              return date >= x0 && date <= x1;
            }),
            color: d.color,
          }));

          //setSelectedRange([x0, x1]);
          //updateChart(filteredData);
        }
      })
      .on('end', ({ selection }) => {
        if (selection) {
          setTimeRange({
            startDate: xScale.invert(selection[0]).toISOString(),
            endDate: xScale.invert(selection[1]).toISOString()
          })
          d3.selectAll('g.brush').remove()
        }
      });

    // append the brush
    const brushGroup = svg.append('g')
      .attr('class', 'brush')
      .call(brush);


    const line = d3.line()
      .x(d => xScale(new Date(d.date)))
      .y(d => yScale(d.value));

    console.log("Hello!");
    svg.selectAll('.line')
      .data(data)
      .join('path')
      .attr('class', 'line')
      .attr('d', d => line(d.values))
      .style('stroke', (d, i) => d.color)
      .style('stroke-width', 2)
      .style('fill', 'none')
      .on('click', (e, i) => {
        console.log(carTypeNameToNum[i.name]);
        setCarSelection(carTypeToIndex[i.name]);
        selectCarType(carTypeNameToNum[i.name]);
        
      });

    // Add legend
    const legend = svg.append('g')
      .attr('class', 'legend')
      .attr('transform', `translate(${width - 110}, 0)`);

    legend.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('width', 20)
      .attr('height', 20)
      .attr('x', 0)
      .attr('y', (d, i) => i * 25)
      .style('fill', d => d.color);

    legend.selectAll('text')
      .data(data)
      .join('text')
      .attr('x', 25)
      .attr('y', (d, i) => i * 25 + 15)
      .style('font-size', '13px')
      .text(d => d.name);


  }, [data]);

  return (
    <div class="liney">
      <svg ref={svgRef} className="lineplot"></svg>
    </div>
  );
};

export default MultipleLinePlot;
