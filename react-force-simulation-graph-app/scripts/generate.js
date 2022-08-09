import {default as chance} from 'chance';
import dayjs from 'dayjs';
import * as R from 'ramda';
import gsap from 'gsap';

const dataSize = 60;

const ccTypes = [
  'American Express',
  'Discover Card',
  'JCB',
  'Mastercard',
  'Visa',
  'Bankcard',
  'China UnionPay',
  'Maestro',
  'Cowboy Bebop',
];

const data = [...Array(dataSize).keys()].map((n, index) => {
  return {
    name: chance().name(),
    age: chance().age(),
    pet: chance().animal(),
    ccType: gsap.utils.wrap(ccTypes, chance().integer({min: 1, max: dataSize})),
    price: chance().integer({min: 10, max: 100}),
    purchasedAt: dayjs()
      .add(index - 10, 'days')
      .format(`YYYY-MM-DD`),
    id: index + 1,
  };
});

const a = Object.entries(
  R.groupBy((item) => {
    return item.ccType;
  }, data)
);

const b = a.map(([k, v], i) => {
  return [...v]
    .sort((a, b) => {
      // return a.price - b.price;
      return b.price - a.price;
    })
    .map((info, j) => {
      return Object.assign({...info, grp: i + 1, grpSeq: j + 1});
    });
});

const c = b.flat().sort((a, b) => {
  return a.grp - b.grp;
});
// console.table(c);
console.log(JSON.stringify(c));
