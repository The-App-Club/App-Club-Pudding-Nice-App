import * as d3 from 'd3';
import dayjs from 'dayjs';
import {useRef, useEffect} from 'react';
import {legendColor} from 'd3-svg-legend';
import {timeAgo} from '../plugins';

const margin = {top: 10, right: 30, bottom: 50, left: 120};
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

const Interactive = ({
  pageIdList,
  allPageIdInfoList,
  metrics,
  bin,
  month,
  year,
}) => {
  const mainRef = useRef(null);
  const personRef = useRef(null);
  const getName = ({pageId}) => {
    return pageIdList.map((pageId) => {
      return allPageIdInfoList.find((allPageIdInfo) => {
        return allPageIdInfo.pageId === pageId;
      });
    });
  };
  const getLoadDataName = () => {
    if (bin === 1) {
      return `/data/pageviews.csv`;
    }
    if (bin === 2) {
      return `/data/pageviews-bin-2.csv`;
    }
    if (bin === 3) {
      return `/data/pageviews-bin-3.csv`;
    }
    if (bin === 7) {
      return `/data/pageviews-bin-7.csv`;
    }
  };
  const loadPeopleData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const itemInfoList = await d3.csv('/data/people.csv');
        const data = itemInfoList.map((itemInfo) => {
          return {
            ...itemInfo,
            max_views: +itemInfo.max_views_1,
            max_share: +itemInfo.max_share_1,
            thumbnail_width: +itemInfo.thumbnail_width,
            thumbnail_height: +itemInfo.thumbnail_height,
            year_of_birth: +itemInfo.year_of_birth,
            year_of_death: +itemInfo.year_of_death,
          };
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  const loadPageviewsData = () => {
    return new Promise(async (resolve, reject) => {
      try {
        const itemInfoList = await d3.csv(getLoadDataName());
        const data = itemInfoList.map((itemInfo) => {
          return {
            ...itemInfo,
            date: dayjs(itemInfo.timestamp, 'YYYYMMDD').toDate(),
            death_index: +itemInfo.death_index,
            views: +itemInfo.views,
            share: +itemInfo.share,
          };
        });
        resolve(data);
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    const setUpChart = ([peopleData, pageviewData]) => {
      // https://www.d3-graph-gallery.com/graph/line_several_group.html
      const main = d3.select(mainRef.current);
      main.select('svg#cool').remove();

      // append the svg object to the body of the page
      const svg = d3
        .select(mainRef.current)
        .append('svg')
        .attr('id', 'cool')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);

      const filteredData = pageIdList.map((pageId) => {
        return pageviewData.filter((itemInfo) => {
          return itemInfo.pageid === pageId;
        });
      });

      let data = [...filteredData].flat();

      if (year === 'all' && month === 'all') {
      } else if (year === 'all' && month !== 'all') {
        data = data.filter((itemInfo) => {
          return (
            dayjs(itemInfo.timestamp, 'YYYYMMDD').format('MM') ===
            `${String(month).padStart(2, '0')}`
          );
        });
      } else if (year !== 'all' && month === 'all') {
        data = data.filter((itemInfo) => {
          return (
            dayjs(itemInfo.timestamp, 'YYYYMMDD').format('YYYY') === `${year}`
          );
        });
      } else if (year !== 'all' && month !== 'all') {
        data = data.filter((itemInfo) => {
          return (
            dayjs(itemInfo.timestamp, 'YYYYMMDD').format('YYYYMM') ===
            `${year}${String(month).padStart(2, '0')}`
          );
        });
      }

      const joinedData = pageIdList
        .map((pageId) => {
          return peopleData.filter((itemInfo) => {
            return itemInfo.pageid === pageId;
          });
        })
        .flat()
        .map((d, i) => ({
          ...d,
          pageviews: data.filter((p) => p.pageid === d.pageid),
        }));

      const person = svg
        .selectAll('.g-person')
        .data(joinedData)
        .enter()
        .append('g')
        .attr('class', 'g-person');

      // group the data: I want to draw one line per group
      const sumstat = d3.group(data, (d) => {
        return d.pageid;
      }); // nest function allows to group the calculation per level of a factor

      const personNameList = pageIdList
        .map((pageId) => {
          return getName({pageId});
        })
        .flat()
        .map((itemInfo) => {
          return itemInfo?.name;
        });

      //カラースケールをオリジナルスケールとして指定する
      // https://gunmagisgeek.com/blog/d3-js/4411
      const colorScale = d3
        .scaleOrdinal()
        .domain(personNameList) //カテゴリを指定
        .range([
          '#e41a1c',
          '#377eb8',
          '#4daf4a',
          '#984ea3',
          '#ff7f00',
          '#ffff33',
          '#a65628',
          '#f781bf',
          '#999999',
        ]);

      //凡例を表示するグループ要素
      svg
        .append('g')
        .attr('class', 'legendLinear')
        .attr(
          'transform',
          `translate(${width - (margin.left + margin.right)}, 20)`
        );
      //スケールを元に凡例を生成する
      // http://using-d3js.com/04_08_legends.html
      const legendLinear = legendColor()
        .shapeHeight(7)
        .shapeWidth(30)
        .scale(colorScale);

      //凡例を描画する
      svg.select('.legendLinear').call(legendLinear);

      // Add X axis --> it is a date format
      const xScale = d3
        .scaleTime()
        .domain(
          d3.extent(data, function (d) {
            return dayjs(d.timestamp, 'YYYYMMDD').toDate();
          })
        )
        .range([0, width]);

      if (year === 'all' && month === 'all') {
        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y/%m')));
      } else if (year === 'all' && month !== 'all') {
        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(
            d3.axisBottom(xScale).ticks(4).tickFormat(d3.timeFormat('%Y/%m'))
          );
      } else if (year !== 'all' && month === 'all') {
        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%Y/%m')));
      } else if (year !== 'all' && month !== 'all') {
        svg
          .append('g')
          .attr('transform', `translate(0, ${height})`)
          .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d')));
      }

      // Add x-axis label
      svg
        .append('text')
        .attr('x', width / 2)
        .attr('y', height + margin.top + margin.bottom - 15)
        .attr('text-anchor', 'middle')
        .style('font-family', 'sans-serif')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .text('time');

      // Add Y axis
      const yScale = d3
        .scaleLinear()
        .domain([
          0,
          d3.max(data, function (d) {
            return +d[metrics];
          }),
        ])
        .range([height, 0]);
      svg.append('g').call(d3.axisLeft(yScale));

      // Add y-axis label
      svg
        .append('text')
        .attr('text-anchor', 'middle')
        .attr(
          'transform',
          `translate(-${(margin.left + margin.right) / 2 + 15}, ${
            height / 2
          }) rotate(-90)`
        )
        .style('font-family', 'sans-serif')
        .style('font-size', '20px')
        .style('font-weight', 'bold')
        .text(`${metrics}`);

      // Draw the line
      svg
        .selectAll('.line')
        .data(sumstat)
        .join('path')
        .attr('fill', 'none')
        .attr('stroke', function (d, i) {
          return colorScale(personNameList[i]);
        })
        .attr('stroke-width', 1.5)
        .attr('d', function (d) {
          return d3
            .line()
            .x(function (d) {
              return xScale(dayjs(d.timestamp, 'YYYYMMDD').toDate());
            })
            .y(function (d) {
              return yScale(0);
            })(d[1]);
        })
        .transition()
        .duration(1000)
        .attr('d', function (d) {
          return d3
            .line()
            .x(function (d) {
              return xScale(dayjs(d.timestamp, 'YYYYMMDD').toDate());
            })
            .y(function (d) {
              return yScale(+d[metrics]);
            })(d[1]);
        });

      person
        .selectAll('circle')
        .data((d) => d.pageviews)
        .enter()
        .append('circle')
        .attr('cx', (d) => xScale(dayjs(d.timestamp, 'YYYYMMDD').toDate()))
        .attr('cy', (d) => yScale(+d[metrics]))
        .attr('r', 4)
        .attr('fill', 'black')
        .attr('class', 'points')
        .style('pointer-events', 'all')
        .append('title')
        .text(function (d) {
          return `Time:${dayjs(d.timestamp, 'YYYYMMDD').format(
            'YYYY-MM-DD'
          )}\n${metrics}:${d[metrics]}\nPast:${timeAgo(d.timestamp)}`;
        });
    };

    async function fetch() {
      await Promise.all([
        await loadPeopleData(),
        await loadPageviewsData(),
      ]).then((data) => {
        setUpChart(data);
        // setUpChart2(data);
      });
    }

    fetch();
  }, [pageIdList, allPageIdInfoList, metrics, bin, month, year]);

  return (
    <>
      <h3 ref={personRef}>{'Here Person Name'}</h3>
      <main ref={mainRef}></main>
    </>
  );
};

export {Interactive};
