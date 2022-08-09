import {forwardRef} from 'react';
import styled from '@emotion/styled';

const StyledTooltip = styled.div`
  background: rgba(0, 0, 0, 0.7);
  border-radius: 3px;
  box-shadow: -3px 3px 15px #939393;
  color: white;
  display: none;
  font-family: 'Times New Roman', Times, serif;
  font-size: 1.1em;
  max-width: 400px;
  padding: 6px;
  position: absolute;
  z-index: 100;
`;

const _Tooltip = ({tooltipData}, ref) => {
  return (
    <StyledTooltip ref={ref}>
      {Object.keys(tooltipData || {}).map((keyName, index) => {
        return (
          <span key={index}>
            <strong>{keyName}</strong> {tooltipData[keyName]}
            <br />
          </span>
        );
      })}
    </StyledTooltip>
  );
};

const Tooltip = forwardRef(_Tooltip);

export {Tooltip};
