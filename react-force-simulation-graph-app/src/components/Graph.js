import {useEffect, useCallback, useRef, useLayoutEffect} from 'react';
import * as d3 from 'd3';
import {transform} from 'framer-motion';
import Color from 'color';

const categroies = [
  'American Express',
  'Discover Card',
  'JCB',
  'Mastercard',
  'Visa',
  'Bankcard',
  'China UnionPay',
  'Maestro',
  'Cowboy Bebop',
];
const width = 300,
  height = 300,
  margin = {top: 20, left: 30, right: 10, bottom: 10},
  r = 10,
  gutterX = 30,
  gutterY = r * 2;
let categoryColorScale;
const Graph = ({dataPath, tik}) => {
  const graphDomRef = useRef(null);
  const nodesDomRef = useRef(null);
  const simulatorRef = useRef(null);

  const loadData = useCallback(({path}) => {
    return new Promise(async (resolve, reject) => {
      try {
        const response = await fetch(path);
        const json = response.json();
        resolve(json);
      } catch (error) {
        reject(error);
      }
    });
  }, []);

  const ticked = useCallback(() => {
    // console.log(1);
    nodesDomRef.current
      .attr('opacity', function (d) {
        return 1;
      })
      .attr('cx', function (d) {
        return d.x;
      })
      .attr('cy', function (d) {
        return d.y;
      });
  }, [nodesDomRef]);

  useLayoutEffect(() => {
    loadData({path: dataPath}).then((dataset) => {
      const priceList = dataset.map((data, index) => {
        return data.price;
      });
      categoryColorScale = d3.scaleOrdinal(categroies, d3.schemeTableau10);
      nodesDomRef.current = d3
        .select(graphDomRef.current)
        .attr('width', width)
        .attr('height', height)
        .attr('viewbox', `0 0 ${width} ${height}`)
        .selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('r', function (d) {
          return r;
        })
        .attr('cx', function (d) {
          return margin.left + d.grp * gutterX;
        })
        .attr('cy', function (d) {
          return height - margin.top - d.grpSeq * gutterY;
        })
        .attr('opacity', function (d) {
          return 0;
        })
        .attr('fill', function (d) {
          const minPrice = Math.min(...priceList);
          const maxPrice = Math.max(...priceList);
          const c = categoryColorScale(d.ccType);
          const t = transform([minPrice, maxPrice], [0.25, 1])(d.price);
          const g = Color(c).alpha(t);
          return g.toString();
        });
      simulatorRef.current = d3
        .forceSimulation(dataset)
        .on('tick', ticked)
        .stop();
    });
    return () => {
      nodesDomRef.current.exit().remove();
    };
  }, [dataPath, loadData, ticked]);

  useEffect(() => {
    if (!simulatorRef.current) {
      return;
    }
    switch (tik) {
      case 1:
        simulatorRef.current
          .force(
            'x',
            d3.forceX(function (d) {
              return d.grpSeq * gutterY;
            })
          )
          .force(
            'y',
            d3.forceY(function (d) {
              return d.grp * gutterX;
            })
          )
          .alpha([1])
          .restart();
        break;
      case 2:
        simulatorRef.current
          .force(
            'x',
            d3.forceX(function (d) {
              return d.grp * gutterX;
            })
          )
          .force(
            'y',
            d3.forceY(function (d) {
              return height - d.grpSeq * gutterY;
            })
          )
          .alpha([1])
          .restart();
        break;
      case 3:
        simulatorRef.current
          .force(
            'x',
            d3.forceX(function (d) {
              return height - d.grpSeq * gutterY;
            })
          )
          .force(
            'y',
            d3.forceY(function (d) {
              return width - d.grp * gutterX;
            })
          )
          .alpha([1])
          .restart();
        break;
      case 4:
        simulatorRef.current
          .force(
            'x',
            d3.forceX(function (d) {
              return width - d.grp * gutterX;
            })
          )
          .force(
            'y',
            d3.forceY(function (d) {
              return d.grpSeq * gutterY;
            })
          )
          .alpha([1])
          .restart();
        break;
      default:
        break;
    }
  }, [tik]);
  return <svg ref={graphDomRef} />;
};

export {Graph};
