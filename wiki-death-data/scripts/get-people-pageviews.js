import dayjs from 'dayjs';
import {writeFileSync, readFileSync} from 'fs';
const mkdirp = require('mkdirp');
const pageviews = require('pageviews');
const d3 = require('d3');
const generateDateRange = require('../helpers/generate-date-range');
const getTimestamp = require('../helpers/get-timestamp');
const outputDir = './output/people-pageviews';

let queue = [];
let progress = 0;

const wikiPageviewData = d3.csvParse(
  readFileSync('./output/wiki-pageviews.csv', 'utf-8')
);

const medianWikiPageviews = d3.median(
  wikiPageviewData.map((d) => {
    return +d.views;
  })
);

function createDateIndex() {
  const startDate = dayjs('2020').toDate();
  const endDate = dayjs('2021').endOf('year').add(1, 'day').toDate();
  const dates = generateDateRange(startDate, endDate);
  return dates.map((d) => {
    return getTimestamp({date: d});
  });
}

function calculateShare({views, timestamp}) {
  // https://stackoverflow.com/questions/1685680/how-to-avoid-scientific-notation-for-large-numbers-in-javascript
  const match = wikiPageviewData.find((d) => {
    return d.timestamp === timestamp;
  });
  if (match) {
    return views / +match.views;
  }
  console.error('no match', timestamp);
  return null;
}

function createFiller(t, i) {
  return {
    timestamp: t,
    timestamp_index: i,
    views: null,
    views_adjusted: null,
    share: null,
  };
}

function clean(data) {
  return data.map((d) => {
    return {
      timestamp: d.timestamp.substring(0, 8),
      views: d.views,
    };
  });
}

function addInfo({data, timestampIndex}) {
  const withInfo = data.map((d) => {
    const timestamp_index = timestampIndex.findIndex((t) => {
      return t === d.timestamp;
    });
    let share = calculateShare(d);
    const views_adjusted = Math.floor(share * medianWikiPageviews);
    return {
      ...d,
      timestamp_index,
      share,
      views_adjusted,
    };
  });

  const withFiller = timestampIndex.map((t, i) => {
    const match = withInfo.find((m) => {
      return m.timestamp === t;
    });
    if (match) {
      return match;
    }
    return createFiller(t, i);
  });

  return withFiller;
}

function query({person, timestampIndex}) {
  return new Promise(async (resolve, reject) => {
    try {
      const id = person.link.replace('/wiki/', '');
      queue.push({id, status: 0});
      const result = await pageviews.getPerArticlePageviews({
        project: 'en.wikipedia',
        agent: 'user',
        granularity: 'daily',
        start: dayjs('2020').add(1, 'day').toDate(),
        end: dayjs('2021').endOf('year').toDate(),
        article: person.name,
      });
      const data = await clean(result.items);
      const withInfo = addInfo({data, timestampIndex});
      const output = d3.csvFormat(withInfo);
      writeFileSync(`${outputDir}/${id}.csv`, output);
      resolve(id);
    } catch (error) {
      reject(error);
    }
  });
}

function updateStatus(id) {
  return queue.map((item) => {
    if (id === item.id) {
      return Object.assign(item, {status: 1});
    } else {
      return item;
    }
  });
}

function visualProgress(totalLength) {
  for (let index = 0; index < queue.length; index++) {
    const item = queue[index];
    if (item.status === 1) {
      queue = queue.filter((_item) => {
        return _item !== item;
      });
      progress = (queue.length / totalLength) * 100;
    }
  }
  return {progress, remain: queue.length};
}

async function execQuery({data, timestampIndex}) {
  const totalLength = data.length;
  return await Promise.all(
    data.map(async (item, index) => {
      const id = await query({person: item, timestampIndex});
      updateStatus(id);
      const {progress, remain} = {...visualProgress(totalLength)};
      console.clear();
      console.log(
        `${Math.floor(100 - progress)}% ${totalLength - remain}/${totalLength}`
      );
    })
  );
}

async function init() {
  mkdirp(outputDir);
  const timestampIndex = createDateIndex();

  const data = d3.csvParse(
    readFileSync('./output/people--all-deaths.csv', 'utf-8')
  );

  execQuery({data, timestampIndex}).then(() => {
    console.log('fin');
  });
}

(async () => {
  await init();
})();
