import {useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {css} from '@emotion/css';
import {Graph} from './components/Graph';
// import {Graph2} from './components/Graph2';
import {Button} from '@mui/material';
import {SequentialRoundRobin} from 'round-robin-js';
const sequentialTable = new SequentialRoundRobin([1, 2, 3, 4]);
const App = () => {
  const [tik, setTik] = useState(new Date());
  // const [a, setA] = useState(0);
  const handleClick = () => {
    setTik(sequentialTable.next().value);
    // setA((a) => {
    //   return !a;
    // });
    // gsap.utils.
  };
  return (
    <>
      <Button variant={'outlined'} onClick={handleClick}>
        Do
      </Button>
      <div
        className={css`
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 100vh;
        `}
      >
        <Graph dataPath={`/data/dump.json`} tik={tik} />
        {/* <Graph2 tik={a} /> */}
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
