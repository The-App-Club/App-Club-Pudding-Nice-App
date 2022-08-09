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

import {
  rect,
  margin,
  width,
  height,
  colors,
  categories,
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

const _Section3 = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef3 = useRef(null);
  const legendRef3 = useRef(null);
  const tooltipRef3 = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let histXScale, histYScale;
      const categoryColorScale = d3.scaleOrdinal(categories, colors);

      // rect.height = rect.height = 1300
      // rect.width = rect.width = 1100

      const graph = d3.select(graphRef3.current);
      graph.select('svg#cool').remove();

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', rect.width + margin.left + margin.right)
        .attr('height', rect.height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createLabel = (dataset) => {};

      const createAxis = (dataset) => {
        let xAxis = d3.axisBottom(histXScale);
        svg
          .append('g')
          .attr('class', 'hist-axis')
          .attr('transform', `translate(0, ${height + margin.top + 10})`)
          .call(xAxis);
      };

      const createGraph = (dataset) => {
        svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', 10)
          .transition()
          .duration(600)
          .delay((d, i) => i * 2)
          .ease(d3.easeBack)
          .attr('cx', (d) => histXScale(d.Midpoint))
          .attr('cy', (d) => histYScale(d.HistCol))
          .attr('fill', (d) => categoryColorScale(d.Category));
      };

      const createLegend = (dataset) => {};

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);
          histXScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.Midpoint),
            [margin.left, margin.left + width]
          );
          histYScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.HistCol),
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
            d3.select(graphRef3.current)
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
    d3.select(tooltipRef3.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef3.current).style('display', 'none');

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
    d3.select(tooltipRef3.current)
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
                'If we rearrange all the data points into a histogram format, the salary potential of engineering majors becomes even more stark, as almost all the points on the right of the graph are colored yellow, for engineering. As for all the other majors, they follow a fairly diverse yet tightly spaced distribution, with the modal class being salaries between $34,000 and $36,000.'
              }
            </Paragraph>
            <Legend ref={legendRef3} width={350} height={600}></Legend>
          </StyledDescription>
          <Graph ref={graphRef3} style={{}}></Graph>
          <Tooltip ref={tooltipRef3} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef3} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const Section3 = forwardRef(_Section3);

export {Section3};
