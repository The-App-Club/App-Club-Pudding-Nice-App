import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledTitle = styled.h2`
  position: sticky;
  top: 0;
  font-size: 3rem;
  @media screen and (max-width: 768px) {
    font-size: 1rem;
  }
`;

function _Title({children}, ref) {
  return <StyledTitle ref={ref}>{children}</StyledTitle>;
}

const Title = forwardRef(_Title);

export {Title};
