import {useEffect} from 'react';

function useJustFit({Plotly, wrkspDom}) {
  useEffect(() => {
    const handleResize = () => {
      const resizedWidth = window.innerWidth * 0.825;
      const resizedHeight = window.innerHeight;
      const update = {
        width: resizedWidth,
        height: resizedHeight,
      };
      Plotly.relayout(wrkspDom, update);
    };
    // set resize listener
    window.addEventListener('resize', handleResize);

    // clean up function
    return () => {
      // remove resize listener
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return;
}

export {useJustFit};
