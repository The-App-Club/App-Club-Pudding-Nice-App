import styled from '@emotion/styled';

const StyledFooter = styled.footer`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
`;

const Footer = ({children}) => {
  return (
    <StyledFooter>
      <div>{'@copyright CowBoy Bebop'}</div>
    </StyledFooter>
  );
};

export {Footer};
