import React, { useState } from 'react';
import {ResponsivePieCanvas} from '@nivo/pie';
import {ResponsiveBar} from '@nivo/bar';
import { ResponsiveLine } from '@nivo/line';
import { RiArrowRightDoubleLine } from "react-icons/ri";
let pipedata = [
  {
    id: 'rust',
    label: 'rust',
    value: 253,
    color: 'rgba(231, 76, 60,1.0)',
  },
  {
    id: 'css',
    label: 'css',
    value: 172,
    color: 'rgba(16, 81, 216, 1)',
  },
  {
    id: 'css2',
    label: 'css2',
    value: 172,
    color: 'rgba(16, 81, 216, 1)',
  },
];
let bardata = [
  {
    country: '0',
    'hot dog': 20,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
  {
    country: '2',
    'hot dog': 35,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
  {
    country: '5',
    'hot dog': 20,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
  {
    country: '8',
    'hot dog': 35,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
  {
    country: '9',
    'hot dog': 20,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
  {
    country: '12',
    'hot dog': 35,
    hotdogColor: '#CAD6DA',
    burger: 10,
    burgerColor: '#FA98F4',
  },
];

const getColor = (bar: any) => {
  if (bar.id == 'burger') {
    return bar.data.burgerColor;
  } else {
    return bar.data.hotdogColor;
  }
};


const getColorForId = (id: string) => {
  if (id === 'Cur') return '#273746';
  if (id === 'Ref') return '#229954';
  if (id === 'Max') return '#A93226';
  if (id === 'Min') return '#2471A3';
  return '#D4AC0D';
};

const allpointsdata=[{x:0,y:2},{x:3,y:7},{x:5,y:5},{x:10,y:2}]

function Dashboard() {
  const [allcurveline, setAllcurveline] = useState<any>([{
    id: 'Cur',
    data: allpointsdata,
  },]);

  return (
    <div className="flex w-full relative flex-row justify-between px-[20px] py-[25px] pt-[100px]">
       <RiArrowRightDoubleLine className='absolute top-[5px] left-[5px]' />
      <div className="h-[500px] w-[32%] bg-white px-[10px]  pt-[25px]">
        <span className="mb-[-40px] flex justify-center text-[30px] font-bold leading-[36.31px]">
          Alarms By Region
        </span>

        <ResponsivePieCanvas
          arcLabelsTextColor="rgba(16, 81, 216, 1)"
          data={pipedata}
          margin={{top: 10, right: 80, bottom: 40, left: 50}}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={0}
          activeOuterRadiusOffset={8}
          colors={['#1051D8', '#1051D8']}
          borderColor={{
            from: 'color',
            modifiers: [['darker', 0.6]],
          }}
          arcLinkLabelsSkipAngle={10}
          arcLinkLabelsTextColor="#1051D8"
          arcLinkLabelsThickness={2}
          arcLinkLabelsColor={{from: 'color'}}
          arcLabelsSkipAngle={10}
        />
      </div>
      {/* -------------Optical Route-------------------------Optical Route-------------------------Optical Route----------------------- */}
      <div className="h-[500px] w-[32%] bg-white px-[10px]  pt-[25px]">
        <span className="mb-[10px] flex justify-center text-[30px] font-bold leading-[36.31px]">
        Alarms By Optical Route
        </span>
        <div className="h-[340px] w-full ">
        <ResponsiveLine
                // tooltip={tooltip}
                data={allcurveline}
                margin={{top: 10, right: 50, bottom: 40, left: 50}}

                colors={({id}) => getColorForId(id)}
                xFormat="d"
                curve="linear"
                enableSlices={false}
                debugSlices={false}
                enableCrosshair={false}
                lineWidth={3}
                layers={[
                  'grid',
                  'markers',
                  'axes',
                  'areas',
                  'crosshair',
                  'lines',
                  'points',
                  'slices',
                  // 'mesh',
                  'legends',
                ]}
                // markers={markers}
                // enablePoints={true}
                pointSize={0.1}
                pointColor={{theme: 'background'}}
                pointBorderWidth={2}
                pointBorderColor={{from: 'serieColor'}}
              />
        </div>
      </div>
      {/* -------------------RTU-----------------------RTU--------------------RTU---------------------- */}
      <div className="h-[500px] w-[32%] bg-white px-[10px]  pt-[25px]">
        <span className="mb-[10px] flex justify-center text-[30px] font-bold leading-[36.31px]">
        Alarms By RTU
        </span>
        <div className="h-[340px] w-full ">
          {/* <ResponsiveBar
            groupMode="grouped"
            data={bardata}
            keys={['hot dog', 'burger']}
            colors={getColor}
            indexBy="country"
            margin={{top: 50, right: 10, bottom: 50, left: 60}}
            padding={0.6}
            animate={false}
            valueScale={{type: 'linear'}}
            indexScale={{type: 'band', round: true}}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 1.6]],
            }}
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: 32,
              truncateTickAt: 0,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legendOffset: -40,
              truncateTickAt: 0,
            }}
            enableGridX={true}
            enableLabel={false}
            labelSkipWidth={10}
            labelSkipHeight={12}
            labelTextColor={{
              from: 'color',
              modifiers: [['darker', 1.6]],
            }}
            legends={[]}
            role="application"
            ariaLabel="Nivo bar chart demo"
            barAriaLabel={e =>
              e.id + ': ' + e.formattedValue + ' in country: ' + e.indexValue
            }
          /> */}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;


