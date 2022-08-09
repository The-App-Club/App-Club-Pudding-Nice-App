import React, {useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import {useTheme} from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import {Interactive} from './components/Interactive';
import {Graphinaize} from './components/Graphinaize';
import {getPageIdInfoList} from './plugins';
import {css} from '@emotion/css';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const App = () => {
  const [selectedPageIdInfoList, setSelectedPageIdInfoList] = useState([
    '69861',
  ]);
  const [pageIdInfoList, setPageIdInfoList] = useState([]);
  const [metrics, setMetrics] = useState('views');
  const [bin, setBin] = useState(1);
  const [year, setYear] = useState('all');
  const [month, setMonth] = useState('all');

  const theme = useTheme();

  useEffect(() => {
    async function fetch() {
      const pageIdInfoList = await getPageIdInfoList({
        publicURL: '/data/people.csv',
      });
      setPageIdInfoList(pageIdInfoList);
    }
    fetch();
  }, []);

  const handleChangePageIdList = (event) => {
    const {
      target: {value},
    } = event;
    setSelectedPageIdInfoList(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };
  const handleChangeYear = (e) => {
    setYear(e.target.value);
  };
  const handleChangeMonth = (e) => {
    setMonth(e.target.value);
  };
  const handleChangeMetrics = (e) => {
    setMetrics(e.target.value);
  };
  const handleChangeBin = (e) => {
    setBin(e.target.value);
  };
  return (
    <div>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
        `}
      >
        <FormControl fullWidth>
          <InputLabel id="year">year</InputLabel>
          <Select
            labelId="year"
            value={year}
            label="year"
            onChange={handleChangeYear}
          >
            {['all', '2020', '2021'].map((year, index) => {
              return (
                <MenuItem key={index} value={year}>
                  {year}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
        <FormControl fullWidth>
          <InputLabel id="month">month</InputLabel>
          <Select
            labelId="month"
            value={month}
            label="month"
            onChange={handleChangeMonth}
          >
            {[
              'all',
              '1',
              '2',
              '3',
              '4',
              '5',
              '6',
              '7',
              '8',
              '9',
              '10',
              '11',
              '12',
            ].map((month, index) => {
              return (
                <MenuItem key={index} value={month}>
                  {month}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="metrics">metrics</InputLabel>
          <Select
            labelId="metrics"
            value={metrics}
            label="metrics"
            onChange={handleChangeMetrics}
          >
            {['views', 'share'].map((metrics, index) => {
              return (
                <MenuItem key={index} value={metrics}>
                  {metrics}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="bin">bin</InputLabel>
          <Select
            labelId="bin"
            value={bin}
            label="bin"
            onChange={handleChangeBin}
          >
            {[1, 2, 3, 7].map((bin, index) => {
              return (
                <MenuItem key={index} value={bin}>
                  {`For ${bin} days`}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel id="person">Person</InputLabel>
          <Select
            labelId="person"
            id="person-select"
            multiple
            value={selectedPageIdInfoList}
            onChange={handleChangePageIdList}
            input={<OutlinedInput label="Person" />}
            MenuProps={MenuProps}
          >
            {pageIdInfoList.map((pageIdInfo, index) => {
              return (
                <MenuItem
                  key={index}
                  value={pageIdInfo.pageId}
                  style={getStyles(pageIdInfo.pageId, pageIdInfoList, theme)}
                >
                  {pageIdInfo.name}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </div>

      <Interactive
        pageIdList={selectedPageIdInfoList}
        allPageIdInfoList={pageIdInfoList}
        metrics={metrics}
        bin={bin}
        month={month}
        year={year}
      ></Interactive>

      <Graphinaize
        pageIdList={selectedPageIdInfoList}
        allPageIdInfoList={pageIdInfoList}
        metrics={metrics}
        bin={bin}
        month={month}
        year={year}
      ></Graphinaize>
    </div>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
