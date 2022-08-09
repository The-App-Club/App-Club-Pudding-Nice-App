import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledDescription = styled.div`
  width: 40vw;
  background: bisque;
  @media screen and (max-width: 768px) {
    width: 100vw;
  }
`;

function _Description({children}, ref) {
  return <StyledDescription ref={ref}>{children}</StyledDescription>;
}

const Description = forwardRef(_Description);

export {Description};
