import {useEffect, useCallback, useRef, useMemo, useLayoutEffect} from 'react';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import {default as chance} from 'chance';

const numNodes = 5;
const width = 300,
  height = 300;
const xScale = d3.scaleLinear().domain([0, 1]).range([0, width]);
const yScale = d3.scaleLinear().domain([0, 1]).range([0, height]);
const Graph2 = ({tik}) => {
  const graphDomRef = useRef(null);
  const nodesDomRef = useRef(null);
  const simulatorRef = useRef(null);

  const dataset = useMemo(() => {
    return d3.range(numNodes).map((d, index) => {
      return {
        radius: chance().integer({min: 10, max: 20}),
        value: Math.random(),
        color: d3.interpolateBlues(
          transform([0, numNodes - 1], [0.5, 1])(index)
        ),
      };
    });
  }, []);

  const ticked = useCallback(() => {
    nodesDomRef.current
      .attr('r', function (d) {
        return d.radius;
      })
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      })
      .attr('fill', function (d) {
        return d.color;
      });
  }, [nodesDomRef]);

  useLayoutEffect(() => {
    nodesDomRef.current = d3
      .select(graphDomRef.current)
      .attr('width', width)
      .attr('height', height)
      .attr('viewbox', `0 0 ${width} ${height}`)
      .selectAll('circle')
      .data(dataset)
      .enter()
      .append('circle');

    simulatorRef.current = d3.forceSimulation(dataset).on('tick', ticked);

    return () => {
      nodesDomRef.current.exit().remove();
    };
  }, [dataset, ticked]);

  useEffect(() => {
    if (tik) {
      simulatorRef.current
        .force(
          'x',
          d3.forceX(function (d) {
            return 100;
          })
        )
        .force(
          'y',
          d3.forceY(function (d) {
            return yScale(d.value);
          })
        )
        .alpha([1])
        .alphaDecay([0])
        .restart();
    } else {
      simulatorRef.current
        .force(
          'x',
          d3.forceX(function (d) {
            return xScale(d.value);
          })
        )
        .force(
          'y',
          d3.forceY(function (d) {
            return 100;
          })
        )
        .alpha([1])
        .alphaDecay([0])
        .restart();
    }

    return () => {};
  }, [tik]);
  return <svg ref={graphDomRef} />;
};

export {Graph2};
