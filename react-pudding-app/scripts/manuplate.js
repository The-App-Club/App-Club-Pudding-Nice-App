import * as d3 from 'd3';
import {default as faker} from '@faker-js/faker';
import {default as dayjs} from 'dayjs';
import {writeFileSync, mkdirSync, rmdirSync, existsSync} from 'fs';

const itemCount = 10;
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

// const groupedInfoList = d3.group(itemInfoList, (d) => {
//   return d.year;
// });

// const groupedInfoList2 = d3.group(
//   itemInfoList,
//   (d) => {
//     return d.year;
//   },
//   (d) => {
//     return d.department;
//   },
// );

// const sumarizedInfo = d3.rollup(
//   itemInfoList,
//   (v) => {
//     return {
//       sum: d3.sum(v, (d) => {
//         return d.price;
//       }),
//       // https://stackoverflow.com/a/17726605/15972569
//       items: d3
//         .map(v, (d) => {
//           return d.name;
//         })
//         .join(", "),
//     };
//   },
//   (d) => {
//     return d.year;
//   },
//   (d) => {
//     return d.department;
//   }
// );

// console.log(sumarizedInfo);
// console.log(groupedInfoList);

// console.log(itemInfoList);
