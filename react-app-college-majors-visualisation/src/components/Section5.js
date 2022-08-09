import {useState, useEffect, forwardRef, useRef} from 'react';
import styled from '@emotion/styled';
import {Paragraph} from './Paragraph';
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

const _Section5 = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef5 = useRef(null);
  const legendRef5 = useRef(null);
  const tooltipRef5 = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let shareWomenXScale, salaryYScale;

      const graph = d3.select(graphRef5.current);
      graph.select('svg#cool').remove();

      function colorByGender(d, i) {
        if (d.ShareWomen < 0.4) {
          return 'blue';
        } else if (d.ShareWomen > 0.6) {
          return 'red';
        } else {
          return 'grey';
        }
      }

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createLabel = (dataset) => {};

      const createAxis = (dataset) => {
        const bestFitLine = [
          {x: 0, y: 56093},
          {x: 1, y: 25423},
        ];
        const lineFunction = d3
          .line()
          .x((d) => shareWomenXScale(d.x))
          .y((d) => salaryYScale(d.y));

        // Axes for Scatter Plot
        svg
          .append('path')
          .transition()
          .duration(430)
          .attr('class', 'best-fit')
          .attr('d', lineFunction(bestFitLine))
          .attr('stroke', 'grey')
          .attr('stroke-dasharray', 6.2)
          // .attr('opacity', 0)
          .attr('stroke-width', 3);

        const scatterxAxis = d3.axisBottom(shareWomenXScale);
        const scatteryAxis = d3.axisLeft(salaryYScale).tickSize([width]);

        svg
          .append('g')
          .call(scatterxAxis)
          .attr('class', 'scatter-x')
          .attr('transform', `translate(0, ${height + margin.top})`);

        svg
          .append('g')
          .call(scatteryAxis)
          .attr('class', 'scatter-y')
          .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
          .attr('stroke-opacity', 0.2)
          .attr('stroke-dasharray', 2.5);
      };

      const createGraph = (dataset) => {
        svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('fill', colorByGender)
          .attr('r', 10);

        svg
          .selectAll('circle')
          .transition()
          .duration(800)
          .ease(d3.easeBack)
          .attr('cx', (d) => shareWomenXScale(d.ShareWomen))
          .attr('cy', (d) => salaryYScale(d.Median));
      };

      const createLegend = (dataset) => {};

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);
          shareWomenXScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.ShareWomen),
            [margin.left, margin.left + width]
          );
          salaryYScale = d3.scaleLinear(
            [20000, 110000],
            [margin.top + height, margin.top]
          );

          createAxis(dataset);
          createLegend(dataset);
          createGraph(dataset);
          createLabel(dataset); // https://stackoverflow.com/questions/17786618/how-to-use-z-index-in-svg-elements
          return;
        })
        .then(() => {
          if (isDesktop) {
            // https://stackoverflow.com/questions/64910052/d3-js-v6-2-get-data-index-in-listener-function-selection-onclick-listene
            d3.select(graphRef5.current)
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
    d3.select(tooltipRef5.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef5.current).style('display', 'none');

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
    d3.select(tooltipRef5.current)
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
            <Paragraph>
              {
                'When we plot the % of students in a major being female against the median salary of students in the major, a fairly clear trend emerges. It appears that majors with a higher proportion of male students also produce students with higher median wages.'
              }
            </Paragraph>

            <Paragraph>
              {
                'In fact, a linear model would predict that for every added percentage of female students in a given major, the median annual salary drops by $306 USD.'
              }
            </Paragraph>

            <Legend ref={legendRef5} width={350} height={600}></Legend>
          </StyledDescription>
          <Graph ref={graphRef5} style={{}}></Graph>
          <Tooltip ref={tooltipRef5} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef5} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const Section5 = forwardRef(_Section5);

export {Section5};
