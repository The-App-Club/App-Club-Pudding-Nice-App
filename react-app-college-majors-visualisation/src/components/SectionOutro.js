import {useState, useEffect, forwardRef, useRef} from 'react';
import styled from '@emotion/styled';
import {Paragraph} from './Paragraph';
import {Link} from './Link';
import {Graph} from './Graph';
import {Tooltip} from './Tooltip';

import {isDesktop, isTablet, isMobile} from 'react-device-detect';
import 'array-each-slice';
import * as d3 from 'd3';

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

const _SectionOutro = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef7 = useRef(null);
  const tooltipRef7 = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let salarySizeScale;
      const categoryColorScale = d3.scaleOrdinal(categories, colors);

      const graph = d3.select(graphRef7.current);
      graph.select('svg#cool').remove();

      const svg = graph
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);

      const createLabel = (dataset) => {};

      const createAxis = (dataset) => {};

      const createGraph = (dataset) => {
        const nodes = svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', (d) => salarySizeScale(d.Median) * 1.6)
          .attr('fill', (d) => categoryColorScale(d.Category));

        // Define each tick of simulation
        simulation.on('tick', () => {
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });

        simulation
          .force('forceX', d3.forceX(500))
          .force('forceY', d3.forceY(500))
          .force(
            'collide',
            d3.forceCollide((d) => salarySizeScale(d.Median) * 1.6 + 4)
          )
          .alpha(0.6)
          .alphaDecay(0.05)
          .restart();
      };

      const createLegend = (dataset) => {};

      loadData()
        .then((dataset) => {
          simulation = d3.forceSimulation(dataset);
          salarySizeScale = d3.scaleLinear(
            d3.extent(dataset, (d) => d.Median),
            [5, 35]
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
            d3.select(graphRef7.current)
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
    d3.select(tooltipRef7.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef7.current).style('display', 'none');

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
    d3.select(tooltipRef7.current)
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
                'Hopefully, this has helped you in deciding what major you hope to study. If you want to take a deeper look into the data for yourself, you can download all the csv files'
              }
              <Link
                href={
                  'https://www.kaggle.com/fivethirtyeight/fivethirtyeight-college-majors-dataset'
                }
              >
                dataset here
              </Link>
            </Paragraph>
          </StyledDescription>
          <Graph ref={graphRef7} style={{}}></Graph>
          <Tooltip ref={tooltipRef7} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef7} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const SectionOutro = forwardRef(_SectionOutro);

export {SectionOutro};
