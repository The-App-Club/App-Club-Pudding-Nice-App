import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledSection = styled.section`
  position: relative;
  z-index: 1;
`;

function _Section({children}, ref) {
  return <StyledSection ref={ref}>{children}</StyledSection>;
}

const Section = forwardRef(_Section);

export {Section};
