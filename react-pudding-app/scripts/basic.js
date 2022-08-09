import * as d3 from 'd3';
import {default as faker} from '@faker-js/faker';
import {default as dayjs} from 'dayjs';
import {writeFileSync, mkdirSync, rmdirSync, existsSync} from 'fs';

const itemCount = 100;
const itemInfoList = [...Array(itemCount)].map((_, index) => {
  return {
    year: dayjs()
      .subtract(index % 3, 'year')
      .year(),
    department: faker.commerce.department(),
    name: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    color: faker.commerce.color(),
    material: faker.commerce.productMaterial(),
  };
});

(async () => {
  if (existsSync('./src/data')) {
    rmdirSync('./src/data', {recursive: true});
  }
  mkdirSync('./src/data', {recursive: true});
  const data = JSON.stringify(itemInfoList, 2, null);
  writeFileSync('./src/data/item.json', data, {encoding: 'utf-8'});
})();
