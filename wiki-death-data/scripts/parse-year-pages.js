import {readdirSync, readFileSync, writeFileSync} from 'fs';

const mkdirp = require('mkdirp');
const cheerio = require('cheerio');
const d3 = require('d3');

const monthList = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const outputDir = './output';
const inputDir = './output/year-pages';

function checkForDate(str) {
  const split = str.split(' ');
  const isMonth = monthList.includes(split[0]);
  const isDate = !isNaN(split[1]);
  return isMonth && isDate;
}

function makePeopleInfo({$, sel, year, monthIndex}) {
  if (sel.text().startsWith('Date unknown')) {
    return null;
  }

  // サブliタグは除外
  const isPerson = !sel.find('ul').length;

  if (isPerson) {
    // https://cheerio.js.org/classes/Cheerio.html#filter
    const a = sel.find('a').filter(function (i, el) {
      // this === el
      return $(this).attr('title') && $(this)[0].parent.name === 'li';
    });

    const firstA = a.first();
    const firstTitle = firstA.attr('title');
    const isDate = checkForDate(firstTitle);
    const name = isDate ? a.eq(1).attr('title') : firstTitle;
    const link = isDate ? a.eq(1).attr('href') : firstA.attr('href');

    // birth year
    const birthSel = a.eq(-1);
    const year_of_birth = birthSel.attr('title');

    // date of death
    let date_of_death = null;
    if (isDate) {
      date_of_death = a.eq(0).attr('title');
    } else {
      // fallback
      const parentLi = sel.parent().parent();
      date_of_death = parentLi.find('a').first().attr('title');
    }

    const year_of_death = year;
    const monthPad = d3.format('02')(monthIndex + 1);
    const datePad = d3.format('02')(date_of_death.split(' ')[1]);
    const timestamp_of_death = `${year}${monthPad}${datePad}`;
    return {
      link,
      name,
      year_of_birth,
      year_of_death,
      date_of_death,
      timestamp_of_death,
    };
  }

  return null;
}

function makePeopleInfoList({file, $, month, monthIndex}) {
  const output = [];
  const parent = $(`#${month}_2`).parent();
  // https://cheerio.js.org/classes/Cheerio.html#nextAll
  const ul = parent.nextAll('ul').eq(0);
  const year = file.replace('.html', '');
  ul.find('li').each((i, el) => {
    const person = makePeopleInfo({$, sel: $(el), year, monthIndex});
    if (person) {
      output.push(person);
    }
  });
  return output;
}

function extractPeople({file}) {
  const html = readFileSync(`${inputDir}/${file}`, 'utf-8');
  const $ = cheerio.load(html);

  const peopleByMonth = monthList.map((month, monthIndex) => {
    return makePeopleInfoList({file, $, month, monthIndex});
  });

  return [].concat(...peopleByMonth);
}

(() => {
  const files = readdirSync(inputDir).filter((file) => {
    return file.includes('.html');
  });

  const peopleByYear = files.map((file) => {
    return extractPeople({file});
  });

  const flatPeople = [].concat(...peopleByYear);

  const csvData = d3.csvFormat(flatPeople);

  mkdirp(outputDir);

  writeFileSync(`${outputDir}/people--all-deaths.csv`, csvData);
})();
