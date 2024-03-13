import React, {useEffect, useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import {GoZoomIn, GoZoomOut} from 'react-icons/go';
import Resultdata from '~/components/chart/result';
import Opticalroute from '~/components/chart/opticalroute';
import Group from './../../../assets/icons/Group 29.png';
import nonereflective from '~/assets/icons/Group 23.png';
import reflecive from '~/assets/icons/Group 27.png';
import startoffibeer from '~/assets/icons/startoffibeer.png';
import Alarms from '~/components/chart/alarms';
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
import {Table} from '~/components';
import {MdOutlineArrowBackIos} from 'react-icons/md';
import {deepcopy} from '~/util';
import {BiPlus} from 'react-icons/bi';
import {JSX} from 'react/jsx-runtime';
import {useParams} from 'react-router-dom';
import {useLocation} from 'react-router-dom';
import {$Get} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';

type chatrtabtype = {
  name: string;
  src: string;
};
type Verticalbotton = {
  name: string;
  classname: string;
  onClick: () => void;
};
type tabelItemstype = {
  index: string | number;
  Position: string;
  Loss: string;
  Reflectance: string;
  Peak: string;
  Attenuation: string;
  Cumulative: string;
  event_code: string | undefined;
};

type eventstype = {
  event_number: number;
  event_location: {
    x: number;
    y: number;
  };
  attenuation_coef_lead_in_fiber: number;
  event_loss: number;
  event_reflectance: number;
  event_code: string;
  loss_measurment_technique: string;
  marker_location_1: number;
  marker_location_2: number;
  marker_location_3: number;
  marker_location_4: number;
  marker_location_5: number;
  comment: string;
};

const allcurve: {id: string; data: {x: number; y: number}[]}[] = [
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
      {x: 10, y: 65},
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
      {x: 11, y: 45},
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
const columns = {
  index: {label: 'Index', size: 'w-[9%]'},
  Position: {label: 'Position/Length (km)', size: 'w-[14%]', sort: true},
  Loss: {label: 'Loss (dB)', size: 'w-[7%]'},
  Reflectance: {label: 'Reflectance (dB)', size: 'w-[12%]'},
  Peak: {label: 'Peak Reflectance (dB)', size: 'w-[13%]'},
  Attenuation: {label: 'Attenuation (dB/km)', size: 'w-[13%]'},
  Cumulative: {label: 'Cumulative Loss (dB)', size: 'w-[13%]'},
};

// -----------main --------------main ---------------- main ------------------- main --------------
function Chart() {
  const plotref: any = useRef();
  let location = useLocation();

  const [chartdata, setChartdata] = useState<any>({});
  const [leftverticaltab, setLeftverticaltab] = useState<string>('Trace');
  const [allchart, setAllchart] = useState<string[]>([]);
  const [allshapes, setAllshapes] = useState<any>([]);
  const [fakeevents, setfakeEvents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [mousecursor, setMousecursor] = useState(false);
  const [fixedyaxies, setFixedyaxies] = useState(false);
  const [selectedevents, setSelectedEvents] = useState<any>(null);
  const [dragmode, setDragmode] = useState<
    | false
    | 'select'
    | 'zoom'
    | 'pan'
    | 'lasso'
    | 'orbit'
    | 'turntable'
    | undefined
  >(false);
  const [allcurveline, setAllcurveline] = useState<
    {
      id: string;
      data: {x: number; y: number}[];
    }[]
  >([]);
  const [autotick, setAutodic] = useState(true);

  useEffect(() => {
    // let data:any;
    setLoading(true);
    const getchartdata = async () => {
      try {
        const getdata = await $Get(
          `otdr/optical-route/${location.state.opticalrout_id}/test-setups/measurements/${location.state.measurement_id}`,
        );
        let datass = await getdata.json();
        let allpointsdata = datass?.datapoints?.data_points?.map(
          (data: [number, number]) => ({x: data[0], y: data[1]}),
        );
        setChartdata(datass);
        setAllcurveline([
          {
            id: 'Cur',
            data: allpointsdata,
          },
        ]);
        const max_x =
          allpointsdata &&
          Math.max(...allpointsdata?.map((o: {x: number; y: number}) => o.x));
        setMaxx(max_x);
        const max_y =
          allpointsdata &&
          Math.max(...allpointsdata?.map((o: {x: number; y: number}) => o.y));
        setMaxy(max_y);
        // -----------------------

        // -----------------------------
        let Arrowevents = [];
        for (let i = 0; i < datass?.key_events?.events?.length; i++) {
          if (datass?.key_events?.events[i]?.event_code == 'Start of fiber') {
            Arrowevents.push({
              x: datass?.key_events.events[i]?.event_location?.x,
              y: datass.key_events.events[i].event_location.y,
              type: 'arrowevent',
              location: 'start',
              event_number: datass.key_events.events[i].event_number,
            });
          } else if (datass.key_events.events[i].event_code == 'End of fiber') {
            Arrowevents.push({
              x: datass.key_events.events[i].event_location.x,
              y: datass.key_events.events[i].event_location.y,
              type: 'arrowevent',
              location: 'end',
              event_number: datass.key_events.events[i].event_number,
            });
          }
        }

        // ###################################################################################################
        let allshapesCopy = deepcopy(allshapes);
        let elements: JSX.Element[] = [];
        // if (!showeventdetail) {
        Arrowevents?.forEach((point, index) => {
          const X = point.x;
          const Y = point.y!;
          if (point.location == 'start') {
            allshapesCopy.push(
              {
                type: 'line',
                x0: X, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y - 10, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 3, // width of the line
                  zIndex:-1
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y + 10, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 3, // width of the line
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y - 10, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 3, // width of the line
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X + 15, // x coordinate of the second point
                y1: Y - 11, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X + 15, // x coordinate of the second point
                y1: Y - 9, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X + 15, // x coordinate of the second point
                y1: Y + 9, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width:1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X + 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X + 15, // x coordinate of the second point
                y1: Y + 11, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                },
              },
            );
          } else {
            allshapesCopy.push(
              {
                type: 'line',
                x0: X, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y - 10, // y coordinate of the second point

                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 3, // width of the line
                  // zindex: 10,
                  // layer: 'below',
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y + 10, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width:3, // width of the line
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X, // x coordinate of the second point
                y1: Y - 10, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 3, // width of the line
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X - 15, // x coordinate of the second point
                y1: Y - 11, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width:1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y - 10, // y coordinate of the first point
                x1: X - 15, // x coordinate of the second point
                y1: Y - 9, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X - 15, // x coordinate of the second point
                y1: Y + 9, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                },
              },
              {
                type: 'line',
                x0: X - 70, // x coordinate of the first point
                y0: Y + 10, // y coordinate of the first point
                x1: X - 15, // x coordinate of the second point
                y1: Y + 11, // y coordinate of the second point
                editable: false,
                line: {
                  color: '#A80000', // color of the line
                  width: 1, // width of the line
                  zindex: 10,
                },
              },
            );
          }
        });
        setAllshapes(allshapesCopy);
        // }

        // ###################################################################################################
        // --------------------------------
        const Allevents = datass?.key_events?.events;
        let items = [];
        let sumloss = 0;
        for (let c = 0; c < Allevents?.length; c++) {
          sumloss += Allevents[c].event_loss;
          items.push({
            index: c + 1,
            Position: (Allevents[c].event_location.x / 1000)
              .toString()
              .substring(0, 7),
            Loss: Allevents[c]?.event_loss?.toString().substring(0, 7) || '',
            Reflectance: Allevents[c].event_reflectance
              .toString()
              .substring(0, 7),
            Peak: '',
            Attenuation: '',
            Cumulative: sumloss.toString().substring(0, 7),
            event_code: Allevents[c].event_code || undefined,

            // tabbodybg: [{name: "Position", onclick: ()=>alert("Position")}],
          });
          if (c < Allevents.length - 1) {
            sumloss +=
              Allevents[c + 1]?.event_location?.y -
                Allevents[c]?.event_location?.y || 0;
            items.push({
              index: '',
              Position: (
                (Allevents[c + 1].event_location.x -
                  Allevents[c].event_location.x) /
                1000
              )
                .toString()
                .substring(0, 7),
              Loss:
                (
                  Allevents[c + 1]?.event_location?.y -
                  Allevents[c]?.event_location?.y
                )
                  ?.toString()
                  .substring(0, 7) || '---',
              Reflectance: '',
              Peak: '',
              Attenuation: (
                (Allevents[c + 1]?.event_location?.y -
                  Allevents[c]?.event_location?.y) /
                ((Allevents[c + 1].event_location.x -
                  Allevents[c].event_location.x) /
                  1000)
              )
                .toString()
                .substring(0, 7),
              Cumulative: sumloss.toString().substring(0, 7),
              event_code: undefined,
              tabrowbg: '#C6DFF8',
            });
          }
        }
        setTabelitems(items);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    // try {
    getchartdata();
    // } catch (error) {}
    // *******************************************************************
  }, []);

  console.log('allcurveline', allcurveline);
  console.log('😁', allcurveline);
  const [reightbar, setReightbar] = useState('Result');
  const [mousecoordinate, setMousecoordinate] = useState({x: 0, y: 0});

  const [maxx, setMaxx] = useState(0);
  const [tabelItems, setTabelitems] = useState<tabelItemstype[]>([]);
  const [maxy, setMaxy] = useState(0);
  const [selectedVerticalline, setSelectedVerticalline] = useState('');
  const [showevents, setShowEwents] = useState(false);

  const [verticalLines, setVerticalLines] = useState<
    {
      x: number;
      y?: number;
      event_number?: number;
      type: string;
      location?: string;
      name: string;
    }[]
  >([]);

  const filterArray = (a: string[], b: string[]) => {
    var c = a.filter(function (item) {
      return !b.includes(item); // یا return b.indexOf(item) === -1;
    });
    return c;
  };
  // ---- func ------func --------------- func ---------------- func ------------- func --------
  const Events = () => {
    if (showevents) {
    } else {
      setfakeEvents([
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[0]?.event_location?.x,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[0]?.event_location?.y +
              index / 2 -
              10,
          ),
          //   data?.key_events?.events[0]?.event_location?.y - 10,
          // ],

          text: [chartdata?.key_events?.events[0]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+markers+text',
          line: {width: 6, zindex: 10, color: '#A80000'},
          marker: {color: '#A80000', zIndex: 10},
          event_number: chartdata?.key_events?.events[0]?.event_number,
          name: 'events',
         layer:"above"
        },
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[1]?.event_location?.x,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[1]?.event_location?.y +
              index / 2 -
              10,
          ),

          text: [chartdata?.key_events?.events[1]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+markers+text',
          line: {width: 6, zindex: 10, color: '#A80000'},
          marker: {color: '#A80000', zIndex: 10},
          event_number: chartdata?.key_events?.events[1]?.event_number,
          name: 'events',
          layer:"above"
        },
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[2]?.event_location?.x,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[2]?.event_location?.y +
              index / 2 -
              10,
          ),

          type: 'line',
          text: [chartdata?.key_events?.events[2]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+markers+text',
          line: {width: 6, zindex: 10, color: '#A80000'},
          marker: {color: '#A80000', zIndex: 10},
          event_number: chartdata?.key_events?.events[2]?.event_number,
          layer:"above"
          // marker: {color: 'blue',zIndex: 2},
        },
      ]);
      setSelectedEvents(null);
      addarowevents();
      setShowEwents(true);
    }

    setLeftverticaltab('Events');
  };

  console.log('maxy', Math.floor(2 * maxy), typeof maxy);

  const addarowevents = () => {
    let Arrowevents = [];
    for (let i = 0; i < chartdata?.key_events?.events?.length; i++) {
      if (chartdata?.key_events?.events[i]?.event_code == 'Start of fiber') {
        Arrowevents.push({
          x: chartdata?.key_events.events[i]?.event_location?.x,
          y: chartdata.key_events.events[i].event_location.y,
          type: 'arrowevent',
          location: 'start',
          event_number: chartdata.key_events.events[i].event_number,
        });
      } else if (chartdata.key_events.events[i].event_code == 'End of fiber') {
        Arrowevents.push({
          x: chartdata.key_events.events[i].event_location.x,
          y: chartdata.key_events.events[i].event_location.y,
          type: 'arrowevent',
          location: 'end',
          event_number: chartdata.key_events.events[i].event_number,
        });
      }
    }

    let allshapesCopy: any = [];
    let elements: JSX.Element[] = [];
    // if (!showeventdetail) {
    Arrowevents?.forEach((point, index) => {
      const X = point.x;
      const Y = point.y!;
      if (point.location == 'start') {
        allshapesCopy.push(
          {
            type: 'line',
            x0: X, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y - 10, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y + 10, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y - 10, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X + 15, // x coordinate of the second point
            y1: Y - 11, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X + 15, // x coordinate of the second point
            y1: Y - 9, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X + 15, // x coordinate of the second point
            y1: Y + 9, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X + 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X + 15, // x coordinate of the second point
            y1: Y + 11, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
        );
      } else {
        allshapesCopy.push(
          {
            type: 'line',
            x0: X, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y - 10, // y coordinate of the second point

            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
              // zindex: 10,
              // layer: 'below',
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y + 10, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X, // x coordinate of the second point
            y1: Y - 10, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 3, // width of the line
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X - 15, // x coordinate of the second point
            y1: Y - 11, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y - 10, // y coordinate of the first point
            x1: X - 15, // x coordinate of the second point
            y1: Y - 9, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X - 15, // x coordinate of the second point
            y1: Y + 9, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
            },
          },
          {
            type: 'line',
            x0: X - 70, // x coordinate of the first point
            y0: Y + 10, // y coordinate of the first point
            x1: X - 15, // x coordinate of the second point
            y1: Y + 11, // y coordinate of the second point
            editable: false,
            showlegend: false,
            line: {
              color: '#A80000', // color of the line
              width: 1, // width of the line
              // zindex: 10,
            },
          },
        );
      }
    });
    setAllshapes(allshapesCopy);
  };
  const Trace = () => {
    setLeftverticaltab('Trace');
    setShowEwents(false);
    addarowevents();
    setfakeEvents([]);
  };

  const Measure = () => {
    // setSelectedEvents(null);
    if (selectedevents != null) {
      if (fakeevents.length >= 3) {
        setLeftverticaltab('Measure');
      }
    }
  };

  const LinkView = () => {
    setLeftverticaltab('LinkView');
  };

  //  const takeScreenshot = () => {
  //     const plotComponent = plotref.current;
  //     Plotly.toImage(plotComponent, {format: 'png'}).then(function(dataUrl) {
  //     // اینجا میتوانید dataUrl را به عنوان منبع برای یک تصویر در HTML قرار دهید
  //     // یا از آن برای ذخیره تصویر استفاده کنید
  //     });
  //     }

  const showcurveline = (name: string) => {
    const find = allcurve.findIndex(data => data.id == name);
    const find2 = allcurveline.findIndex(data => data.id == name);

    const find3 = allchart.findIndex(data => data == name);
    if (find2 > -1) {
      const filtercurvs = allcurveline.filter(data => data.id != name);
      setAllcurveline(filtercurvs);
    } else {
      setAllcurveline(
        (prev: {id: string; data: {x: number; y: number}[]}[]) => [
          ...prev,
          allcurve[find],
        ],
      );
    }

    if (find3 > -1) {
      const filtercurvs = allchart.filter(data => data != name);
      setAllchart(filtercurvs);
    } else {
      setAllchart(prev => [...prev, name]);
    }
  };

  const movebigline = (name: string, direction: string) => {
    // if (isDraggingname == name) {
    const verticalLinesCopy = deepcopy(verticalLines);
    const findverticalindex = verticalLines.findIndex(
      data => data.name && data.name == name,
    );
    verticalLinesCopy[findverticalindex].x =
      direction == 'right'
        ? verticalLines[findverticalindex].x + 10
        : verticalLines[findverticalindex].x - 10;
    // x / ((rect.width - rect.x) / (maxx - xScale.min)) + xScale.min;

    setVerticalLines(verticalLinesCopy);
    // }
  };

  // ------ component --------- component ------------ component --------------- component ------------------
  const Chatrtabtype = ({name, src, ...props}: chatrtabtype) => {
    return (
      <button
        onClick={() => showcurveline(name)}
        className={`${
          allchart.indexOf(name) > -1 ? 'bg-[#C6DFF8]' : 'bg-none'
        } mb-[2px] box-border flex h-[40px]  w-[87px] flex-row items-center justify-between px-[4px]`}>
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

  const Datatext = (props: {value: string}) => {
    return (
      <span className="mb-[20px] w-[50px] text-[20px] font-light leading-[24.2px] text-[#000000]">
        {props.value}
      </span>
    );
  };

  const Row = ({name}: {name: string}) => {
    return (
      <div className="flex w-full flex-row justify-between">
        <Datatext value={name} />
        <Datatext
          value={(
            (fakeevents.find((data: any) => data.text[0] == name)?.x[0]! ||
              selectedevents?.x[0]) / 1000
          )
            .toString()
            .substring(0, 5)}
        />
        <Datatext value="km" />
        <Datatext
          value={(finddata(name) ? finddata(name)[1] : selectedevents?.y[36])
            ?.toString()
            .substring(0, 5)}
        />
        <Datatext value="dB" />
      </div>
    );
  };

  var X2 = fakeevents.find((data: any) => data.text[0] == 'a')?.x[0];

  let findequal2 = chartdata?.datapoints?.data_points?.find(
    (data: [number, number]) => data[0] == X2,
  );

  let findbigger = chartdata?.datapoints?.data_points?.find(
    (data: [number, number]) => data[0] >= X2,
  );

  const finddata = (linename: string) => {
    var X = fakeevents.find((data: any) => data.text[0] == linename)?.x[0];
    // let X = verticalLines!.find(data => data.name == linename)?.x!;
    let findequal = chartdata?.datapoints?.data_points?.find(
      (data: [number, number]) => data[0] == X,
    );
    let findbigger = chartdata?.datapoints?.data_points?.find(
      (data: [number, number]) => data[0] >= X,
    );
    return (findequal && findequal) || findbigger;
  };

  const Tabbox = ({name}: {name: string}) => {
    return (
      <div className="mb-[4px] flex w-full flex-row justify-between">
        <span className="2xl:tex-[20px] w-[63.6px] text-[16px]  leading-[26px] text-[#000000]">
          {name}:
        </span>

        {name == 'A-B' ? (
          <span className="2xl:tex-[20px] w-[63.6px]  text-[16px] leading-[26px] text-[#000000]">
            {(
              ((finddata('B') ? finddata('B')[0] : selectedevents.x[0]) -
                (finddata('A') ? finddata('A')[0] : selectedevents.x[0])) /
              1000
            )
              .toString()
              .substring(0, 5)}
          </span>
        ) : (
          <span className="2xl:tex-[20px] w-[63.6px]  text-[16px] leading-[26px] text-[#000000]">
            {(
              fakeevents.find((data: any) => data.text[0] == name)?.x[0] /
                1000 || selectedevents.x[0] / 1000
            )
              .toString()
              .substring(0, 5)}
          </span>
        )}

        <span className="2xl:tex-[20px] w-[63.6px] text-[16px] leading-[26px] text-[#000000]">
          km
        </span>
        {name == 'A-B' ? (
          <span className="2xl:tex-[20px] w-[63.6px] text-[16px] leading-[26px] text-[#000000]">
            {(
              (finddata('B') ? finddata('B')[1] : selectedevents.y[36]) -
              (finddata('A') ? finddata('A')[1] : selectedevents.y[36])
            )
              .toString()
              .substring(0, 5)}
          </span>
        ) : (
          <span className="2xl:tex-[20px] w-[63.6px] text-[16px] leading-[26px] text-[#000000]">
            {(finddata(name) ? finddata(name)[1] : selectedevents.y[36])
              .toString()
              .substring(0, 5)}
          </span>
        )}

        <span className="2xl:tex-[20px] w-[63.6px] text-[16px] leading-[26px] text-[#000000]">
          dB
        </span>
      </div>
    );
  };

  const onclickshap = () => {
    let x = mousecoordinate.x;
    const fakeeventsCopy = deepcopy(fakeevents);
    const finddataindex = fakeevents.findIndex(
      (data: any) => data.x[0] <= x + 20 && data.x[0] >= x - 20,
    );

    if (finddataindex > -1) {
      if (fakeevents[finddataindex].name) {
        // setSelectedEvents(fakeevents[finddataindex]);
        const finevent = chartdata.key_events.events.find(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (data: eventstype) =>
            data.event_number == fakeevents[finddataindex].event_number,
        );

        setAllshapes([]);
        setShowEwents(false);
        setSelectedEvents(fakeevents[finddataindex]);
        setfakeEvents([
          {
            x: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => finevent.marker_location_1,
            ),
            y: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => Number(data) / 2,
            ),
            type: 'line',
            text: ['a'],
            textfont: {color: ['#A80000']},
            showlegend: false,
            textposition: 'bottom',
            mode: 'lines+markers+text',
            line: {width: 6, zindex: 10, color: '#A80000'},
            marker: {color: '#A80000', zIndex: 10},
            event_number: chartdata?.key_events?.events[0]?.event_number,
            layer:"above"
          },
          {
            x: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => Number(finevent.marker_location_2) * 20,
            ),
            y: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => data / 2,
            ),
            text: ['A'],
            textfont: {color: ['#A80000']},
            textposition: 'bottom',
            mode: 'lines+markers+text',
            type: 'line',
            showlegend: false,
            line: {width: 6, zindex: 10, color: '#A80000'},
            marker: {color: '#A80000', zIndex: 10},
            event_number: chartdata?.key_events?.events[0]?.event_number,
            layer:"above"
          },
          {
            x: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => Number(finevent.marker_location_5) * 40,
            ),
            y: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => data / 2,
            ),
            text: ['b'],
            textposition: 'bottom',
            textfont: {color: ['#A80000']},
            mode: 'lines+markers+text',
            type: 'line',
            showlegend: false,
            line: {
              width: 6,
              zindex: 10,
              color: 'textfont: {color:["#A80000"]},',
            },
            marker: {color: '#A80000', zIndex: 10},
            event_number: chartdata?.key_events?.events[0]?.event_number,
            layer:"above"
          },
          {
            x: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => Number(finevent.marker_location_4) * 70,
            ),
            y: [...new Array(Math.floor(2 * maxy)).keys()].map(
              data => data / 2,
            ),
            text: ['B'],
            textposition: 'bottom',
            mode: 'lines+markers+text',
            type: 'line',
            showlegend: false,
            textfont: {color: ['#A80000']},
            line: {width: 6, zindex: 10, color: '#A80000'},
            marker: {color: '#A80000', zIndex: 10},
            event_number: chartdata?.key_events?.events[0]?.event_number,
            layer:"above"
          },
        ]);

        // **************************************
      } else {
        if (
          ['a', 'A', 'b', 'B'].findIndex(
            data => data == fakeevents[finddataindex].text[0],
          ) > -1
        ) {
          if (!selectedevents.name) {
            let selectedeventsCopy = deepcopy(selectedevents);
            (selectedeventsCopy.showlegend = false),
              fakeeventsCopy.push(selectedeventsCopy);
          }

          if (leftverticaltab == 'Measure') {
            setAllshapes([
              {
                type: 'line',
                x0: fakeevents[finddataindex].x[0], // x coordinate of the first point
                y0: fakeevents[finddataindex].y[0], // y coordinate of the first point
                x1: fakeevents[finddataindex].x[0], // x coordinate of the second point,
                y1: fakeevents[finddataindex].y[70], // y coordinate of the first point
                editable: true,
                showlegend: false,
                label: {
                  text: 'jhjkhjk',
                  textposition: 'bottom center',
                },
                line: {
                  layer: 'below',
                  editable: true,
                  color: 'green', // color of the line
                  width: 6, // width of the line
                  zindex: 10,
                },
              },
            ]);
            setSelectedEvents(fakeevents[finddataindex]);
            fakeeventsCopy.splice(finddataindex, 1);
            setfakeEvents(fakeeventsCopy);
          }
        } else {
          // **********************************
        }
      }
    }
  };

  const onclickwordtab = (a: string) => {
    const fakeeventsCopy = deepcopy(fakeevents);
    if (selectedevents != null) {
      let selectedeventsCopy = deepcopy(selectedevents);
      (selectedeventsCopy.showlegend = false),
        fakeeventsCopy.push(selectedeventsCopy);
    }
    const findeventsindex = fakeeventsCopy.findIndex(
      (data: any) => data.text[0] == a,
    );
    setAllshapes([
      {
        type: 'line',
        x0: fakeevents[findeventsindex].x[0], // x coordinate of the first point
        y0: fakeevents[findeventsindex].y[0], // y coordinate of the first point
        x1: fakeevents[findeventsindex].x[0], // x coordinate of the second point,
        y1: fakeevents[findeventsindex].y[70], // y coordinate of the first point
        editable: true,
        showlegend: false,
        label: {
          text: 'jhjkhjk',
          textposition: 'bottom center',
        },
        line: {
          layer: 'below',
          editable: true,
          color: 'green', // color of the line
          width: 6, // width of the line
          zindex: 10,
        },
      },
      // {
      //   x:[fakeevents[finddataindex].x[0], fakeevents[finddataindex].x[0]],
      //   y: [0, 35],
      //   type: 'line',
      //   mode: 'lines+markers',
      //   line: {width: 10, zindex: 10, color: 'blue'},
      //   marker: {color: 'blue', zIndex: 10},
      //   event_number: fakeevents[finddataindex].event_number,
      // },
    ]);

    setSelectedEvents(fakeevents[findeventsindex]);

    fakeeventsCopy.splice(findeventsindex, 1);
    setfakeEvents(fakeeventsCopy);
  };

  const moveshapes = (e: any) => {
    const dataaa = filterArray(
      ['a', 'A', 'b', 'B'],
      [fakeevents[0].text[0], fakeevents[1].text[0], fakeevents[2].text[0]],
    );

    // if (leftverticaltab == 'Measure') {
    if (dataaa.length > 0) {
      setSelectedEvents({
        x: [...new Array(Math.floor(2 * maxy)).keys()].map(
          data => e[`shapes[0].x0`],
        ),
        y: [...new Array(Math.floor(2 * maxy)).keys()].map(
          (data, index) => e[`shapes[0].y0`] + index / 2,
        ),
        text: [dataaa[0]],
        textposition: 'bottom',
        type: 'line',
        mode: 'lines+markers+text',
        event_number: chartdata?.key_events?.events[0]?.event_number,
        textfont: {color: ['#A80000']},
        line: {width: 6, zindex: 10, color: '#A80000'},
        marker: {color: '#A80000', zIndex: 10},
        // event_number: data?.key_events?.events[0]?.event_number,
      });
    } else {
      setSelectedEvents({
        x: [...Array(41).keys()].map(dataa => e[`shapes[0].x0`]),
        y: [...Array(41).keys()].map(
          (dat, index) => e[`shapes[0].y0`] + index / 2,
        ),
        //   data?.key_events?.events[0]?.event_location?.y - 10,
        // ],
        type: 'line',
        mode: 'lines+markers',
        line: {width: 6, zindex: 10, color: '#A80000'},
        marker: {color: '#A80000', zIndex: 10},
        event_number: chartdata?.key_events?.events[0]?.event_number,
      });
    }
  };
  return (
    <div className="relative box-border flex h-auto w-full flex-col p-[10px] pb-[200px] pt-[100px]">
      <div className="flex h-[540px]  w-full flex-row">
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
                onClick={() => {
                  setFixedyaxies(false), setDragmode(false);
                }}
                src={arrowupchart}
                className="h-[30px] w-[30px] cursor-pointer"
              />
              <img
                onClick={() => {
                  setFixedyaxies(true), setDragmode('pan');
                }}
                src={hand}
                className="mt-[20px] h-[40px] w-[30px] cursor-pointer"
              />
              <GoZoomIn
                //  onClick={() => zoom(true, basescale + 100)}
                size={30}
                className="mt-[20px] cursor-pointer"
              />
              <GoZoomOut
                // onClick={() => zoom(false, basescale - 1)}
                size={30}
                className="mt-[20px] cursor-pointer"
              />
              <img
                onClick={() => {
                  setFixedyaxies(true), setDragmode('zoom');
                }}
                src={ZoomArea}
                className="mt-[20px] h-[30px] w-[30px] cursor-pointer"
              />
              <img
                onClick={() => {
                  // zoom(false, 1), setbasescale(2), setRectangelzoom(false);
                }}
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
        <div className="mx-[10px] flex h-full w-[calc(100vw-510px)]  flex-col">
          <div className="h-[calc(100%-50px)] w-full">
            <div
              className={`relative ${
                mousecursor ? 'cursor-pointer' : 'cursor-default'
              } h-full  w-[calc(100vw-510px)] bg-[#fffff]`}>
              {loading ?  <div className="absolute left-[50%] top-[130px] z-20">
                  <GeneralLoadingSpinner size='h-14 w-14'/>
                </div> : (
               null
              )}

              <Plot
                ref={plotref}
                onRelayout={e => moveshapes(e)}
                className="h-[538px] w-full bg-[red] p-0"
                onHover={e =>
                  setMousecoordinate({
                    x: Number(e.points[0].x),
                    y: Number(e.points[0].y),
                  })
                }
                onClick={e => onclickshap()}
                // onclickshap(e.points[0].x)
                data={[
                  {
                    showlegend: false,
                    x: allcurveline[0]?.data?.map(dat => dat.x),
                    y: allcurveline[0]?.data?.map(dat => dat.y),
                    type: 'scatter',
                    mode: 'lines',
                    line: {width: 6},
                    marker: {color: 'red'},
                  },
                  ...fakeevents,
                ]}
                config={{
                  displayModeBar: true,
                  // modeBarButtonsRemove: [
                  //   'zoom2d', // this will remove the zoom button
                  //   'zoomIn2d', // this will remove the zoom in button
                  //   'zoomOut2d' // this will remove the zoom out button
                  //   ],
                }}
                layout={{
                  margin: {
                    l: 20,
                    r: 20,
                    t: 20,
                    b: 20,
                  },
                  clickmode: 'event+select',
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  dragmode: dragmode,
                  uirevision: 'constant',
                  // title: 'A Fancy Plot',
                  shapes: allshapes,
                  // leggend: false,
                  yaxis: {
                    // this is the key property to fix the y axis
                    fixedrange: false,
                  },
                  xaxis: {
                    autotick: autotick,
                    dtick: 100,
                  },
                }}
              />
            </div>
          </div>

          {/* <div className="relative mt-[30px] flex h-[10px] w-[720px] bg-[#18C047]">
            <div className="absolute left-0 top-[-5px] z-10 h-[20px] w-[5px] bg-[#C09B18]"></div>
            <div className="absolute right-0  top-[-5px] z-10 h-[20px] w-[5px] bg-[#C09B18]"></div>
            <div className="absolute right-[100px]  top-[-5px] z-10 h-[20px] w-[5px] bg-[#C09B18]"></div>
            <div className="absolute right-[150px]  top-[-5px] z-10 h-[20px] w-[5px] bg-[#C09B18]"></div>
          </div> */}
        </div>
        {/* ---- reightbar ------- reightbar ------------------ reightbar ------------- reightbar ------------- reightbar ------------ */}
        <div className="w-[370px]">
          {reightbar == 'Result' ? (
            <Resultdata
              Date={getPrettyDateTime(chartdata?.date)
                .split(' ')[0]
                .replace('-', '/')
                .replace('-', '/')}
              Length={(
                chartdata?.key_events?.events[
                  chartdata.key_events.events.length - 1
                ].event_location.x / 1000
              )
                .toString()
                .substring(0, 5)}
              AverageLoss={(
                Number(chartdata?.key_events?.end_to_end_loss) /
                (chartdata?.key_events?.events[
                  chartdata?.key_events.events?.length - 1
                ].event_location.x /
                  1000)
              )
                .toString()
                .substring(0, 5)}
              ORL={chartdata?.key_events?.optical_return_loss}
              Loss={chartdata?.key_events?.end_to_end_loss
                .toString()
                .substring(0, 5)}
              NoiseFloor={chartdata?.fxd_params?.noise_floor_level}
              onclick={e => setReightbar(e)}
            />
          ) : reightbar == 'Alarms' ? (
            <Alarms onclick={e => setReightbar(e)} />
          ) : (
            <Opticalroute
              Wavelength={chartdata.fxd_params.actual_wavelength}
              onclick={e => setReightbar(e)}
            />
          )}
        </div>
      </div>

      <div className="flex w-full flex-row justify-between">
        {/* ---- tabel ------- tabel ------------------ tabel ------------- tabel ------------- tabel ------------ */}
        {leftverticaltab == 'Measure' ? (
          <>
            <div className="ml-[80px] mt-[55px] flex w-[calc(100vw-504px)] flex-row justify-between">
              <div className="box-border  flex  w-[35.4%] flex-col ">
                <div className="relative box-border h-auto w-full rounded-[10px] bg-[#C6DFF8] p-[9px]">
                  <Tabbox name="a" />
                  <Tabbox name="A" />
                  <Tabbox name="B" />
                  <Tabbox name="b" />
                  <Tabbox name="A-B" />
                </div>
                <div className="mt-[10px] flex w-full flex-row justify-between">
                  <button className="flex h-[53px] w-[50px] items-center justify-center  bg-[#C6DFF8]">
                    <MdOutlineArrowBackIos
                      size={40}
                      onClick={() => {
                        movebigline(selectedVerticalline, 'left');
                      }}
                    />
                  </button>
                  <button
                    onClick={() => {
                      onclickwordtab('a'), setSelectedVerticalline('a');
                    }}
                    className={`flex h-[50px] w-[50px] items-center justify-center ${
                      selectedevents != null && selectedevents.text[0] == 'a'
                        ? 'bg-[#006BBC] text-white'
                        : 'bg-[#C6DFF8] text-black'
                    }  text-[20px]`}>
                    a
                  </button>
                  <button
                    onClick={() => {
                      onclickwordtab('A'), setSelectedVerticalline('A');
                    }}
                    className={`flex h-[50px] w-[50px] items-center justify-center ${
                      selectedevents != null && selectedevents.text[0] == 'A'
                        ? 'bg-[#006BBC] text-white'
                        : 'bg-[#C6DFF8] text-black'
                    } text-[20px]`}>
                    A
                  </button>
                  <button
                    onClick={() => {
                      onclickwordtab('B'), setSelectedVerticalline('B');
                    }}
                    className={`flex h-[50px] w-[50px] items-center justify-center ${
                      selectedevents != null && selectedevents.text[0] == 'B'
                        ? 'bg-[#006BBC] text-white'
                        : 'bg-[#C6DFF8] text-black'
                    } text-[20px]`}>
                    B
                  </button>
                  <button
                    onClick={() => {
                      onclickwordtab('b'), setSelectedVerticalline('b');
                    }}
                    className={`flex h-[50px] w-[50px] items-center justify-center ${
                      selectedevents != null && selectedevents.text[0] == 'b'
                        ? 'bg-[#006BBC] text-white'
                        : 'bg-[#C6DFF8] text-black'
                    } text-[20px]`}>
                    b
                  </button>
                  <button className="flex h-[50px] w-[50px] bg-[#C6DFF8]">
                    <MdOutlineArrowBackIos
                      size={40}
                      onClick={() => {
                        movebigline(selectedVerticalline, 'right');
                      }}
                      className="rotate-180"
                    />
                  </button>
                </div>
              </div>

              <div className="flex h-[222px] w-[63.9%] flex-col">
                <div className=" flex h-full w-full flex-row justify-between rounded-[10px] bg-[#C6DFF8] 2xl:bg-[red]">
                  <div className="flex h-full w-[265px] flex-col items-center justify-center">
                    <span className="mt-[-10px] text-[20px] font-light leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      Avg. A-B Loss:
                    </span>
                    {/* <span className="mt-[20px] text-[20px] font-bold leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      {(
                        (finddata('B')[1] - finddata('A')[1]) /
                        (finddata('B')[0] - finddata('A')[0])
                      )
                        .toString()
                        .substring(0, 9)}
                    </span> */}
                  </div>
                  <div className="flex h-full w-[265px] flex-col items-center justify-center">
                    <span className="mt-[-10px] text-[20px] font-light leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      Four-Point Loss:
                    </span>
                    <span className="mt-[20px] text-[20px] font-bold leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      0.384 dB
                    </span>
                  </div>
                  <div className="flex h-full w-[265px] flex-col items-center justify-center">
                    <span className="mt-[-10px] text-[20px] font-light leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      Four-Point Loss:
                    </span>
                    <span className="mt-[20px] text-[20px] font-bold leading-[36.31px] text-[#000000] 2xl:text-[25px]">
                      0.384 dB
                    </span>
                  </div>
                </div>
                <div className="mt-[10px] flex w-full flex-row justify-between">
                  <button className="h-[50px] w-[32%] bg-[#C6DFF8] text-[20px] font-light">
                    Event
                  </button>
                  <button className="h-[50px] w-[32%] bg-[#C6DFF8] text-[20px] font-light">
                    Section
                  </button>
                  <button className="h-[50px] w-[32%] bg-[#C6DFF8] text-[20px] font-light">
                    ORL
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          <Table
            bordered={true}
            onclicktitle={(tabname: string, sortalfabet: boolean) => () => {}}
            tabicon={'Name'}
            cols={columns}
            items={tabelItems}
            dynamicColumns={['index']}
            renderDynamicColumn={({key, value}) => {
              if (key == 'index') {
                if (value.index == '') {
                  return (
                    <div className="flex  w-full flex-row items-center justify-start">
                      <BiPlus />
                      <img className="ml-[5px] h-[8px] w-[16px]" src={Group} />
                    </div>
                  );
                } else if (value.event_code == 'Start of fiber') {
                  return (
                    <div className="flex  w-full flex-row items-center justify-start">
                      <BiPlus />
                      <img
                        className="ml-[5px] h-[22px] w-[13px]"
                        src={startoffibeer}
                      />
                      <span className="ml-[4px] text-[20px] font-normal leading-[24.2px]">
                        {value.index}
                      </span>
                    </div>
                  );
                } else if (value.event_code == 'End of fiber') {
                  return (
                    <div className="flex  w-full flex-row items-center justify-start">
                      <BiPlus />
                      <img
                        className="ml-[5px] h-[22px] w-[13px] rotate-180"
                        src={startoffibeer}
                      />
                      <span className="ml-[4px] text-[20px] font-normal leading-[24.2px]">
                        {value.index}
                      </span>
                    </div>
                  );
                } else if (value.event_code == 'reflecive') {
                  return (
                    <div className="flex  w-full flex-row items-center justify-start">
                      <BiPlus />
                      <img
                        className="ml-[5px] h-[22px] w-[13px] rotate-180"
                        src={reflecive}
                      />
                      <span className="ml-[4px] text-[20px] font-normal leading-[24.2px]">
                        {value.index}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <div className="flex  w-full flex-row items-center justify-start">
                      <BiPlus />
                      <img
                        className="ml-[5px] h-[22px] w-[13px] rotate-180"
                        src={nonereflective}
                      />
                      <span className="ml-[4px] text-[20px] font-normal leading-[24.2px]">
                        {value.index}
                      </span>
                    </div>
                  );
                }
              }
            }}
            containerClassName="w-[calc(100vw-504px)] ml-[80px] mt-[20px]"
          />
        )}

        {/* -------------------------------- */}
        <div className={`flex flex-col `}>
          <div
            className={`w-auto ${
              fakeevents.length >= 3 &&
              allshapes.length <= 1 &&
              leftverticaltab != 'Measure'
                ? 'opacity-100'
                : 'opacity-0'
            }`}>
            <div className="mt-[20px] box-border h-[195px] w-[370px] rounded-[10px] bg-[#C6DFF8] p-[20px]">
              <Row name="a" />
              <Row name="A" />
              <Row name="B" />
              <Row name="b" />
            </div>
          </div>
          <div className="flex w-[360px] flex-row">
            <span className="ml-[25px] mr-[45px] text-[24px] font-normal text-[#000000]">
              x:{mousecoordinate.x.toString().substring(0, 5)}
            </span>
            <span className="text-[24px] font-normal text-[#000000]">
              y:{mousecoordinate.y.toString().substring(0, 5)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chart;
