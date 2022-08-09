import * as d3 from 'd3';

class NiceTooltip {
  constructor(tooltipDom, setTooltipData) {
    this.tooltipDom = tooltipDom;
    this.setTooltipData = setTooltipData;
    this.mouseOver = function (event, data) {
      setTooltipData(data);
      d3.select(this)
        .transition()
        .duration(150)
        .attr('opacity', 1)
        .attr('stroke-width', 3)
        .attr('stroke', 'black');

      // https://stackoverflow.com/questions/16256454/d3-js-position-tooltips-using-element-position-not-mouse-position
      d3.select(tooltipDom)
        .transition()
        .duration(250)
        .style('left', event.pageX + 10 + 'px')
        .style('top', event.pageY - 25 + 'px')
        .style('display', 'inline-block');
    };
    this.mouseLeave = function (event, data) {
      d3.select(tooltipDom).style('display', 'none');

      d3.select(this)
        .transition('mouseleave')
        .duration(100)
        .attr('opacity', 0.8)
        .attr('stroke-width', 0);
    };

    this.mouseOut = function (event, data) {
      d3.select(tooltipDom).style('display', 'none');

      d3.select(this)
        .transition()
        .duration(150)
        .attr('opacity', 0.8)
        .attr('stroke-width', 0);
    };
  }
}

export {NiceTooltip};
