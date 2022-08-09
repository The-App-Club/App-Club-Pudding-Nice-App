const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');
const outputDir = './explore-data';
const MS_DAY = 86400000;

function getID(str) {
  return str.replace('/wiki/', '');
}

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

function getDeathIndex(data, timestamp_of_death) {
  const withDiff = data.map((d, i) => ({
    diff: getDiff(d.timestamp, timestamp_of_death),
    i,
  }));
  withDiff.sort((a, b) => d3.ascending(a.diff, b.diff));

  return withDiff.shift().i;
}

function getPageviewsByBin({person, days}) {
  const id = getID(person.link);
  const {pageid, timestamp_of_death} = person;
  const data = d3.csvParse(
    fs.readFileSync(`./output/people-bin-${days}/${id}.csv`, 'utf-8')
  );

  const deathIndex = getDeathIndex(data, timestamp_of_death);

  const output = data.map(
    ({bin, timestamp, timestamp_index, views, views_adjusted, share}, i) => ({
      bin,
      timestamp_index,
      bin_death_index: i - deathIndex,
      pageid,
      timestamp: timestamp.substring(0, 8),
      views,
      views_adjusted,
      share: (+share).toFixed(8),
    })
  );
  return output;
}

function getPageviews(person) {
  const id = getID(person.link);
  const {pageid, median_views_before} = person;
  const data = d3.csvParse(
    fs.readFileSync(`./output/people-pageviews/${id}.csv`, 'utf-8')
  );

  const deathIndex = data.findIndex(
    (d) => d.timestamp === `${person.timestamp_of_death}`
  );

  const output = data.map(
    ({timestamp, timestamp_index, views, views_adjusted, share}) => ({
      timestamp_index,
      death_index: timestamp_index - deathIndex,
      pageid,
      timestamp: timestamp.substring(0, 8),
      views,
      views_adjusted,
      share: (+share).toFixed(8),
    })
  );

  return output;
}

function init() {
  mkdirp(outputDir);

  // people
  const peopleData = d3.csvParse(
    fs.readFileSync('./output/people--details.csv', 'utf-8')
  );

  const peopleOutput = d3.csvFormat(peopleData);
  fs.writeFileSync('./explore-data/people.csv', peopleOutput);

  // pageviews
  const pageviewData = [].concat(...peopleData.map(getPageviews));

  const pageviewOutput = d3.csvFormat(pageviewData);
  fs.writeFileSync('./explore-data/pageviews.csv', pageviewOutput);

  // by week pageviews
  const bin7PageviewData = [].concat(
    ...peopleData.map((person) => getPageviewsByBin({person, days: 7}))
  );

  const bin7PageviewOutput = d3.csvFormat(bin7PageviewData);
  fs.writeFileSync('./explore-data/pageviews-bin-7.csv', bin7PageviewOutput);

  // by 48hrs pageviews
  const bin2PageviewData = [].concat(
    ...peopleData.map((person) => getPageviewsByBin({person, days: 2}))
  );

  const bin2PageviewOutput = d3.csvFormat(bin2PageviewData);
  fs.writeFileSync('./explore-data/pageviews-bin-2.csv', bin2PageviewOutput);

  // by 72hrs pageviews
  const bin3PageviewData = [].concat(
    ...peopleData.map((person) => getPageviewsByBin({person, days: 3}))
  );

  const bin3PageviewOutput = d3.csvFormat(bin3PageviewData);
  fs.writeFileSync('./explore-data/pageviews-bin-3.csv', bin3PageviewOutput);
}

init();
