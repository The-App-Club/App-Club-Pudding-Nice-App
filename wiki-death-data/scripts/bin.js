import {readFileSync, writeFileSync} from 'fs';

const mkdirp = require('mkdirp');
const d3 = require('d3');
const outputDir = './output/people-bin';
const MS_DAY = 86400000;

let queue = [];
let progress = 0;

const wikiPageviewData = d3.csvParse(
  readFileSync('./output/wiki-pageviews.csv', 'utf-8')
);

function getDiff(a, b) {
  const aDate = new Date(
    a.substring(0, 4),
    a.substring(4, 6),
    a.substring(6, 8)
  );
  const bDate = new Date(
    b.substring(0, 4),
    b.substring(4, 6),
    b.substring(6, 8)
  );
  return Math.abs(aDate - bDate) / MS_DAY;
}

function getBinDeathIndex(data, timestamp_of_death) {
  const withDiff = data.map((d, i) => ({
    diff: getDiff(d.timestamp, timestamp_of_death),
    i,
  }));
  withDiff.sort((a, b) => d3.ascending(a.diff, b.diff));

  return withDiff.shift().i;
}

function getId(person) {
  return person.link.replace('/wiki/', '');
}

function createBinData({person, days}) {
  // https://note.com/utaka233/n/n797c1d92ec78
  const id = getId(person);
  const personPageviewData = d3.csvParse(
    readFileSync(`./output/people-pageviews/${id}.csv`, 'utf-8')
  );

  const exactDeathIndex = personPageviewData.findIndex(
    (d) => d.timestamp === `${person.timestamp_of_death}`
  );

  const rem = exactDeathIndex % days;
  const offset = -rem;

  const withBin = personPageviewData.map((d) => ({
    ...d,
    bin: Math.floor((+d.timestamp_index + offset) / days),
  }));

  // それぞれの日数ごとにサマリ上げ
  const nested = d3
    .nest()
    .key((d) => d.bin)
    .rollup((values) => {
      const views = d3.sum(values, (v) => +v.views);
      const views_adjusted = d3.sum(values, (v) => +v.views_adjusted);
      const timestamps = values.map((v) => v.timestamp);
      const filteredWikiPageviews = wikiPageviewData.filter((w) =>
        timestamps.includes(w.timestamp)
      );
      const total = d3.sum(filteredWikiPageviews, (d) => +d.views);
      const share = views / total;
      const {bin, timestamp, timestamp_index} = values[0];
      const count = values.length;
      return {
        views,
        views_adjusted,
        share,
        bin,
        timestamp,
        timestamp_index,
        count,
      };
    })
    .entries(withBin);

  const flat = nested.map((d) => d.value).filter((d) => d.count === days);

  // add binned death index
  const binDeathIndex = getBinDeathIndex(flat, person.timestamp_of_death);

  const withDeathIndex = flat.map((d, i) => ({
    ...d,
    bin_death_index: i - binDeathIndex,
  }));

  const output = d3.csvFormat(withDeathIndex);
  writeFileSync(`${outputDir}-${days}/${id}.csv`, output);

  return id;
}

function updateStatus(id) {
  queue = queue.map((item) => {
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

async function execQuery(data) {
  const totalLength = data.length;
  return await Promise.all(
    data.map((person, index) => {
      let id = createBinData({person, days: 1});
      id = createBinData({person, days: 2});
      id = createBinData({person, days: 3});
      id = createBinData({person, days: 7});
      updateStatus(id);
      const {progress, remain} = {...visualProgress(totalLength)};
      console.clear();
      console.log(
        `${Math.floor(100 - progress)}% ${totalLength - remain}/${totalLength}`
      );
    })
  );
}

function init() {
  mkdirp(`${outputDir}-1`);
  mkdirp(`${outputDir}-2`);
  mkdirp(`${outputDir}-3`);
  mkdirp(`${outputDir}-7`);

  const data = d3.csvParse(
    readFileSync('./output/people--all-deaths.csv', 'utf-8')
  );

  data.forEach((person, i) => {
    queue.push({id: getId(person), status: 0});
  });

  execQuery(data).then(() => {
    console.log('fin');
  });
}

init();
