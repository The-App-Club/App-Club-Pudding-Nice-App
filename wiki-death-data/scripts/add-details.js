const fs = require('fs');
const mkdirp = require('mkdirp');
const d3 = require('d3');
const request = require('request');
const outputDir = './output';
const BASE_URL = 'https://en.wikipedia.org/api/rest_v1/page/summary';

function getID(str) {
  return str.replace('/wiki/', '');
}

function getDetails(person) {
  return new Promise((resolve, reject) => {
    const id = getID(person.link);
    const url = `${BASE_URL}/${id}`;
    request(url, (err, resp, body) => {
      if (err) reject(err);
      else if (resp.statusCode === 200) {
        const data = JSON.parse(body);
        const {pageid, thumbnail, description, extract} = data;
        const {canonical, display} = data.titles;

        const thumbnail_source = thumbnail ? thumbnail.source : null;
        const thumbnail_width = thumbnail ? thumbnail.width : null;
        const thumbnail_height = thumbnail ? thumbnail.height : null;

        resolve({
          ...person,
          pageid,
          description,
          canonical,
          display,
          thumbnail_source,
          thumbnail_width,
          thumbnail_height,
          extract: extract.replace(/\n/g, ''),
        });
      } else reject(resp.statusCode);
    });
  });
}

function remakeInfo(person) {
  const resultInfo = person;
  Object.keys(resultInfo).map((key) => {
    if (key.indexOf('link') !== -1) {
      const cachedValue = resultInfo[key];
      delete resultInfo[key];
      return Object.assign(resultInfo, {link: cachedValue});
    } else {
      return resultInfo;
    }
  });
  return resultInfo;
}

async function begin() {
  const peopleData = d3.csvParse(
    fs.readFileSync('./output/people--filtered.csv', 'utf-8')
  );
  const withDetails = [];
  let index = 0;
  for (person of peopleData) {
    const remakedPerson = remakeInfo(person);
    console.log(`${index + 1} of ${peopleData.length}: ${remakedPerson.link}`);
    await getDetails(remakedPerson)
      .then((response) => {
        withDetails.push(response);
      })
      .catch((err) => {
        console.log(err);
        withDetails.push(remakedPerson);
      });
    index += 1;
  }

  const output = d3.csvFormat(withDetails);
  fs.writeFileSync('./output/people--details.csv', output);
}

function init() {
  mkdirp(outputDir);

  begin();
}

init();
