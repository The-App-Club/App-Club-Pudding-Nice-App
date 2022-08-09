import * as d3 from 'd3';

const METRIC = 'share';
const $main = d3.select('main');

const margin = { top: 10, right: 30, bottom: 30, left: 60 };
const width = 960 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

function handleSliderInput() {
  const val = +this.value;
  $main
    .selectAll('.g-person')
    .classed('is-active', d => d.person_index === val);

  const $sel = $main.selectAll('.g-person').filter(d => d.person_index === val);
  $sel.raise();
  const { display } = $sel.datum();
  $main.select('.name').text(display);
}

function setupChart(data) {
  const [peopleData, pageviewData] = data;

  const joinedData = peopleData.map((d, i) => ({
    ...d,
    pageviews: pageviewData.filter(p => p.pageid === d.pageid),
    person_index: i
  }));

  const $svg = $main.append('svg');

  $svg
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom);

  const $g = $svg.append('g');

  $g.attr('transform', `translate(${margin.left}, ${margin.top})`);

  const $axisX = $g.append('g').attr('class', 'g-axis axis--x');
  const $axisY = $g.append('g').attr('class', 'g-axis axis--y');

  const $vis = $g.append('g').attr('class', 'g-vis');

  const $person = $vis
    .selectAll('.g-person')
    .data(joinedData)
    .enter()
    .append('g')
    .attr('class', 'g-person');

  const $path = $person.append('path');

  const scaleX = d3
    .scaleLinear()
    // .domain(d3.extent(pageviewData, d => d.bin_death_index))
    .domain([-10, 10])
    .range([0, width]);

  const max = d3.max(pageviewData, d => d[METRIC]);

  const scaleY = d3
    .scaleLinear()
    .domain([0, max])
    .range([height, 0]);

  const line = d3
    .line()
    .x(d => scaleX(d.bin_death_index))
    .y(d => scaleY(d[METRIC]))
    .defined(d => d[METRIC]);

  // $path.datum(d => d.pageviews).attr('d', line);

  console.log(peopleData.filter(d => d.display === 'Prince (musician)'));
  console.log(pageviewData.filter(d => d.pageid === '57317'));
  const axisY = d3.axisLeft(scaleY).tickFormat(d3.format('.3%'));
  $axisY.call(axisY);

  const axisX = d3.axisBottom(scaleX);
  $axisX.call(axisX).attr('transform', `translate(0, ${height})`);

  $person
    .selectAll('circle')
    .data(d => d.pageviews)
    .enter()
    .append('circle')
    .attr('cx', d => scaleX(d.bin_death_index))
    .attr('cy', d => scaleY(d[METRIC]))
    .attr('r', 2);

  $main
    .append('input')
    .attr('type', 'range')
    .attr('value', 0)
    .attr('min', 0)
    .attr('max', joinedData.length)
    .on('input', handleSliderInput);

  $main.append('p').attr('class', 'name');
}

function loadPeopleData() {
  return new Promise((resolve, reject) => {
    d3.csv('data/people.csv', d => ({
      ...d,
      max_change_before_share: +d.max_change_before_share,
      median_views_before: +d.median_views_before,
      median_share_before: +d.median_share_before,
      max_views: +d.max_views,
      max_share: +d.max_share,
      thumbnail_width: +d.thumbnail_width,
      thumbnail_height: +d.thumbnail_height,
      year_of_birth: +d.year_of_birth,
      year_of_death: +d.year_of_death
    }))
      .then(resolve)
      .catch(reject);
  });
}

function loadPageviewsData(days) {
  return new Promise((resolve, reject) => {
    d3.csv(`data/pageviews-bin-${days}.csv`, d => ({
      ...d,
      bin: +d.bin,
      bin_death_index: +d.bin_death_index,
      views: +d.views,
      share: +d.share
    }))
      .then(data => {
        const filtered = data;
        resolve(filtered);
      })
      .catch(reject);
  });
}

function init(days) {
  const p = [loadPeopleData(), loadPageviewsData(days)];
  Promise.all(p)
    .then(setupChart)
    .catch(console.error);
}

export default init;