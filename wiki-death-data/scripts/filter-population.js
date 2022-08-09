import {writeFileSync, readFileSync} from 'fs';
import dayjs from 'dayjs';
const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');
const outputDir = './output';

const MS_DAY = 86400000;
const MIN_DAYS_PAD = 30;

function clean(data) {
  return data.map((d) => ({
    ...d,
    death_views_adjusted_2: +d.death_views_adjusted_2,
    median_views_adjusted_bd_2: +d.median_views_adjusted_bd_2,
  }));
}

function init() {
  mkdirp(outputDir);

  const data = clean(
    d3.csvParse(readFileSync('./output/people--stats.csv', 'utf-8'))
  );

  // filter by adjusted pageviews (must have hit 500k at bin 2)
  // filter by adjusted pageviews (must have median before death of at least 100)
  // filter by date (must be at least 30 days from edges)
  const filtered = data
    .filter((d) => d.death_views_adjusted_2 >= 500000)
    .filter((d) => d.median_views_adjusted_bd_2 >= 500)
    .filter((d) => {
      const dateStart = dayjs('2020');
      const dateEnd = dayjs('2021').endOf('year');
      const dateDeath = dayjs(
        new Date(`${d.date_of_death} ${d.year_of_death}`)
      );
      const diffStart = dateDeath.diff(dateStart, 'days');
      const diffEnd = dateEnd.diff(dateDeath, 'days');
      return diffStart >= MIN_DAYS_PAD && diffEnd >= MIN_DAYS_PAD;
    });
  const output = d3.csvFormat(filtered);
  writeFileSync('./output/people--filtered.csv', output);
}

init();
