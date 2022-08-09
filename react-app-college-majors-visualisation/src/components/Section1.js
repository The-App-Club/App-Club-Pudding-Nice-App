import {useState, useEffect, forwardRef, useRef} from 'react';
import styled from '@emotion/styled';
import {Paragraph} from './Paragraph';
import {SectionHeader} from './SectionHeader';
import {Graph} from './Graph';
import {Legend} from './Legend';
import {Tooltip} from './Tooltip';

import {isDesktop, isTablet, isMobile} from 'react-device-detect';
import 'array-each-slice';
import * as d3 from 'd3';
import {legendColor} from 'd3-svg-legend';

import {
  margin,
  width,
  height,
  colors,
  categories,
  adjustRadius,
  adjustX,
  adjustY,
  adjustCollide,
  getCategoriesXY,
} from '../plugins/graph';
import {loadData} from '../plugins/data';

const StyledSection = styled.section`
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  background-color: aliceblue;
  padding: 0 100px 0;
`;

const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  max-width: 300px;
`;

const _Section1 = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef = useRef(null);
  const legendRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;

      const categoryColorScale = d3.scaleOrdinal(categories, colors);

      const graph = d3.select(graphRef.current);
      graph.select('svg#cool').remove();

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createAxis = (dataset) => {};

      const createGraph = (dataset) => {
        const salarySizeScale = d3.scaleLinear(
          d3.extent(dataset, (d) => d.Median),
          [5, 35]
        );

        const categoriesXY = isDesktop
          ? getCategoriesXY(4, 200, 200)
          : getCategoriesXY(16, 140, 170);

        // Selection of all the circles
        const nodes = svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', (d) => salarySizeScale(d.Median) * adjustRadius())
          .attr('fill', (d) => categoryColorScale(d.Category));

        // Define each tick of simulation
        simulation.on('tick', () => {
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });

        simulation
          .force('charge', d3.forceManyBody().strength([2]))
          .force(
            'forceX',
            d3.forceX((d) => categoriesXY[d.Category][0] + adjustX())
          )
          .force(
            'forceY',
            d3.forceY((d) => categoriesXY[d.Category][1] + adjustY())
          )
          .force(
            'collide',
            d3.forceCollide((d) => salarySizeScale(d.Median) + adjustCollide())
          )
          .alpha(0.9)
          .alphaDecay([0.02])
          .restart();
      };

      const createLegend = (dataset) => {
        const svg = d3.select(legendRef.current);

        const g = svg.append('g').attr('transform', `translate(${20},${50})`);

        const categoryLegend = legendColor()
          .shape('path', d3.symbol().type(d3.symbolCircle).size(150)())
          .shapePadding(2)
          .scale(categoryColorScale);

        g.call(categoryLegend);
      };

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);
          createAxis(dataset);
          createLegend(dataset);
          createGraph(dataset);
          return;
        })
        .then(() => {
          if (isDesktop) {
            // https://stackoverflow.com/questions/64910052/d3-js-v6-2-get-data-index-in-listener-function-selection-onclick-listene
            d3.select(graphRef.current)
              .selectAll('circle')
              .on('mouseover', mouseOver)
              .on('mouseout', mouseOut)
              .on('mouseleave', mouseLeave);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      return () => {
        simulation.stop();
      };
    }
  }, [sectionNumber, activeSectionNumber]);

  function mouseLeave(event, data) {
    d3.select(tooltipRef.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef.current).style('display', 'none');

    d3.select(this)
      .transition()
      .duration(150)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOver(event, data) {
    setTooltipData(data);
    d3.select(this)
      .transition()
      .duration(150)
      .attr('opacity', 1)
      .attr('stroke-width', 3)
      .attr('stroke', 'black');

    // https://stackoverflow.com/questions/16256454/d3-js-position-tooltips-using-element-position-not-mouse-position
    d3.select(tooltipRef.current)
      .transition()
      .duration(250)
      .style('left', event.pageX + 10 + 'px')
      .style('top', event.pageY - 25 + 'px')
      .style('display', 'inline-block');
  }

  const renderSection = () => {
    if (isDesktop) {
      return (
        <StyledSection ref={ref}>
          <StyledDescription>
            <SectionHeader>{`Section ${sectionNumber}`}</SectionHeader>
            <Paragraph>
              {
                "Here, we have clustered the majors based on the broader category, of which there are 16 in total. The size of the bubbles represent the median salary of graduates from the major. When sorted like this, it's quite clear that engineering majors of all kinds have generally above-average median salaries."
              }
            </Paragraph>
            <Paragraph>
              {
                'On the other end, it appears that majors in the field of psychology on average have the lowest graduate salaries.'
              }
            </Paragraph>
            <Legend ref={legendRef} width={350} height={600}></Legend>
          </StyledDescription>
          <Graph ref={graphRef} style={{}}></Graph>
          <Tooltip ref={tooltipRef} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const Section1 = forwardRef(_Section1);

export {Section1};
