import * as d3 from 'd3';
async function loadData() {
  const data = await d3.csv('/data/recent-grads.csv');
  // https://observablehq.com/@d3/d3-mean-d3-median-and-friends
  // https://github.com/d3/d3-array
  const groupedData = d3.group(data, (d) => {
    return d.Major_category;
  });

  const categroyAverageInfo = {};
  for (const [k, v] of groupedData.entries()) {
    const totalList = v.map((itemInfo) => {
      return +itemInfo.Total;
    });
    Object.assign(categroyAverageInfo, {[k]: d3.mean(totalList)});
  }

  const categroyWomenShareInfo = {};
  for (const [k, v] of groupedData.entries()) {
    const totalPersonList = v.map((itemInfo) => {
      return +itemInfo.Total;
    });
    const totalWomenList = v.map((itemInfo) => {
      return +itemInfo.Women;
    });
    Object.assign(categroyWomenShareInfo, {
      [k]: d3.sum(totalWomenList) / d3.sum(totalPersonList),
    });
  }

  const dataset = data.map((itemInfo) => {
    return {
      Major: itemInfo.Major,
      Total: +itemInfo.Total,
      Men: +itemInfo.Men,
      Women: +itemInfo.Women,
      Median: +itemInfo.Median,
      Unemployment: +itemInfo.Unemployment_rate,
      Category: itemInfo.Major_category,
      ShareWomen: +itemInfo.ShareWomen,
      HistCol: +itemInfo.Histogram_column,
      Midpoint: +itemInfo.midpoint,
      Average: categroyAverageInfo[itemInfo.Major_category],
      WomenShare: categroyWomenShareInfo[itemInfo.Major_category],
    };
  });
  return dataset;
}

export {loadData};
