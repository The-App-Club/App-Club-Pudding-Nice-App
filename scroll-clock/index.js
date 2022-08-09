import * as d3 from 'd3';

let WIDTH = window.innerWidth / 2;
let HEIGHT = window.innerHeight;

let translate = 'translate(' + WIDTH / 2 + ',' + HEIGHT / 2 + ')';

let svg = d3
  .select('#sticky')
  .append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT);

let currentScrollTop = d3.select('#currentScrollTop');

let hourLayer = svg.append('g').attr('transform', translate);

let hourRect = hourLayer
  .append('rect')
  .attr('x', -3)
  .attr('y', -87)
  .attr('width', 6)
  .attr('height', 90)
  .attr('fill', '#333');

let minuteLayer = svg.append('g').attr('transform', translate);

let minuteRect = minuteLayer
  .append('rect')
  .attr('x', -2)
  .attr('y', -118)
  .attr('width', 4)
  .attr('height', 120)
  .attr('fill', '#333');

let body = d3.select('body').node();
let container = d3.select('#container');
let content = d3.select('#content');

let SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;

// https://www.d3indepth.com/scales/
let hourHandRotation = d3.scaleLinear()
  .domain([0, SCROLL_LENGTH])
  .range([0, 360])
  .clamp(true);

let minuteHandRotation = d3.scaleLinear()
  .domain([0, SCROLL_LENGTH])
  .range([0, 360 * 12])
  .clamp(true);

let scrollTop = 0;
let newScrollTop = 0;

container.on('scroll.scroller', function () {
  newScrollTop = container.node().scrollTop;
});

let setDimensions = function () {
  WIDTH = window.innerWidth / 2;
  HEIGHT = window.innerHeight;
  SCROLL_LENGTH = content.node().getBoundingClientRect().height - HEIGHT;

  hourHandRotation.domain([0, SCROLL_LENGTH]);
  minuteHandRotation.domain([0, SCROLL_LENGTH]);
};

let render = function () {
  if (scrollTop !== newScrollTop) {
    scrollTop = newScrollTop;

    let hourHandRotate = hourHandRotation(scrollTop);
    hourLayer.attr('transform', translate + ' rotate(' + hourHandRotate + ')');

    let minuteHandRotate = minuteHandRotation(scrollTop);
    minuteLayer.attr(
      'transform',
      translate + ' rotate(' + minuteHandRotate + ')'
    );

    currentScrollTop.text(scrollTop);
  }

  window.requestAnimationFrame(render);
};
window.requestAnimationFrame(render);

window.onresize = setDimensions;
