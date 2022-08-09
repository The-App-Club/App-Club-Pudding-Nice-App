import styled from '@emotion/styled';
import {forwardRef} from 'react';

const StyledObject = styled.div`
  position: fixed;
  top: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  @media screen and (max-width: 768px) {
    top: 70px;
  }
`;

const StyledImage = styled.img`
  max-width: 100%;
  width: 100%;
  display: block;
`;

const _Object = ({src, alt, className}, ref) => {
  return (
    <StyledObject ref={ref} className={className}>
      <StyledImage src={src} alt={alt}></StyledImage>
    </StyledObject>
  );
};

const Object = forwardRef(_Object);

export {Object};
