import React, {useState} from 'react';
import {GoZoomIn, GoZoomOut} from 'react-icons/go';

import Resultdata from '~/components/chart/rightbar';
import arrowupchart from '~/assets/icons/arrowupchart.png';
import hand from '~/assets/icons/hand.png';
import ZoomArea from '~/assets/icons/ZoomArea.png';
import Vector1 from '~/assets/icons/Vector1.png';
import print from '~/assets/icons/print.png';
import Cur from '~/assets/icons/Cur.png';
import Ref from '~/assets/icons/Ref.png';
import Max from '~/assets/icons/Max.png';
import Min from '~/assets/icons/Min.png';
import Avg from '~/assets/icons/Avg.png';
import {SimpleBtn, Table} from '~/components';
import {Line} from '@nivo/line';
import { MyResponsiveLineCanvas } from '~/components/chart';
type chatrtabtype = {
  name: string;
  src: string;
};
const colorss = [
  "#ffc107",
  "#e7399c",
  "#607d8b",
  "#14d0f1",
  "#ffab91",
  "#6c5207",
  "#1e4505",
  "#86BBD8",
  "#d6ee06",
  "#8b008b",
  "#906ed7",
  "#d49416",
  "#90A4AE",
  "#3E2723",
  "#FF6E40",
  "#FFFF00",
  "#5de00a",
  "#e8e776",
]

// ######################################################
const dataa = [
  {
    id: 'سری A',
    data: [
      {x: '2023-01-01', y: 12},
      {x: '2023-01-02', y: 17},
      {x: '2023-01-03', y: 18},
      {x: '2023-01-04', y: 14},
      {x: '2023-01-05', y: 19},
    ],
  },
  {
    id: 'سری B',
    data: [
      {x: '2023-01-01', y: 20},
      {x: '2023-01-02', y: 16},
      {x: '2023-01-03', y: 15},
      {x: '2023-01-04', y: 21},
      {x: '2023-01-05', y: 22},
    ],
  },
  {
    id: 'سری C',
    data: [
      {x: '2023-01-01', y: 10},
      {x: '2023-01-02', y: 11},
      {x: '2023-01-03', y: 13},
      {x: '2023-01-04', y: 9},
      {x: '2023-01-05', y: 12},
    ],
  },
];

// ######################################################
type Verticalbotton = {
  name: string;
  classname: string;
};

const columns = {
  index: {label: 'Index', size: 'w-[7%]'},
  name: {label: 'Position/Length (km)', size: 'w-[14%]', sort: true},
  Loss: {label: 'Loss (dB)', size: 'w-[7%]'},
  Reflectance: {label: 'Reflectance (dB)', size: 'w-[12%]'},
  Peak: {label: 'Peak Reflectance (dB)', size: 'w-[15%]'},
  Attenuation: {label: 'Attenuation (dB/km)', size: 'w-[13%]'},
  Cumulative: {label: 'Cumulative Loss (dB)', size: 'w-[13%]'},
};

