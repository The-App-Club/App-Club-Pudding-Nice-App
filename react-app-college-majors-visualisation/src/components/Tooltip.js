import {forwardRef} from 'react';
import * as d3 from 'd3';
import styled from '@emotion/styled';

const StyledTooltip = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  box-shadow: -3px 3px 15px #939393;
  color: white;
  display: none;
  font-family: 'Merriweather';
  font-size: 1.1em;
  max-width: 400px;
  padding: 6px;
  position: absolute;
  z-index: 100;
`;

const _Tooltip = ({tooltipData}, ref) => {
  return (
    <StyledTooltip ref={ref}>
      <strong>Major:</strong> {tooltipData.Major}
      <br />
      <strong>Median Salary:</strong> {d3.format(',.2r')(tooltipData.Median)}
      <br />
      <strong>Category:</strong> {tooltipData.Category}
      <br />
      <strong>% Female:</strong>{' '}
      {`${Math.round(tooltipData.ShareWomen * 100)}%`}
      <br />
      <strong># Enrolled:</strong> {d3.format(',.2r')(tooltipData.Total)}
    </StyledTooltip>
  );
};

const Tooltip = forwardRef(_Tooltip);

export {Tooltip};
