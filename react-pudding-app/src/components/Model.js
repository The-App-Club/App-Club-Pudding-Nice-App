import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledModel = styled.div`
  width: 60vw;
  background: azure;
  display: flex;
  justify-content: center;
  align-items: center;
  @media screen and (max-width: 768px) {
    width: 100vw;
  }
`;

function _Model({children}, ref) {
  return <StyledModel ref={ref}>{children}</StyledModel>;
}

const Model = forwardRef(_Model);

export {Model};
