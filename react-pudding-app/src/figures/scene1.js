import * as d3 from 'd3';
import {NiceTooltip} from './tooltip';

const setUpScene1 = ({itemInfoList, dom, tooltipDom, setTooltipData}) => {
  const tooltip = new NiceTooltip(tooltipDom, setTooltipData);
  const groupedByYearInfo = d3.group(itemInfoList, (d) => {
    return d.year;
  });
  // サマリ
  const group = d3
    .select(dom)
    .selectAll('.group')
    .data(groupedByYearInfo)
    .enter()
    .append('div')
    .attr('class', 'group');

  // 明細
  group
    .selectAll('.block')
    .data((d) => {
      return d[1];
    })
    .enter()
    .append('div')
    .attr('class', 'block');

  // グルーピングごとにラベリング
  group.append('text').text((d) => {
    return d[0];
  });

  d3.select(dom)
    .selectAll('.block')
    .on('mouseover', tooltip.mouseOver)
    .on('mouseout', tooltip.mouseOut)
    .on('mouseleave', tooltip.mouseLeave);
};

export {setUpScene1};
