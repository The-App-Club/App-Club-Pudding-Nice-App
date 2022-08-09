import {forwardRef, useLayoutEffect, useRef, useState} from 'react';
import {
  setUpScene1,
  setUpScene3,
  setUpScene5,
  setUpSceneDefault,
} from '../figures/scene';

import {FigureSceneDefault} from './FigureSceneDefault';
import {FigureScene1} from './FigureScene1';
import {FigureScene3} from './FigureScene3';
import {FigureScene5} from './FigureScene5';

import {Tooltip} from './Tooltip';

const _Graph = ({dataList: [itemInfoList], sceneId}, ref) => {
  const [tooltipData, setTooltipData] = useState();
  const tooltipRef = useRef(null);
  useLayoutEffect(() => {
    switch (sceneId) {
      case 1:
        setUpScene1({
          itemInfoList,
          dom: ref.current,
          tooltipDom: tooltipRef.current,
          setTooltipData,
        });
        break;
      case 3:
        setUpScene3({
          itemInfoList,
          dom: ref.current,
          tooltipDom: tooltipRef.current,
          setTooltipData,
        });
        break;
      case 5:
        setUpScene5({
          itemInfoList,
          dom: ref.current,
          tooltipDom: tooltipRef.current,
          setTooltipData,
        });
        break;

      default:
        setUpSceneDefault({
          itemInfoList,
          dom: ref.current,
          tooltipDom: tooltipRef.current,
          setTooltipData,
        });
        break;
    }
    // eslint-disable-next-line
  }, []);

  const renderGraph = () => {
    switch (sceneId) {
      case 1:
        return (
          <>
            <FigureScene1 ref={ref}></FigureScene1>
            <Tooltip ref={tooltipRef} tooltipData={tooltipData} />
          </>
        );
      case 3:
        return (
          <>
            <FigureScene3 ref={ref}></FigureScene3>
            <Tooltip ref={tooltipRef} tooltipData={tooltipData} />
          </>
        );
      case 5:
        return (
          <>
            <FigureScene5 ref={ref}></FigureScene5>
            <Tooltip ref={tooltipRef} tooltipData={tooltipData} />
          </>
        );

      default:
        return (
          <>
            <FigureSceneDefault ref={ref}></FigureSceneDefault>
            <Tooltip ref={tooltipRef} tooltipData={tooltipData} />
          </>
        );
    }
  };

  return <>{renderGraph()}</>;
};

const Graph = forwardRef(_Graph);

export {Graph};
