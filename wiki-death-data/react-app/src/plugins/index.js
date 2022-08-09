import dayjs from 'dayjs';
import * as d3 from 'd3';

function getPageIdInfoList({publicURL}) {
  const resultInfoList = [];
  function makePlotData(data, rowNumber) {
    resultInfoList.push({
      pageId: data.pageid,
      name: data.name,
    });
  }
  return new Promise(async (resolve, reject) => {
    await d3.csv(publicURL, makePlotData);
    resolve(resultInfoList);
  });
}

function loadData({publicURL, pageId, metrics, personName}) {
  const x = [],
    y = [];

  function formatDate(timestamp) {
    return (
      timestamp.slice(0, 4) +
      '-' +
      timestamp.slice(4, 6) +
      '-' +
      timestamp.slice(6, 8)
    );
  }

  function makePlotData(data, rowNumber) {
    if (data.pageid === pageId) {
      x.push(formatDate(data.timestamp));
      if (metrics === 'views') {
        y.push(+data.views);
      } else if (metrics === 'share') {
        y.push(+data.share);
      }
    }
  }

  return new Promise(async (resolve, reject) => {
    function getAxisLabelName() {
      if (metrics === 'views') {
        return `Page View Of ${personName}`;
      } else if (metrics === 'share') {
        return `Share Of ${personName}`;
      }
    }
    await d3.csv(publicURL, makePlotData);
    const plotDataInfo = {
      x: x,
      y: y,
      name: getAxisLabelName(),
    };
    resolve(plotDataInfo);
  });
}

// https://github.com/yysun/apprun-hn/blob/master/src/app.tsx#L137-L151
function pluralize(number, label) {
  if (!number) number = 0;
  return number === 1 ? number + label : number + label + 's';
}

function timeAgo(pastTime) {
  const currentTime = dayjs();
  const between = currentTime.diff(dayjs(pastTime, 'YYYYMMDD'), 'seconds');
  if (between < 3600) {
    return `${pluralize(~~(between / 60), ' minute')} ago`;
  } else if (between < 86400) {
    return `${pluralize(~~(between / 3600), ' hour')} ago`;
  } else if (between < 2628000) {
    return `${pluralize(~~(between / 86400), ' day')} ago`;
  } else if (between < 31536000) {
    return `${pluralize(~~(between / 2628000), ' month')} ago`;
  } else {
    return `${pluralize(~~(between / 31536000), ' year')} ago`;
  }
}

export {getPageIdInfoList, loadData, timeAgo};
