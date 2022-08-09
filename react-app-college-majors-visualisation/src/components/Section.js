import {forwardRef} from 'react';

import {SectionIntro} from './SectionIntro';
import {SectionOutro} from './SectionOutro';
import {Section1} from './Section1';
import {Section2} from './Section2';
import {Section3} from './Section3';
import {Section4} from './Section4';
import {Section5} from './Section5';
import {Section6} from './Section6';

const _Section = ({sectionNumber, activeSectionNumber}, ref) => {
  switch (sectionNumber) {
    case 0:
      return (
        <SectionIntro
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></SectionIntro>
      );

    case 1:
      return (
        <Section1
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section1>
      );

    case 2:
      return (
        <Section2
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section2>
      );

    case 3:
      return (
        <Section3
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section3>
      );

    case 4:
      return (
        <Section4
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section4>
      );

    case 5:
      return (
        <Section5
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section5>
      );

    case 6:
      return (
        <Section6
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></Section6>
      );

    case 7:
      return (
        <SectionOutro
          ref={ref}
          sectionNumber={sectionNumber}
          activeSectionNumber={activeSectionNumber}
        ></SectionOutro>
      );
    default:
      break;
  }
};

const Section = forwardRef(_Section);

export {Section};
