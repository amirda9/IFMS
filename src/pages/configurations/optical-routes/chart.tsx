import React, {useState} from 'react';
import {GoZoomIn, GoZoomOut} from 'react-icons/go';
import {ResponsiveLineCanvas, ResponsiveLine} from '@nivo/line';
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
import {MyResponsiveLineCanvas} from '~/components/chart';
type chatrtabtype = {
  name: string;
  src: string;
};
type Verticalbotton = {
  name: string;
  classname: string;
  onClick: () => void;
};
// ######################################################

// ######################################################


const columns = {
  index: {label: 'Index', size: 'w-[7%]'},
  name: {label: 'Position/Length (km)', size: 'w-[14%]', sort: true},
  Loss: {label: 'Loss (dB)', size: 'w-[7%]'},
  Reflectance: {label: 'Reflectance (dB)', size: 'w-[12%]'},
  Peak: {label: 'Peak Reflectance (dB)', size: 'w-[15%]'},
  Attenuation: {label: 'Attenuation (dB/km)', size: 'w-[13%]'},
  Cumulative: {label: 'Cumulative Loss (dB)', size: 'w-[13%]'},
};

const allcurve = [
  {
    id: 'Cur',
    data: [
      {x: 1, y: 14},
      {x: 2, y: 19},
      {x: 3, y: 4},
      {x: 4, y: 15},
      {x: 5, y: 25},
      {x: 6, y: 22},
      {x: 7, y: 18},
      {x: 8, y: 4},
      {x: 10, y: 35},
      {x: 11, y: 25},
    ],
  },
  {
    id: 'Ref',
    data: [
      {x: 1, y: 12},
      {x: 2, y: 17},
      {x: 3, y: 18},
      {x: 4, y: 14},
      {x: 5, y: 19},
      {x: 6, y: 22},
      {x: 7, y: 27},
      {x: 8, y: 29},
      {x: 10, y: 31},
      {x: 11, y: 35},
    ],
  },
  {
    id: 'Max',
    data: [
      {x: 1, y: 8},
      {x: 2, y: 12},
      {x: 3, y: 14},
      {x: 4, y: 28},
      {x: 5, y: 2},
      {x: 6, y: 5},
      {x: 7, y: 9},
      {x: 8, y: 18},
      {x: 10, y: 2},
      {x: 11, y: 14},
    ],
  },
  {
    id: 'Min',
    data: [
      {x: 1, y: 6},
      {x: 2, y: 8},
      {x: 3, y: 28},
      {x: 4, y: 5},
      {x: 5, y: 16},
      {x: 6, y: 7},
      {x: 7, y: 15},
      {x: 8, y: 2},
      {x: 10, y: 18},
      {x: 11, y: 9},
    ],
  },
  {
    id: 'Avg',
    data: [
      {x: 1, y: 12},
      {x: 2, y: 2},
      {x: 3, y: 14},
      {x: 4, y: 15},
      {x: 5, y: 8},
      {x: 6, y: 19},
      {x: 7, y: 22},
      {x: 8, y: 2},
      {x: 10, y: 7},
      {x: 11, y: 18},
    ],
  },
];

