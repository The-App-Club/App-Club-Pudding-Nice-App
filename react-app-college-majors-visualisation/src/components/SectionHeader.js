import styled from '@emotion/styled';

const StyledSectionHeader = styled.h2`
  width: 100%;
  padding: 10px;
`;

const SectionHeader = ({children}) => {
  return <StyledSectionHeader>{children}</StyledSectionHeader>;
};

export {SectionHeader};