function Chart() {
  const [leftbartabselected, setLeftbartabselected] = useState('');
  const [allchart, setAllchart] = useState<string[]>([]);

  const Chatrtabtype = ({name, src, ...props}: chatrtabtype) => {
    return (
      <button
        onClick={() => setAllchart(prev => [...prev, name])}
        className={`${
          allchart.indexOf(name) > -1 ? 'bg-[#C6DFF8]' : 'bg-none'
        } mb-[2px] flex h-[40px] w-[87px]  flex-row items-center justify-between px-[4px]`}>
        <img {...props} src={src} className="mt-[0px] h-[20.5px] w-[37px]" />
        <span className="text-[20px] font-light leading-[24.2px] text-[#000000]">
          {name}
        </span>
      </button>
    );
  };

  const Verticalbotton = ({name, classname}: Verticalbotton) => {
    return (
      <button
        onClick={() => setLeftbartabselected(name)}
        className={`${
          leftbartabselected == name
            ? 'bg-[#006BBC]  text-[#ffff] '
            : 'bg-[#C6DFF8] text-[#000000]'
        } mt-[1px]  box-border w-[40px] text-[18px] font-light leading-[21.87px] ${classname}`}>
        <div className="rotate-90">{name}</div>
      </button>
    );
  };
  return (
    <div className="box-border flex w-full flex-col overflow-x-hidden p-[10px]">
      <div className="flex h-[540px] w-full flex-row">
        {/* ---- left ------- left ------------------ left ------------- left ------------- left ------------ */}
        <div className="flex h-full w-[87px] flex-col">
          <div className="flex h-[360px] w-full flex-row">
            <div className="flex w-[40px] flex-col">
              <Verticalbotton name="Trace" classname="pb-[5px] h-[72px]" />
              <Verticalbotton name="Events" classname="pb-[15px] h-[79px]" />
              <Verticalbotton name="Measure" classname="pb-[27px] h-[79px]" />
              <button
                onClick={() => setLeftbartabselected('Link View')}
                className={`${
                  leftbartabselected == 'Link View'
                    ? 'bg-[#006BBC]  text-[#ffff] '
                    : 'bg-[#C6DFF8] text-[#000000]'
                } mt-[1px] h-[94px] w-[40px] text-[18px] font-light leading-[21.87px]`}>
                <>
                  <div className="mt-[-5px] rotate-90">Link</div>
                  <div className="mt-[20px] rotate-90">View</div>
                </>
              </button>
            </div>

            <div className="ml-[15px] flex w-[30px] flex-col">
              <img
                src={arrowupchart}
                className="h-[30px] w-[30px] cursor-pointer"
              />
              <img
                src={hand}
                className="mt-[20px] h-[40px] w-[30px] cursor-pointer"
              />
              <GoZoomIn size={30} className="mt-[20px] cursor-pointer" />
              <GoZoomOut size={30} className="mt-[20px] cursor-pointer" />
              <img
                src={ZoomArea}
                className="mt-[20px] h-[30px] w-[30px] cursor-pointer"
              />
              <img
                src={Vector1}
                className="mt-[15px] h-[25.5px] w-[30px] cursor-pointer"
              />
              <img
                src={print}
                className="mt-[20px] h-[25.5px] w-[30px] cursor-pointer"
              />
            </div>
          </div>

          <Chatrtabtype name="Cur" src={Cur} />
          <Chatrtabtype name="Ref" src={Ref} />
          <Chatrtabtype name="Max" src={Max} />
          <Chatrtabtype name="Min" src={Min} />
          <Chatrtabtype name="Avg" src={Avg} />
        </div>
        {/* ---- center ------- center ------------------ center ------------- center ------------- center ------------ */}
        <div className="mx-[10px] flex h-full w-[calc(100%-474px)] flex-col">
          <div className="h-[calc(100%-50px)] w-full">
            <MyResponsiveLineCanvas />
            {/* <svg width={700} height={500}>
              <Line
                data={dataa}
                width={500}
                height={300}
                margin={{top: 50, right: 50, bottom: 50, left: 50}}
                xScale={{type: 'time', format: '%Y-%m-%d'}}
                xFormat="time:%Y-%m-%d"
                yScale={{type: 'linear'}}
                curve="monotoneX"
                // colors={{scheme: 'category10'}}
                colors={colorss}
                lineWidth={3}
                enablePoints={true}
                pointSize={10}
                pointColor={{theme: 'background'}}
                pointBorderWidth={2}
                pointBorderColor={{from: 'serieColor'}}
              />
            </svg> */}
          </div>
        </div>
        {/* ---- reightbar ------- reightbar ------------------ reightbar ------------- reightbar ------------- reightbar ------------ */}
        <Resultdata />
      </div>
      {/* ---- tabel ------- tabel ------------------ tabel ------------- tabel ------------- tabel ------------ */}
      <Table
        onclicktitle={(tabname: string, sortalfabet: boolean) => () => {}}
        tabicon={'Name'}
        cols={columns}
        items={[]}
        dynamicColumns={['index']}
        renderDynamicColumn={data => data.index}
        containerClassName="w-[calc(100vw-494px)] ml-[80px] mt-[20px]"
        // loading={list?.httpRequestStatus === 'loading'}
      />
    </div>
  );
}

export default Chart;
// {
//   render: () => <LineCanvas {...commonProperties} />
// }