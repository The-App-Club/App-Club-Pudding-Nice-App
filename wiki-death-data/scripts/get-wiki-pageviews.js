import {writeFileSync, rmdirSync} from 'fs';
import dayjs from 'dayjs';

const mkdirp = require('mkdirp');
const pageviews = require('pageviews');
const d3 = require('d3');

const outputDir = './output';

function teardown({dirName}) {
  return new Promise((resolve, reject) => {
    try {
      rmdirSync(dirName, {recursive: true});
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

function createInfoList({data}) {
  return data.map((d) => {
    return {
      timestamp: d.timestamp.substring(0, 8),
      views: d.views,
    };
  });
}

function createPVData() {
  // https://github.com/tomayac/pageviews.js#readme
  return new Promise(async (resolve, reject) => {
    try {
      const result = await pageviews.getAggregatedPageviews({
        project: 'en.wikipedia',
        agent: 'user',
        granularity: 'daily',
        start: dayjs('2020').add(1, 'day').toDate(),
        end: dayjs('2021').endOf('year').toDate(),
      });
      const data = await createInfoList({data: result.items});
      const csvData = d3.csvFormat(data);
      writeFileSync(`${outputDir}/wiki-pageviews.csv`, csvData);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

(async () => {
  await createPVData();
})();
