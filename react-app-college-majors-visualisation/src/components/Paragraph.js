import styled from '@emotion/styled';

const StyledParagraph = styled.p`
  width: 100%;
  padding: 10px;
`;

const Paragraph = ({children, style}) => {
  return <StyledParagraph style={{...style}}>{children}</StyledParagraph>;
};

export {Paragraph};
