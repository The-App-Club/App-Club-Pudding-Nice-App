import {isDesktop} from 'react-device-detect';

const colors = [
  '#ffcc00',
  '#ff6666',
  '#cc0066',
  '#66cccc',
  '#f688bb',
  '#65587f',
  '#baf1a1',
  '#333333',
  '#75b79e',
  '#66cccc',
  '#9de3d0',
  '#f1935c',
  '#0c7b93',
  '#eab0d9',
  '#baf1a1',
  '#9399ff',
];

const categories = [
  'Engineering',
  'Business',
  'Physical Sciences',
  'Law & Public Policy',
  'Computers & Mathematics',
  'Agriculture & Natural Resources',
  'Industrial Arts & Consumer Services',
  'Arts',
  'Health',
  'Social Science',
  'Biology & Life Science',
  'Education',
  'Humanities & Liberal Arts',
  'Psychology & Social Work',
  'Communications & Journalism',
  'Interdisciplinary',
];

const adjustWidth = () => {
  if (isDesktop) {
    return 1000;
  }
  return 300;
};

const adjustHeight = () => {
  if (isDesktop) {
    return 950;
  }
  return 3000;
};

const adjustMargin = () => {
  if (isDesktop) {
    return {top: 30, right: 60, bottom: 30, left: 60};
  }
  return {top: 50, right: 140, bottom: 50, left: 140};
};

const adjustRadius = () => {
  if (isDesktop) {
    return 1.2;
  }
  return 0.8;
};
const adjustX = () => {
  if (isDesktop) {
    return 200;
  }
  return 0;
};
const adjustY = () => {
  if (isDesktop) {
    return -50;
  }
  return 10;
};
const adjustCollide = () => {
  if (isDesktop) {
    return 4;
  }
  return 0.3;
};

const getCategoriesXY = (groupCount, gutterX, gutterY) => {
  return categories
    .eachSlice(groupCount)
    .map((categoryItemList, i) => {
      return categoryItemList.map((categoryItem, j) => {
        return {
          [categoryItem]: [i * gutterX, (j + 1) * gutterY],
        };
      });
    })
    .flat()
    .reduce((a, c) => {
      return Object.assign(a, c);
    }, {});
};
let margin = adjustMargin(),
  rect = {
    width: adjustWidth() - (margin.left + margin.right),
    height: adjustHeight() - (margin.top + margin.bottom),
  },
  width = adjustWidth() - (margin.left + margin.right),
  height = adjustHeight() - (margin.top + margin.bottom);

export {
  rect,
  margin,
  width,
  height,
  colors,
  categories,
  adjustRadius,
  adjustX,
  adjustY,
  adjustCollide,
  getCategoriesXY,
};
