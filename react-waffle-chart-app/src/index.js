import { useRef } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/index.scss';

import { Waffle } from './components/waffle';
import { Bar } from './components/bar';

const App = () => {
  const waffleRef = useRef(null);
  const barRef = useRef(null);
  return (
    <>
      <Waffle ref={waffleRef} />
      <Bar ref={barRef} />
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
