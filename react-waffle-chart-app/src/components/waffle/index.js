import { forwardRef, useId, useLayoutEffect } from 'react';
import { css } from '@emotion/css';
import * as d3 from 'd3';
import './index.scss';

const _Waffle = ({}, ref) => {
  const itemInfoList = [
    { id: useId(), name: 'Matt', state: 'NY' },
    { id: useId(), name: 'Ilia', state: 'NY' },
    { id: useId(), name: 'Jan', state: 'NY' },
    { id: useId(), name: 'Caitlyn', state: 'NY' },
    { id: useId(), name: 'Russell', state: 'MA' },
    { id: useId(), name: 'Amber', state: 'WA' },
  ];

  useLayoutEffect(() => {
    const groupedByStateInfo = d3.group(itemInfoList, (d) => {
      return d.state;
    });

    // サマリ
    const group = d3
      .select(ref.current)
      .selectAll('.group')
      .data(groupedByStateInfo)
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
  }, []);

  return <figure className="hist" ref={ref}></figure>;
};

const Waffle = forwardRef(_Waffle);

export { Waffle };
