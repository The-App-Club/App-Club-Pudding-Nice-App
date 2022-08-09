import {useEffect, useRef} from 'react';
import Plotly from 'plotly.js-dist-min';
import {useJustFit} from '../hooks/useJustFit';
import {loadData} from '../plugins';

const selectorOptions = {
  buttons: [
    {
      step: 'month',
      stepmode: 'backward',
      count: 1,
      label: '1m',
    },
    {
      step: 'month',
      stepmode: 'backward',
      count: 6,
      label: '6m',
    },
    {
      step: 'year',
      stepmode: 'todate',
      count: 1,
      label: 'YTD',
    },
    {
      step: 'year',
      stepmode: 'backward',
      count: 1,
      label: '1y',
    },
    {
      step: 'all',
    },
  ],
};

const Graphinaize = ({
  pageIdList,
  allPageIdInfoList,
  metrics,
  bin,
  month,
  year,
}) => {
  const wrkspRef = useRef(null);

  const getName = ({pageId}) => {
    return pageIdList.map((pageId) => {
      return allPageIdInfoList.find((allPageIdInfo) => {
        return allPageIdInfo.pageId === pageId;
      });
    });
  };

  useJustFit({Plotly, wrkspDom: wrkspRef.current});

  useEffect(() => {
    const getLoadDataName = () => {
      if (bin === 1) {
        return `/data/pageviews.csv`;
      }
      if (bin === 2) {
        return `/data/pageviews-bin-2.csv`;
      }
      if (bin === 3) {
        return `/data/pageviews-bin-3.csv`;
      }
      if (bin === 7) {
        return `/data/pageviews-bin-7.csv`;
      }
    };
    async function fetch() {
      const resultInfoList = [];
      for (let index = 0; index < pageIdList.length; index++) {
        const pageId = pageIdList[index];
        const personInfoList = getName({pageId});
        const plodataInfo = await loadData({
          publicURL: getLoadDataName(),
          pageId: pageId,
          metrics: metrics,
          personName: personInfoList.find((personInfo) => {
            return personInfo?.pageId === pageId;
          })?.name,
        });
        resultInfoList.push(plodataInfo);
      }
      return resultInfoList;
    }
    // https://plotly.com/javascript/legend/
    fetch()
      .then((data) => {
        Plotly.newPlot(
          wrkspRef.current,
          data,
          {
            xaxis: {
              rangeselector: selectorOptions,
              rangeslider: {},
            },
            yaxis: {
              fixedrange: true,
              side: 'right',
            },
            showlegend: true,
            legend: {
              x: 1,
              xanchor: 'right',
              y: 1,
            },
            width: window.innerWidth * 0.825,
            height: window.innerHeight,
          },
          {
            showLink: false,
            displayModeBar: true,
          }
        );
      })
      .catch((error) => {
        console.log(error);
      });
  }, [pageIdList, allPageIdInfoList, metrics, bin]);

  return <div ref={wrkspRef}></div>;
};

export {Graphinaize};
