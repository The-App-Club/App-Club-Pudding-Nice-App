import styled from '@emotion/styled';
import {forwardRef, useLayoutEffect, useState, useEffect} from 'react';
import {gsap} from 'gsap/all';
import {ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const StyledParagraph = styled.p`
  margin: 0 auto;
  width: 400px;
  background: #123456;
  color: #eeeeee;
  padding: 20px;
  border-radius: 30px;
  font-size: 1.5rem;

  &.is-crossed {
    background: darkgray;
    color: black;
  }

  @media screen and (max-width: 768px) {
    width: 300px;
    font-size: 1rem;
  }
`;

function _Paragraph({children, graphRef}, ref) {
  const [isShow, setIsShow] = useState(false);
  useLayoutEffect(() => {
    if (ref) {
      const tl = gsap.timeline({
        paused: true,
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 70%',
          end: 'bottom top',
          toggleClass: 'is-crossed',
          markers: true,
          scrub: 1,
          onEnter: (e) => {
            console.log('[enter]');
            setIsShow(true);
          },
          onLeave: (e) => {
            console.log('[leave]');
            setIsShow(false);
          },
          onEnterBack: (e) => {
            console.log('enterback]');
            setIsShow(true);
          },
          onLeaveBack: (e) => {
            console.log('leaveback]');
            setIsShow(false);
          },
        },
      });
      return () => {
        tl.scrollTrigger.kill();
        tl.kill();
      };
    }
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (graphRef) {
      if (isShow) {
        gsap.fromTo(graphRef.current, {opacity: 0, y: 120}, {opacity: 1, y: 0});
      } else {
        gsap.fromTo(graphRef.current, {opacity: 1, y: 0}, {opacity: 0, y: 120});
      }
      console.log('do something...', isShow);
    }
    // eslint-disable-next-line
  }, [isShow]);
  return <StyledParagraph ref={ref}>{children}</StyledParagraph>;
}

const Paragraph = forwardRef(_Paragraph);

export {Paragraph};
