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
  margin,
  width,
  height,
  categories,
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

const _Section4 = ({sectionNumber, activeSectionNumber}, ref) => {
  const [tooltipData, setTooltipData] = useState({});

  const graphRef4 = useRef(null);
  const legendRef4 = useRef(null);
  const tooltipRef4 = useRef(null);

  useEffect(() => {
    if (sectionNumber === activeSectionNumber) {
      let simulation;
      let salarySizeScale;
      const categoriesXY = isDesktop
        ? getCategoriesXY(4, 200, 200)
        : getCategoriesXY(16, 140, 170);

      const graph = d3.select(graphRef4.current);
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

      const createLabel = (dataset) => {
        const groupedData = d3.group(dataset, (d) => {
          return d.Category;
        });

        svg
          .selectAll('.cat-rect')
          .data(categories)
          .enter()
          .append('rect')
          .transition()
          .duration(300)
          .delay((d, i) => i * 30)
          .attr('class', 'cat-rect')
          .attr('x', (d) => categoriesXY[d][0] + 120)
          .attr('y', (d) => categoriesXY[d][1] + 30)
          .attr('width', 160)
          .attr('height', 30)
          // .attr('opacity', 0)
          .attr('fill', 'grey');

        svg
          .selectAll('.lab-text')
          .data(categories)
          .enter()
          .append('text')
          .attr('class', 'lab-text')
          // .attr('opacity', 0)
          .raise();

        svg
          .selectAll('.lab-text')
          .text(
            (d) =>
              `WomenShare: ${d3.format(',.2r')(
                groupedData.get(d)[0].WomenShare * 100
              )}%`
          )
          .attr('x', (d) => categoriesXY[d][0] + 200)
          .attr('y', (d) => categoriesXY[d][1] + 50)
          .attr('font-family', 'Domine')
          .attr('font-size', '10px')
          .attr('font-weight', 700)
          .attr('fill', 'black')
          .attr('text-anchor', 'middle');

        svg
          .selectAll('.lab-text')
          .on('mouseover', function (event, data) {
            d3.select(this).text(data);
          })
          .on('mouseout', function (event, data) {
            d3.select(this).text(
              (d) =>
                `WomenShare: ${d3.format(',.2r')(
                  groupedData.get(d)[0].WomenShare * 100
                )}%`
            );
          });
      };

      const createAxis = (dataset) => {};

      const createGraph = (dataset) => {
        const nodes = svg
          .selectAll('circle')
          .data(dataset)
          .enter()
          .append('circle')
          .attr('r', (d) => salarySizeScale(d.Median))
          .attr('fill', colorByGender);

        // Define each tick of simulation
        simulation.on('tick', () => {
          nodes.attr('cx', (d) => d.x).attr('cy', (d) => d.y);
        });

        simulation
          .force(
            'forceX',
            d3.forceX((d) => categoriesXY[d.Category][0] + 200)
          )
          .force(
            'forceY',
            d3.forceY((d) => categoriesXY[d.Category][1] - 50)
          )
          .force(
            'collide',
            d3.forceCollide((d) => salarySizeScale(d.Median) + 4)
          )
          .alpha(1)
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
            d3.select(graphRef4.current)
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
    d3.select(tooltipRef4.current).style('display', 'none');

    d3.select(this)
      .transition('mouseleave')
      .duration(100)
      .attr('opacity', 0.8)
      .attr('stroke-width', 0);
  }

  function mouseOut(event, data) {
    d3.select(tooltipRef4.current).style('display', 'none');

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
    d3.select(tooltipRef4.current)
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
            <SectionHeader>{`Does Gender Influence Chosen Majors?`}</SectionHeader>
            <Paragraph>
              {
                'Now what if we took those same categories, but coloured them based on the proportion of the students which are male or female? In this chart, blue represents majors with > 60% male, and red represents > 60% female, and the grey bubbles represent the more gender balanced courses.'
              }
            </Paragraph>

            <Paragraph>
              {
                'What is striking about this graphic is that almost every category grouping of majors are either decidedly more female-weighted or male-weighted, with the exception of perhaps the business and physical sciences majors.'
              }
            </Paragraph>

            <Legend ref={legendRef4} width={350} height={600}></Legend>
          </StyledDescription>
          <Graph ref={graphRef4} style={{}}></Graph>
          <Tooltip ref={tooltipRef4} tooltipData={tooltipData}></Tooltip>
        </StyledSection>
      );
    }
    if (isTablet) {
      return <StyledSection ref={ref}>{'Tablet'}</StyledSection>;
    }

    if (isMobile) {
      return (
        <StyledSection ref={ref}>
          <Graph ref={graphRef4} style={{}}></Graph>
        </StyledSection>
      );
    }
  };

  return <>{renderSection()}</>;
};

const Section4 = forwardRef(_Section4);

export {Section4};
