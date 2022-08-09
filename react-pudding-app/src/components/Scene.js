import styled from '@emotion/styled';
import {forwardRef, useLayoutEffect, useState, useEffect} from 'react';
import {gsap} from 'gsap/all';
import {ScrollTrigger} from 'gsap/all';

gsap.registerPlugin(ScrollTrigger);

const StyledScene = styled.div`
  width: 100%;
  display: flex;
  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const _Scene = ({modelRef, objectRef, graphRef, children}, ref) => {
  const [isShow, setIsShow] = useState(false);
  useLayoutEffect(() => {
    const tl = gsap.timeline({
      paused: true,
      scrollTrigger: {
        trigger: ref.current,
        start: 'top top',
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
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (isShow) {
      gsap.fromTo(objectRef.current, {opacity: 0, y: 120}, {opacity: 1, y: 0});
      gsap.fromTo(graphRef.current, {opacity: 0, y: 120}, {opacity: 1, y: 0});
    } else {
      gsap.fromTo(objectRef.current, {opacity: 1, y: 0}, {opacity: 0, y: 120});
      gsap.fromTo(graphRef.current, {opacity: 1, y: 0}, {opacity: 0, y: 120});
    }
    console.log('do something...', isShow);
    // eslint-disable-next-line
  }, [isShow]);

  return <StyledScene ref={ref}>{children}</StyledScene>;
};

const Scene = forwardRef(_Scene);

export {Scene};
