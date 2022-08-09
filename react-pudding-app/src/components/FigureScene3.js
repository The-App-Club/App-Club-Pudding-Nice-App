import styled from '@emotion/styled';
const FigureScene3 = styled.figure`
  & {
    position: fixed;
    bottom: 30px;
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    @media screen and (max-width: 768px) {
      bottom: 70px;
    }
  }

  & .group {
    display: flex;
    flex-direction: column;
    margin: 0 0.5rem;
  }

  & .block {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #123456;
  }
`;
export {FigureScene3};
