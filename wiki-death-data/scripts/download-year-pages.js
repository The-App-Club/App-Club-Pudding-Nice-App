import {writeFileSync, rmdirSync} from 'fs';

const mkdirp = require('mkdirp');
const wiki = require('wikijs').default;

const years = ['2020', '2021'];
const outputDir = './output';
const outputSubDir = './output/year-pages';

function download({year, saveDir}) {
  return new Promise(async (resolve, reject) => {
    try {
      const page = await wiki().page(year);
      const htmlData = await page.html();
      writeFileSync(`${saveDir}/${year}.html`, htmlData);
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

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

(async () => {
  await teardown({dirName: outputDir});
  await mkdirp(outputDir);
  await mkdirp(outputSubDir);
  for (let index = 0; index < years.length; index++) {
    const year = years[index];
    console.log('year', year);
    await download({year, saveDir: outputSubDir});
  }
})();
