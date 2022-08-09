import styled from '@emotion/styled';

const StyledLink = styled.a``;

const Link = ({href, text}) => {
  return <StyledLink href={href}>{text}</StyledLink>;
};

export {Link};
