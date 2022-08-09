import dayjs from 'dayjs';
const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');
const ss = require('simple-statistics');
const outputDir = './output';

function clean(data) {
  return data.map((d) => ({
    ...d,
    views: d.views.length ? +d.views : null,
    views_adjusted: d.views_adjusted.length ? +d.views_adjusted : null,
    share: d.share.length ? +d.share : null,
    bin_death_index: +d.bin_death_index,
  }));
}

function convertTimestampToDate(timestamp) {
  const year = timestamp.substring(0, 4);
  const month = +timestamp.substring(4, 6) - 1;
  const date = timestamp.substring(6, 8);
  return new Date(year, month, date);
}

function getSide({data, before, deathDate}) {
  return data.filter((d) => {
    const date = d.timestamp;
    deathDate = dayjs(deathDate).format('YYYYMMDD');
    return before ? date < deathDate : date > deathDate;
  });
}

function getAverageSides({person, data, metric, mode}) {
  const {year_of_death, date_of_death} = person;
  const deathDate = new Date(`${date_of_death} ${year_of_death}`);
  const before = getSide({data, deathDate, before: true});
  const after = getSide({data, deathDate, before: false});
  const vBefore = before.map((d) => {
    return d[metric];
  });
  const vAfter = after.map((d) => {
    return d[metric];
  });
  const mBefore =
    mode === 'median' ? d3.median(vBefore) || 0 : d3.mean(vBefore) || 0;
  const mAfter =
    mode === 'median' ? d3.median(vAfter) || 0 : d3.mean(vAfter) || 0;
  return {mBefore, mAfter};
}

function getDistribution({person, data}) {
  const {year_of_death, date_of_death} = person;
  const deathDate = new Date(`${date_of_death} ${year_of_death}`);

  const before = getSide({data, deathDate, before: true});
  const vals = before.map((d) => d.views_adjusted);
  if (before.length) {
    const std = ss.standardDeviation(vals) || 0;
    const iqr = ss.interquartileRange(vals) || 0;
    return {std, iqr};
  }

  return {std: 0, iqr: 0};
}

function getMaxValue({person, data}) {
  const max_share = d3.max(
    data.map((itemInfo) => {
      return itemInfo.share;
    })
  );
  const max_views = d3.max(
    data.map((itemInfo) => {
      return itemInfo.views;
    })
  );
  return {max_share, max_views};
}

function addInfo({data, bin, person}) {
  const withViews = data.filter((d) => d.views_adjusted);
  const di = data.find((d) => d.bin_death_index === 0);
  const death_views = di.views;
  const death_views_adjusted = di.views_adjusted;
  const medianViewsAdjustedObj = getAverageSides({
    person,
    data: withViews,
    metric: 'views_adjusted',
    mode: 'median',
  });
  const meanViewsAdjustedObj = getAverageSides({
    person,
    data: withViews,
    metric: 'views_adjusted',
    mode: 'mean',
  });

  const {max_share, max_views} = getMaxValue({person, data: withViews});

  const {std, iqr} = getDistribution({person, data: withViews});

  const output = {};
  output[`median_views_adjusted_bd_${bin}`] = medianViewsAdjustedObj.mBefore;
  output[`median_views_adjusted_ad_${bin}`] = medianViewsAdjustedObj.mAfter;
  output[`mean_views_adjusted_bd_${bin}`] = meanViewsAdjustedObj.mBefore;
  output[`death_views_${bin}`] = death_views;
  output[`death_views_adjusted_${bin}`] = death_views_adjusted;
  output[`std_${bin}`] = std;
  output[`iqr_${bin}`] = iqr;
  output[`max_share_${bin}`] = max_share;
  output[`max_views_${bin}`] = iqr;

  return output;
}

function loadData({bin, person}) {
  const id = person.link.replace('/wiki/', '');
  const file = `./output/people-bin-${bin}/${id}.csv`;
  return {
    data: clean(d3.csvParse(fs.readFileSync(file, 'utf-8'))),
    bin,
    person,
  };
}

function calculate(person) {
  const bins = [1, 2, 3, 7].map((bin) => loadData({bin, person}));
  const withInfo = bins.map(addInfo).reduce(
    (prev, cur) => {
      return {
        ...prev,
        ...cur,
      };
    },
    {...person}
  );
  return withInfo;
}

function init() {
  mkdirp(outputDir);

  const data = d3.csvParse(
    fs.readFileSync('./output/people--all-deaths.csv', 'utf-8')
  );

  const withAverages = data.map(calculate);
  const output = d3.csvFormat(withAverages);

  fs.writeFileSync('./output/people--stats.csv', output);
}

init();
