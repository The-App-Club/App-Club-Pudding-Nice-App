import { forwardRef, useId, useLayoutEffect } from 'react';
import { css } from '@emotion/css';
import * as d3 from 'd3';
import './index.scss';

const _Bar = ({}, ref) => {
  const itemInfoList = [
    {
      id: useId(),
      month: 'April',
      counts: { Facebook: 7045, YouTube: 4816, Twitter: 4717, Instagram: 96 },
    },
    {
      id: useId(),
      month: 'May',
      counts: {
        Facebook: 11401,
        YouTube: 1708,
        Twitter: 10433,
        Instagram: 129,
      },
    },
    {
      id: useId(),
      month: 'June',
      counts: { Facebook: 16974, YouTube: 3190, Twitter: 9874, Instagram: 471 },
    },
  ];

  useLayoutEffect(() => {
    // Add a total value for each month
    const smTotal = itemInfoList.map((itemInfo) => {
      const counts = itemInfo.counts;
      const total = d3.sum(Object.entries(counts), (d) => {
        return d[1];
      });
      return { month: itemInfo.month, counts, total };
    });

    // create a Y scale for the data
    const scaleY = d3
      .scaleLinear()
      .range([0, 200])
      .domain([
        0,
        d3.max(smTotal, (d) => {
          return d.total;
        }),
      ]);

    // create a color scale for the data where Facebook is red
    const scaleColor = d3
      .scaleOrdinal()
      .range(['#FE4A49', '#cccccc', '#dddddd', '#eeeeee'])
      .domain(['Facebook', 'YouTube', 'Twitter', 'Instagram']);

    // Select the figure element
    const stack = d3.select(ref.current);

    // Add a div for each month
    const group = stack
      .selectAll('.group')
      .data(smTotal)
      .enter()
      .append('div')
      .attr('class', 'group');

    // Add a block for each social media type
    const block = group
      .selectAll('.block')
      .data((d) => {
        return Object.entries(d.counts);
      })
      .enter()
      .append('div')
      .attr('class', 'block')
      .style('height', (d, i) => {
        // And scale the height of the box based on the value
        return `${scaleY(d[1])}px`;
      })
      .style('background-color', (d, i) => {
        // Scale the color based on the social media type
        return `${scaleColor(d[0])}`;
      });

    // Add a month label
    const label = group
      .append('text')
      .text((d) => {
        return d.month;
      })
      .attr('class', 'label');

    // Add a total count label
    const count = group
      .append('text')
      .text((d) => {
        return d3.format('0.2s')(d.total);
      })
      .attr('class', 'count');
  }, []);

  return <figure className="stack" ref={ref}></figure>;
};

const Bar = forwardRef(_Bar);

export { Bar };
