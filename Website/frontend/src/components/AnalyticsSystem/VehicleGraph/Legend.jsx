import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const Legend = ({ data, colors, className }) => {
  const ref = useRef(null);

  useEffect(() => {
    const svg = d3.select(ref.current);

    const legend = svg.selectAll('.legend')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'legend')
      .attr('transform', (d, i) => `translate(2, ${i * 30})`);
      ;

    legend.append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', 12)
      .attr('height', 12)
      .style('fill', (d, i) => colors(i));

    legend.append('text')
      .attr('x', 24)
      .attr('y', 9)
      .attr('dy', '.2em')
      .style('font-size', "12px")
      .text((d) => d);

  }, [data, colors]);

  return (
    <svg className={className} ref={ref}></svg>
  );
};

export default Legend;
