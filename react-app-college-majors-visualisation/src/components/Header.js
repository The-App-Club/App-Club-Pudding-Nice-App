import styled from '@emotion/styled';

const StyledHeader = styled.header`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 3rem;
`;

const Header = ({children}) => {
  return (
    <StyledHeader>
      <div>{'CowBoy Bebop'}</div>
    </StyledHeader>
  );
};

export {Header};
