import {forwardRef} from 'react';
const _Legend = ({sectionNumber, width, height}, ref) => {
  return <svg ref={ref} width={`${width}px`} height={`${height}px`}></svg>;
};

const Legend = forwardRef(_Legend);

export {Legend};
