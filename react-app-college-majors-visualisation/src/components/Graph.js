import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledGraph = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: flex-start;
`;

const _Graph = ({style}, ref) => {
  return <StyledGraph ref={ref} style={{...style}}></StyledGraph>;
};

const Graph = forwardRef(_Graph);

export {Graph};
