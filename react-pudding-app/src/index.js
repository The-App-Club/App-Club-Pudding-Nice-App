import React, {useId, createRef, useMemo} from 'react';
import {createRoot} from 'react-dom/client';
import './index.scss';
import {Spacer} from './components/Spacer';
import {Model} from './components/Model';
import {Title} from './components/Title';
import {Paragraph} from './components/Paragraph';
import {Section} from './components/Section';
import {Description} from './components/Description';
import {Object} from './components/Object';
import {Graph} from './components/Graph';
import {Scene} from './components/Scene';

import {default as item} from './data/item.json';

const App = ({context}) => {
  const sceneInfoList = [
    {
      sceneId: 1,
      sceneTitle: `Title 1`,
      objectURL: 'https://media4.giphy.com/media/10VjiVoa9rWC4M/giphy.gif',
      paragraphInfoList: [
        {
          id: useId(),
          text: `窓もゴーシュの病気子たちが児にすぼめ肩ございです。するとどう生なかっますというセロんた。`,
        },
        {
          id: useId(),
          text: `無理たましのましはたするとおっかさんの普通たちのところをはじつに下手たますて、それなどぎてしまいはもうじぶんがになりしものでしまし。`,
        },
      ],
      dataList: [item],
    },
    {
      sceneId: 2,
      sceneTitle: `Title 2`,
      objectURL: 'https://media.giphy.com/media/b21HcSrrBu8pi/giphy.gif',
      paragraphInfoList: [
        {
          id: useId(),
          text: `茎は出てガラスをたべるですた。みんなはまるでからだはまるくのまして戸はちょっとありがたいのますた。「遠くの一生けん命の兎の。`,
        },
        {
          id: useId(),
          text: `楽長も遠く負けていまし。ねずみは十なっ楽器のようのあるて行っまし。交響楽はセロ糸と何にのんているます。靴はゆうべからまもなくに聞いて孔へ北の方のようをもぐり込みから意地悪からたってどうせ赤を出てしまいまし。ごくごくすこしも血が包みをしたで。こっちどんどんにセロがまえて虎に教えましです。`,
        },
        {
          id: useId(),
          text: `みんなにそんなとうとうなっでしょことに。子。おじぎでもこつこつ用一日は悪いんたよ。かっこうへゴーシュが来て来それがいにこんなセロ底かっこうや先生団の本気でもの頭処を弾きてしまいでぶるぶる何の面目もとても見ことまし。ゴーシュ沓さま。`,
        },
      ],
      dataList: [item],
    },
    {
      sceneId: 3,
      sceneTitle: `Title 3`,
      objectURL: 'https://media.giphy.com/media/4ilFRqgbzbx4c/giphy.gif',
      paragraphInfoList: [
        {
          id: useId(),
          text: `「ありがとう弾きまし。しばらく病気はひどくたなあ。」「何たて」パンからしたまし。「ここらおえいた。とりだしてください。」`,
        },
        {
          id: useId(),
          text: `子はありてのもうを三日をあるきましまし。「これへしさんをかっこうじゃ云いてはじめと持たまし。`,
        },
        {
          id: useId(),
          text: `一疋はみんなをわらいなかセロに糸に弾きと小太鼓もそれこぼしてまわっ、ところがざとじぶんのに走っとゴーシュで出るませござい。それからねずみが一六本すぎの栗のゴーシュへ子のままが一生けん命まで叩くてはじめましです。`,
        },
        {
          id: useId(),
          text: `「ジャズいかにも元来まし。前ないかい。お残念うてふっがください。いきなりよろよろ楽器の別までなっましますて。」「なおり。`,
        },
        {
          id: useId(),
          text: `顔は川に見ろでしようを云ったむずかしい助けが戸棚とちがうでしで。「はさあ、どうこらえますなあ。」ゴーシュ待ち構えはやり直してまた練習を大物から音を叫んてましおしまいの扉をきたまし。`,
        },
      ],
      dataList: [item],
    },
    {
      sceneId: 4,
      sceneTitle: `Title 4`,
      objectURL: 'https://media.giphy.com/media/dVDkSCEvFr6W4/giphy.gif',
      paragraphInfoList: [
        {
          id: useId(),
          text: `するとセロはなぜ狸へぴたっと向いてくださらましなくてしばらく猫と舞台から答えましかと思えてまるでねずみののから弾き弾いましじ。だってまたにやにやゴーシュがかっこうをしうでして狸はしたたました。医者もこらきみはどうもはじめ一位のびっくりを云いないというゴーシュが過ぎいてろたりかっこうのもう外がしでしまし。それから近くは眼をかっどもがは水をは弾けますだて野ねずみひけ楽屋屋をしてこれをしばらくはいそしてわあれたなあというようにとり思っこいないまし。ゴーシュはぱちぱちうかっはいるてしばらくあといい済ましいないなかっ。`,
        },
        {
          id: useId(),
          text: `そしてゴーシュはすっかりして「かっこう、すみたりの病気はちゃんと叩くてですな。」としゃくにさわっましたい。水車入れもところがじつになりですましからない楽屋に二つゴーシュが万ぺんしが外を引きずっ何をみみずくを二ぴき飛んて「思わず狸。小屋がうるさいなおしたよ。`,
        },
        {
          id: useId(),
          text: `馬車を窓の手がかくどうしてはいっながらいところからそれから野ねずみをつぶっとしとゴーシュを聞いましだ。してつぶの室まげて間もなくドレミファがつけると来な。「はじめぶっつけてきとしてやろていいた。」ガラスがちょうど一ぴきだけ小太鼓にもったうち、狸も急いて何をおまえまでさっきはというようにまるで舌のざとじぶんのの眼のはいに呆れて、むしたうちの交響を終るまし砂糖でどうぞかえれですた。`,
        },
        {
          id: useId(),
          text: `かっこうはすっかり野ねずみをいうだた。すると向うはとんとんかっことりますようにしばらく泣き声をむしって叫んたた。それから町へ白い療をかえれてがぶっつかっで顔からもっました。「そら、コップがゴーシュだね。」ゴーシュは出してなっとパンが云いですと云いならたてさっきそのセロはぴたっとおれほどまるで落ち手には思ったましまします。`,
        },
      ],
      dataList: [item],
    },
    {
      sceneId: 5,
      sceneTitle: `Title 5`,
      objectURL: 'https://media.giphy.com/media/b1dXky39p5Zcs/giphy.gif',
      paragraphInfoList: [
        {
          id: useId(),
          text: `大きなだから手のこどもしまいですぐるぐるなっお舞台療はもうかもました。すると子もぼくが出せないますにおいてように失敗入れで勢の遠くがつけるから、遅く子のヴァイオリンを一遁明方とかいうどんなにせいせいを思っけれどもなっましう。「あと、こんな手にマッチでないでおどすそうましょですましてだいお心臓になっながら来てくださいだ。」`,
        },
        {
          id: useId(),
          text: `をたっきりしばらく頭のゴーシュをよくとるて大窓面白ゴーシュをなかなか向うましのは弾きて先生を叩くてに音たのはかかえませ。」「はあまたか。何の舌の間に大ありがとうごうはいるて、それを演奏の孔をあいて何たちの病気にいっということか。`,
        },
        {
          id: useId(),
          text: `金星こども曲の子あたりはおっかさんの曲のゴーシュの眼にあきねどこを何何だかロマチックシューマンが考えれが東パンをすって、どうしても舌のセロに向いているたた。`,
        },
      ],
      dataList: [item],
    },
  ];

  const sceneRefs = useMemo(() => {
    return sceneInfoList.map((n, _) => {
      return createRef();
    });
    // eslint-disable-next-line
  }, []);
  const modelRefs = useMemo(() => {
    return sceneInfoList.map((n, _) => {
      return createRef();
    });
    // eslint-disable-next-line
  }, []);
  const objectRefs = useMemo(() => {
    return sceneInfoList.map((n, _) => {
      return createRef();
    });
    // eslint-disable-next-line
  }, []);
  const graphRefs = useMemo(() => {
    return sceneInfoList.map((n, _) => {
      return createRef();
    });
    // eslint-disable-next-line
  }, []);
  const paragraphRefs = useMemo(() => {
    let cell = [...Array(sceneInfoList.length)];
    sceneInfoList.forEach((sceneInfo, i) => {
      cell[i] = [...Array(sceneInfo.paragraphInfoList.length)];
      sceneInfo.paragraphInfoList.forEach((paragraphInfo, j) => {
        cell[i][j] = createRef();
      });
    });
    return cell;
    // eslint-disable-next-line
  }, []);
  console.log(paragraphRefs);
  return (
    <>
      {sceneInfoList.map((sceneInfo, i) => {
        return (
          <Scene
            key={i}
            ref={sceneRefs[i]}
            modelRef={modelRefs[i]}
            objectRef={objectRefs[i]}
            graphRef={graphRefs[i]}
          >
            <Model ref={modelRefs[item]}>
              <Object ref={objectRefs[i]} src={sceneInfo.objectURL} alt={''} />
              {sceneInfo.dataList.length && (
                <Graph
                  sceneId={sceneInfo.sceneId}
                  ref={graphRefs[i]}
                  dataList={sceneInfo.dataList}
                />
              )}
            </Model>
            <Description>
              <Title>{sceneInfo.sceneTitle}</Title>
              <Section>
                <Paragraph>{`Scene${sceneInfo.sceneId} Start`}</Paragraph>
                {/* {[...new Array(10)].map((_, index) => {
                  return <Spacer key={index} />;
                })} */}
                {sceneInfo.paragraphInfoList.map((paragraphInfo, j) => {
                  return (
                    <div key={paragraphInfo.id}>
                      <Spacer />
                      <Spacer />
                      <Paragraph
                        ref={paragraphRefs[i][j]}
                        graphRef={graphRefs[i]}
                      >{`${paragraphInfo.text}`}</Paragraph>
                      <Spacer />
                      <Spacer />
                    </div>
                  );
                })}
                <Paragraph>{`Scene${sceneInfo.sceneId} End`}</Paragraph>
              </Section>
            </Description>
          </Scene>
        );
      })}
    </>
  );
};

const container = document.getElementById('root');

const root = createRoot(container);

root.render(<App />);
