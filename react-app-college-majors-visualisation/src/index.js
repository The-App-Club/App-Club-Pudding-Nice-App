import React, {createRef, useMemo, useEffect, useState} from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './config';

import * as d3 from 'd3';

import {Container} from './components/Container';
import {Section} from './components/Section';
import {Header} from './components/Header';
import {Footer} from './components/Footer';
import {scroller} from './plugins/scroller';

const sectionItemCount = 1 + 6 + 1; // start section + main section count + end section

const App = () => {
  const [activeSectionNumber, setActiveSectionNumber] = useState(null);
  // https://stackoverflow.com/questions/54633690/how-can-i-use-multiple-refs-for-an-array-of-elements-with-hooks
  const sectionItemListRef = useMemo(
    () =>
      Array(sectionItemCount)
        .fill()
        .map(() => createRef()),
    []
  );

  useEffect(() => {
    scroller.setSectionItemDomList({sectionItemListRef});
  }, [sectionItemListRef]);

  useEffect(() => {
    const handleActive = (e) => {
      const {sectionNumber} = {...e};
      d3.selectAll(
        sectionItemListRef.map((sectionItemRef) => {
          return sectionItemRef.current;
        })
      )
        .transition()
        .duration(500)
        .style('opacity', function (d, i) {
          return i === sectionNumber ? 1 : 0.1;
        });

      setActiveSectionNumber(sectionNumber);
    };

    scroller.on({action: 'active', callback: handleActive});
    return () => {
      scroller.on({action: 'active', callback: null});
    };
  }, [sectionItemListRef]);

  return (
    <>
      <Header></Header>
      <Container>
        {[...Array(sectionItemCount)].map((_, index) => {
          return (
            <Section
              key={index}
              ref={sectionItemListRef[index]}
              sectionNumber={index}
              activeSectionNumber={activeSectionNumber}
            ></Section>
          );
        })}
      </Container>
      <Footer></Footer>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
