import * as d3 from 'd3';
// https://github.com/GRI-Inc/App-Club-Image-Graphics-App/blob/c7f71662c82c13ea4ddb9db9f30aa6f6d97abed3/image-grid-motion-effect/src/js/demo2/Grid.js
// https://syncer.jp/d3js/selection-on
// https://qiita.com/yuki153/items/c909c54204eaab6ca1b2

// https://github.com/GRI-Inc/App-Club-Scroll-Telling-App/blob/main/text-fade-in-out-like-apple-multiple/index.js#L51
// https://github.com/GRI-Inc/App-Club-Scroll-Telling-App/tree/main/mustache-storytelling-template
class Scroller {
  constructor() {
    this.currentIndex = -1;
    this.sectionItemDomList = [];
    this.sectionPositionInfoList = [];
    this.container = d3.select('body');
    this.dispatch = d3.dispatch('active', 'progress');
    this.handleScroll = (e) => {
      this.sectionPositionInfoList = [];
      this.sectionItemDomList.forEach((sectionItemDom, index) => {
        let prevSectionTopPos = 0;
        let currentSectionTopPos =
          sectionItemDom.getBoundingClientRect().top + window.scrollY;

        if (index === 0) {
          prevSectionTopPos = currentSectionTopPos;
        }
        this.sectionPositionInfoList.push({
          startPos: currentSectionTopPos - prevSectionTopPos,
          endPos:
            currentSectionTopPos -
            prevSectionTopPos +
            sectionItemDom.getBoundingClientRect().height,
        });
      });
      this.updateProgress();
    };

    this.handleResize = (e) => {
      // console.log('handleResize', e);
    };
  }

  unsubscribe() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleResize);
  }

  subscribe() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleResize);
  }

  setSectionItemDomList({sectionItemListRef}) {
    this.sectionItemDomList = sectionItemListRef.map((sectionItemRef) => {
      return sectionItemRef.current;
    });
  }

  updateProgress() {
    // https://observablehq.com/@d3/d3-bisect
    let pos = window.pageYOffset + 100; // 遊びの分で足しておく
    let sectionIndex = this.sectionPositionInfoList.findIndex(
      (sectionPositionInfo) => {
        return (
          sectionPositionInfo.startPos <= pos &&
          pos <= sectionPositionInfo.endPos
        );
      }
    );
    sectionIndex = Math.min(
      this.sectionPositionInfoList.length - 1,
      sectionIndex
    );

    if (this.currentIndex !== sectionIndex) {
      this.dispatch.call('active', this, {
        sectionNumber: sectionIndex,
      });
      this.currentIndex = sectionIndex;
    }
  }

  on({action, callback}) {
    // this is wrapper of d3 event handler
    this.dispatch.on(action, callback);
  }
}

const scroller = new Scroller();

scroller.subscribe();

export {scroller};
