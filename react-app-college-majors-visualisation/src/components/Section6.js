import {useState, useEffect, forwardRef, useRef} from 'react';
import styled from '@emotion/styled';
import {Paragraph} from './Paragraph';
import {Graph} from './Graph';
import {Legend} from './Legend';
import {Tooltip} from './Tooltip';

import {isDesktop, isTablet, isMobile} from 'react-device-detect';
import 'array-each-slice';
import * as d3 from 'd3';
import {legendSize} from 'd3-svg-legend';

import {margin, width, height, categories, colors} from '../plugins/graph';
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

const _Section6 = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef6 = useRef(null);
  const legendRef6 = useRef(null);
  const tooltipRef6 = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let enrollmentSizeScale, enrollmentScale;
      const categoryColorScale = d3.scaleOrdinal(categories, colors);

      const graph = d3.select(graphRef6.current);
      graph.select('svg#cool').remove();

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createLabel = (dataset) => {};

      const createAxis = (dataset) => {
        const histxAxis = d3.axisBottom(enrollmentScale);
        svg
          .append('g')
          .attr('class', 'enrolment-axis')
          .attr('transform', 'translate(0, 700)')
          .call(histxAxis);
      };

      const createGraph = (dataset) => {
        const nodes = svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', (d) => enrollmentSizeScale(d.Total))
          .attr('fill', (d) => categoryColorScale(d.Category));

        // Define each tick of simulation
        simulation.on('tick', () => {
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });

        simulation
          .force(
            'forceX',
            d3.forceX((d) => enrollmentScale(d.Total))
          )
          .force('forceY', d3.forceY(500))
          .force(
            'collide',
            d3.forceCollide((d) => enrollmentSizeScale(d.Total) + 2)
          )
          .alpha(0.8)
          .alphaDecay(0.05)
          .restart();
      };

      const createLegend = (dataset) => {
        const svg = d3.select(legendRef6.current);

        const g = svg.append('g').attr('transform', `translate(50,100)`);

        const legend = legendSize()
          .scale(enrollmentSizeScale)
          .shape('circle')
          .shapePadding(55)
          .orient('horizontal')
          .title('Enrolment Scale')
          .labels(['1000', '200000', '400000'])
          .labelOffset(30)
          .cells(3);

        g.call(legend);
      };

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);
          enrollmentSizeScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.Total),
            [10, 60]
          );
          enrollmentScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.Total),
            [margin.left + 120, margin.left + width - 50]
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
            d3.select(graphRef6.current)
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
    d3.select(tooltipRef6.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef6.current).style('display', 'none');

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
    d3.select(tooltipRef6.current)
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
                'So we\'ve seen the most "profitable" majors, as well as the ones with the most uneven gender distributions. But what are students actually enrolling in the most frequently? What can enrolment numbers tell us about actual interest in each major? This chart has the bubbles sized based on the number of students enrolled in each major, and coloured by category.'
              }
            </Paragraph>

            <Legend ref={legendRef6} width={350} height={400}></Legend>

            <Paragraph>
              {
                'Psychology is the clear leader in this regard, with over 390,000 students enrolled. Business related topics such as general business, business management, accounting and finance are all also heavily enrolled.'
              }
            </Paragraph>
          </StyledDescription>
          <Graph ref={graphRef6} style={{}}></Graph>
          <Tooltip ref={tooltipRef6} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef6} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const Section6 = forwardRef(_Section6);

export {Section6};