// -----------main --------------main ---------------- main ------------------- main --------------
function Chart() {
  const [leftbartabselected, setLeftbartabselected] = useState('');
  const [leftverticaltab, setLeftverticaltab] = useState<string>('');
  const [allchart, setAllchart] = useState<string[]>([]);
  const [mousecursor, setMousecursor] = useState(false);
  const [allcurveline, setAllcurveline] = useState<any>([]);
  const [mousePosition, setMousePosition] = React.useState({x: 0, y: 0});
  const [verticalLines, setVerticalLines] = useState<{x: number; y: number}[]>(
    [],
  );


  
  const [xScale, setXScale] = useState<any>({
    type: 'point',tickFormat: (value:any) => Math.abs(Math.round(value / 5) * 5)
  });
  const [yScale, setYScale] = useState<any>({
    type: 'linear'
  });
// ---- func ------func --------------- func ---------------- func ------------- func --------
  const Events = () => {
    setLeftverticaltab('Events');
    const dataa = [
      {x: 4, y: 15},
      {x: 2, y: 19},
    ];
    setVerticalLines(prev => [...prev, ...dataa]);
  };

  const Trace = () => {
    setLeftverticaltab('Trace');
  };

  const Measure = () => {
    setLeftverticaltab('Measure');
  };

  const LinkView = () => {
    setLeftverticaltab('LinkView');
  };

  const zoom = () => {
    setXScale({
      type: 'point',
      min: 2,
      // max: 4,
    });
    setYScale({
      type: 'linear',
      min: 15,
      // max: 20,
    });
  };

  const getColorForId = (id: string) => {
    if (id === 'Cur') return '#273746';
    if (id === 'Ref') return '#229954';
    if (id === 'Max') return '#A93226';
    if (id === 'Min') return '#2471A3';
    return '#D4AC0D';
  };

  const showcurveline = (name: string) => {
    const find = allcurve.findIndex((data: any) => data.id == name);
    const find2 = allcurveline.findIndex((data: any) => data.id == name);

    const find3 = allchart.findIndex((data: any) => data == name);
    if (find2 > -1) {
      const filtercurvs = allcurveline.filter((data: any) => data.id != name);
      setAllcurveline(filtercurvs);
    } else {
      setAllcurveline((prev: any) => [...prev, allcurve[find]]);
    }

    if (find3 > -1) {
      const filtercurvs = allchart.filter((data: any) => data != name);
      setAllchart(filtercurvs);
    } else {
      setAllchart(prev => [...prev, name]);
    }
  };

  const VerticalLine = ({xScale, yScale}: any) => {
    const elements: any = [];
    verticalLines.forEach((point,index) => {
      const X = xScale(point.x);
      const Y = yScale(point.y);
      elements.push(
        <line key={index} x1={X} y1={Y + 70} x2={X} y2={Y - 70} stroke="red" />,
      );
      elements.push(
        <text
          key={index}
          x={X}
          y={Y + 84}
          fill="red"
          fontSize={12}
          textAnchor="middle">
          2
        </text>,
      );
    });
    return elements;
  };

// تعریف یک تابع برای دریافت مختصات موس
const handlePointMouseEnter = (event
  :any, point:any) => {
  // نمایش مختصات موس و نقطه در کنسول
  console.log("Mouse coordinates:", event);
  console.log("Point coordinates:", point);
  };

  React.useEffect(() => {
    const updateMousePosition = (ev: any) => {
      setMousePosition({x: ev.clientX, y: ev.pageY});
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);
  const markers = [
    {
      axis: 'x',
      value: 5,
      lineStyle: {stroke: 'black', strokeWidth: 2},
      legend: 'vertical line at x = 5',
      legendOrientation: 'vertical',
      legendPosition: 'top-left',
      legendOffsetY: -5,
    },
  ];


// ------ component --------- component ------------ component --------------- component ------------------
  const Chatrtabtype = ({name, src, ...props}: chatrtabtype) => {
    return (
      <button
        onClick={() => showcurveline(name)}
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
  const Verticalbotton = ({name, classname, ...props}: Verticalbotton) => {
    return (
      <button
        {...props}
        className={`${
          leftverticaltab == name
            ? 'bg-[#006BBC]  text-[#ffff] '
            : 'bg-[#C6DFF8] text-[#000000]'
        } mt-[1px]  box-border w-[40px] text-[18px] font-light leading-[21.87px] ${classname}`}>
        <div className="rotate-90">{name}</div>
      </button>
    );
  };
  // ##############################################################################################
  return (
    <div className="box-border flex w-full flex-col overflow-x-hidden p-[10px]">
      <div className="flex h-[540px] w-full flex-row">
        {/* ---- left ------- left ------------------ left ------------- left ------------- left ------------ */}
        <div className="flex h-full w-[87px] flex-col">
          <div className="flex h-[360px] w-full flex-row">
            <div className="flex w-[40px] flex-col">
              <Verticalbotton
                onClick={() => Trace()}
                name="Trace"
                classname="pb-[5px] h-[72px]"
              />
              <Verticalbotton
                onClick={() => Events()}
                name="Events"
                classname="pb-[15px] h-[79px]"
              />
              <Verticalbotton
                onClick={() => Measure()}
                name="Measure"
                classname="pb-[27px] h-[79px]"
              />
              <Verticalbotton
                onClick={() => LinkView()}
                name={`Link${''}View`}
                classname="pb-[35px] h-[99px]"
              />
            </div>

            <div className="ml-[15px] flex w-[30px] flex-col">
              <img
                onClick={() => setMousecursor(false)}
                src={arrowupchart}
                className="h-[30px] w-[30px] cursor-pointer"
              />
              <img
                onClick={() => setMousecursor(true)}
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
        {/* ---- chart ------- chart ------------------ chart ------------- chart ------------- chart ------------ */}
        <div className="mx-[10px] flex h-full w-[calc(100%-474px)] flex-col">
          <div className="h-[calc(100%-50px)] w-full">
            <div
          
              className={`${
                mousecursor ? 'cursor-pointer' : 'cursor-default'
              } h-full w-full`}>
              <ResponsiveLine
                data={allcurveline}
                margin={{top: 50, right: 50, bottom: 50, left: 50}}
                xScale={xScale}
                yScale={yScale}
                colors={({id}) => getColorForId(id)}
                xFormat="d"
                curve="linear"
                 onMouseEnter={(point:any, event:any)=>handlePointMouseEnter(point, event)} 
                lineWidth={3}
                // useMesh={true}
              
                layers={[
                  'grid',
                  // "markers",
                  'axes',
                  'areas',
                  'crosshair',
                  'lines',
                  // "points",
                  // 'slices',
                  "mesh",
                  'legends',
                  VerticalLine, // اضافه کردن تابع VerticalLine به لایه ها
                ]}
                // markers={markers}
                enablePoints={true}
                pointSize={10}
                pointColor={{theme: 'background'}}
                pointBorderWidth={2}
                pointBorderColor={{from: 'serieColor'}}
              />
              <button
                onClick={zoom}
                className="absoloute reight-[200px] top-[200px] z-50">
                Zoom
              </button>
            </div>
          </div>
        </div>
        {/* ---- reightbar ------- reightbar ------------------ reightbar ------------- reightbar ------------- reightbar ------------ */}
        <Resultdata />
      </div>
<div>{mousePosition.x}</div>
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


