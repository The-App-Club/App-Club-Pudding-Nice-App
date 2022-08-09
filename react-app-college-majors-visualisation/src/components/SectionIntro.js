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

import {margin, width, height} from '../plugins/graph';
import {loadData} from '../plugins/data';

const StyledSection = styled.section`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
  min-height: 100vh;
  background-color: aliceblue;
`;

const StyledDescription = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
  max-width: 300px;
`;

const _SectionIntro = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef = useRef(null);
  const legendRef = useRef(null);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let salaryXScale;

      const graph = d3.select(graphRef.current);
      graph.select('svg#cool').remove();

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createAxis = (dataset) => {
        const xAxis = d3
          .axisBottom(salaryXScale)
          .ticks(4)
          .tickSize(height + 80);

        svg
          .append('g')
          .attr('class', 'first-axis')
          .attr('transform', 'translate(0, 0)')
          .call(xAxis)
          .attr('stroke-opacity', 0.2)
          .attr('stroke-dasharray', 2.5);
      };

      const createGraph = (dataset) => {
        svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('fill', 'black')
          .attr('r', 3)
          .attr('cx', (d, i) => salaryXScale(d.Median) + 5)
          .attr('cy', (d, i) => i * 5)
          .attr('opacity', 0.8);
      };

      const createLegend = (dataset) => {};

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);

          salaryXScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.Median),
            [margin.left, margin.left + width + 250]
          );

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
            <SectionHeader>{`What is the best (undergraduate) college major in the United States?`}</SectionHeader>
            <Paragraph>
              {
                "(Note: If the visualisation doesn't fit your screen, try zooming out with ctrl + - / Cmd + -.)"
              }
            </Paragraph>
            <Paragraph>
              {
                "Most people want a degree which will enable them to make a lot of money upon graduation. Here are (almost) all the available degrees, sorted by the median salary received by students upon graduation. This graph gives us the ranking of each university major, based on the median salary of graduates. It gives us a rough sense of which majors have the highest pay, but it's somewhat hard to read. Let's take a more detailed journey through this data. Scroll down when you are ready! If you ever want to find out more about a bubble, just hover over it and a tooltip should appear. (Data was provided by FiveThirtyEight, and originally sourced from the American Community Survey 2010-2012 Public Use Microdata Series)"
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
      return <StyledSection ref={ref}>{'Mobile'}</StyledSection>;
    }
  };

  return <>{renderSection()}</>;
};

const SectionIntro = forwardRef(_SectionIntro);

export {SectionIntro};
