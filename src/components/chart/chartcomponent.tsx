import {useEffect, useRef, useState} from 'react';
import Plot from 'react-plotly.js';
import {GoZoomIn, GoZoomOut} from 'react-icons/go';
import Resultdata from '~/components/chart/result';
import Opticalroute from '~/components/chart/opticalroute';
import Group from './../../assets/icons/Group 29.png';
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
import {useLocation} from 'react-router-dom';
import {$Get} from '~/util/requestapi';
import {getPrettyDateTime} from '~/util/time';
import GeneralLoadingSpinner from '~/components/loading/GeneralLoadingSpinner';
import {IoClose} from 'react-icons/io5';
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

type alllalarmsType = [
  {
    alarm: {
      id: string;
      name: string;
    };
    severity: string;
  },
];
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

type linklengthtype = {
  id: string;
  Length: Number;
  segments: {Length: number; offset: number; position: number}[];
}[];

type allchartdataype = {
  number_of_points: 0;
  number_of_used_scale_factors: 0;
  avg_data_points: [number, number][];
  max_data_points: [number, number][];
  min_data_points: [number, number][];
  reference_data_points: [number, number][];
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

type chartprops = {
  measurement_id: string;
  opticalrout_id: string;
  onclose: () => void;
};

// -----------main --------------main ---------------- main ------------------- main --------------
function ChartComponent({measurement_id, opticalrout_id, onclose}: chartprops) {
  const plotref: any = useRef();
  let location = useLocation();
  const [linkslengthdata, setLinkslengthdata] = useState<linklengthtype>([]);
  const [chartdata, setChartdata] = useState<any>({});
  const [leftverticaltab, setLeftverticaltab] = useState<string>('Trace');
  const [allchart, setAllchart] = useState<string[]>(['Cur']);
  const [allshapes, setAllshapes] = useState<any>([]);
  const [fakeevents, setfakeEvents] = useState<any>([]);
  const [arrowevents, setArrowevents] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [mousecursor, setMousecursor] = useState(false);
  const [fixedyaxies, setFixedyaxies] = useState(false);
  const [selectedevents, setSelectedEvents] = useState<any>(null);
  const [allalarms, setAllalarms] = useState<alllalarmsType | []>([]);
  const [allchartdata, setAllchartdata] = useState<allchartdataype | []>([]);
  const [allcurveline, setAllcurveline] = useState<
    {
      id: string;
      data: {x: number; y: number}[];
    }[]
  >([]);
  const [avg_data_points, setAvg_data_points] = useState<
    {x: number; y: number}[]
  >([]);
  const [max_data_point, setMax_data_point] = useState<
    {x: number; y: number}[]
  >([]);
  const [min_data_points, setMin_data_points] = useState<
    {x: number; y: number}[]
  >([]);
  const [reference_data_points, setReference_data_points] = useState<
    {x: number; y: number}[]
  >([]);
  const [getallcurvedata, setGetallcurvedata] = useState(false);

  function checkNumber(num: number) {
    if (num < -80) {
      return '';
    } else {
      return num;
    }
  }

  useEffect(() => {
    const Getmeasermentsalarms = async () => {
      try {
        const response = await $Get(
          `otdr/optical-route/${opticalrout_id}/test-setups/measurements/${measurement_id}/alarms`,
        );

        if (response?.status == 200 || response?.status == 201) {
          const resonsedata: alllalarmsType = await response.json();
          setAllalarms(resonsedata);
        }
      } catch (error) {}
    };

    Getmeasermentsalarms();
  }, []);
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

  const [autotick, setAutodic] = useState(true);

  useEffect(() => {
    // let data:any;
    setLoading(true);
    const getchartdata = async () => {
      try {
        const getdata = await $Get(
          `otdr/optical-route/${opticalrout_id}/test-setups/measurements/${measurement_id}`,
        );
        let datass = await getdata?.json();

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
              x: datass?.key_events.events[i]?.event_location,
              y: datass.key_events.events[i].event_y,
              type: 'arrowevent',
              location: 'start',
              event_number: datass.key_events.events[i].event_number,
            });
          } else if (datass.key_events.events[i].event_code == 'End of fiber') {
            Arrowevents.push({
              x: datass.key_events.events[i].event_location,
              y: datass.key_events.events[i].event_y,
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
                  zIndex: -1,
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
                x0: X,
                y0: Y + 10,
                x1: X,
                y1: Y - 10,

                editable: false,
                line: {
                  color: '#A80000',
                  width: 3,
                  zindex: 10,
                  // layer: 'below',
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y + 10,
                x1: X,
                y1: Y + 10,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 3,
                  zindex: 10,
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y - 10,
                x1: X,
                y1: Y - 10,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 3,
                  zindex: 10,
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y - 10,
                x1: X - 15,
                y1: Y - 11,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 1,
                  zindex: 10,
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y - 10,
                x1: X - 15,
                y1: Y - 9,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 1,
                  zindex: 10,
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y + 10,
                x1: X - 15,
                y1: Y + 9,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 1,
                  zindex: 10,
                },
              },
              {
                type: 'line',
                x0: X - 70,
                y0: Y + 10,
                x1: X - 15,
                y1: Y + 11,
                editable: false,
                line: {
                  color: '#A80000',
                  width: 1,
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
            Position: (Allevents[c].event_location / 1000)
              .toString()
              .substring(0, 7),
            Loss:
              Math.abs(
                Number(Allevents[c]?.event_loss?.toString().substring(0, 7)),
              ).toString() || '',
            Reflectance: checkNumber(
              Number(Allevents[c].event_reflectance.toString().substring(0, 7)),
            ).toString(),
            Peak: '',
            Attenuation: '',
            Cumulative: sumloss.toString().substring(0, 7),
            event_code: Allevents[c].event_code || undefined,

            // tabbodybg: [{name: "Position", onclick: ()=>alert("Position")}],
          });
          if (c < Allevents.length - 1) {
            sumloss += Allevents[c + 1]?.event_y - Allevents[c]?.event_y || 0;
            items.push({
              index: '',
              Position: (
                (Allevents[c + 1].event_location -
                  Allevents[c].event_location) /
                1000
              )
                .toString()
                .substring(0, 7),
              Loss:
                Math.abs(
                  Number(
                    (Allevents[c + 1]?.event_y - Allevents[c]?.event_y)
                      ?.toString()
                      .substring(0, 7),
                  ),
                ).toString() || '---',
              Reflectance: '',
              Peak: '',
              Attenuation: (
                (Allevents[c + 1]?.event_y - Allevents[c]?.event_y) /
                ((Allevents[c + 1].event_location -
                  Allevents[c].event_location) /
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

        // get optical route links and segment
        const getopticalroteRoute = async () => {
          const getopticalroteRouteResponse = await $Get(
            `otdr/optical-route/${opticalrout_id}/routes`,
          );
          const getopticalroteRoutedata =
            await getopticalroteRouteResponse?.json();

          const promises = getopticalroteRoutedata.map((data: any) =>
            $Get(`otdr/link/${data.link_id}`),
          );

          const alllinksdata = await Promise.all(promises);
          const results = await Promise.all(
            alllinksdata.map(response => response?.json()),
          );

          let allLinkdata: linklengthtype = [];
          let alloffset = 0;
          for (let i = 0; i < results.length; i++) {
            let sementsdata =
              results[i].current_version.type == 'cable'
                ? results[i]?.data?.cables
                : results[i]?.data?.ducts;

            // for(let j=0;j<sementsdata.length;j++){
            let data = [];
            for (let c = 0; c < sementsdata[0].segments.length; c++) {
              (alloffset += sementsdata[0].segments[c].offset),
                data.push({
                  Length: sementsdata[0].segments[c].length,
                  offset: sementsdata[0].segments[c].offset,
                  position:
                    sementsdata[0].segments[c].start +
                    sementsdata[0].segments[c].length +
                    sementsdata[0].segments[c].offset,
                });
            }

            // }
            allLinkdata.push({
              id: results[i].id,
              Length: results[i].current_version.length + alloffset,
              segments: data,
            });
          }
          setLinkslengthdata(allLinkdata);
        };
        getopticalroteRoute();
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
  const addarowevents = () => {
    let Arrowevents = [];
    for (let i = 0; i < chartdata?.key_events?.events?.length; i++) {
      if (chartdata?.key_events?.events[i]?.event_code == 'Start of fiber') {
        Arrowevents.push({
          x: chartdata?.key_events.events[i]?.event_location,
          y: chartdata.key_events.events[i].event_y,
          type: 'arrowevent',
          location: 'start',
          event_number: chartdata.key_events.events[i].event_number,
        });
      } else if (chartdata.key_events.events[i].event_code == 'End of fiber') {
        Arrowevents.push({
          x: chartdata.key_events.events[i].event_location,
          y: chartdata.key_events.events[i].event_y,
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

  const Events = () => {
    if (showevents) {
    } else {
      setfakeEvents([
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[0]?.event_location,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[0]?.event_y + index / 2 - 10,
          ),
          type: 'lines',
          text: [chartdata?.key_events?.events[0]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+text',
          line: {width: 6, zindex: 100, color: '#A80000'},
          event_number: chartdata?.key_events?.events[0]?.event_number,
          name: 'events',
          layer: 'above',
        },
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[1]?.event_location,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[1]?.event_y + index / 2 - 10,
          ),
          type: 'lines',
          text: [chartdata?.key_events?.events[1]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+text',
          line: {width: 6, zindex: 100, color: '#A80000'},
          event_number: chartdata?.key_events?.events[1]?.event_number,
          name: 'events',
          layer: 'above',
        },
        {
          x: [...Array(41).keys()].map(
            dataa => chartdata?.key_events?.events[2]?.event_location,
          ),
          y: [...Array(41).keys()].map(
            (dat, index) =>
              chartdata?.key_events?.events[2]?.event_y + index / 2 - 10,
          ),

          type: 'lines',
          text: [chartdata?.key_events?.events[2]?.event_number],
          textfont: {color: ['#A80000']},
          showlegend: false,
          textposition: 'bottom',
          mode: 'lines+text',
          line: {width: 6, zindex: 100, color: '#A80000'},
          name: 'events',
          event_number: chartdata?.key_events?.events[2]?.event_number,
          layer: 'above',
        },
      ]);
      setSelectedEvents(null);
      addarowevents();
      setShowEwents(true);
    }

    setLeftverticaltab('Events');
  };

  const Trace = () => {
    setLeftverticaltab('Trace');
    setShowEwents(false);
    addarowevents();
    setfakeEvents([]);
  };

  const Measure = () => {
    if (selectedevents != null) {
      if (fakeevents.length >= 3) {
        setLeftverticaltab('Measure');
      }
    }
  };

  const LinkView = () => {
    setLeftverticaltab('LinkView');
  };

  const showcurveline = async (name: string) => {
    const find3 = allchart.findIndex(data => data == name);
    if (find3 > -1) {
      const filtercurvs = allchart.filter(data => data != name);
      setAllchart(filtercurvs);
    } else {
      setAllchart(prev => [...prev, name]);
    }
    setAllshapes([])
    if (!getallcurvedata || name != "Cur") {
       
      try {
        setLoading(true);
        const allcurvresponse = await $Get(
          `otdr/optical-route/${opticalrout_id}/learning-measurements-chart-detail`,
        );

        if (allcurvresponse?.status == 200) {
          const allcurvresponsedata: allchartdataype =
            await allcurvresponse?.json();
          setAvg_data_points(
            allcurvresponsedata?.avg_data_points?.map(data => ({
              x: data[0],
              y: data[1],
            })) || [],
          );
          setMax_data_point(
            allcurvresponsedata?.max_data_points?.map(data => ({
              x: data[0],
              y: data[1],
            })) || [],
          );
          setMin_data_points(
            allcurvresponsedata?.min_data_points?.map(data => ({
              x: data[0],
              y: data[1],
            })) || [],
          );
          setReference_data_points(
            allcurvresponsedata?.reference_data_points?.map(data => ({
              x: data[0],
              y: data[1],
            })) || [],
          );
          setAllchartdata(allcurvresponsedata);
        }
      } catch (error) {
        console.log(`error is :${error}`);
      } finally {
        setLoading(false);
        setGetallcurvedata(true);
      }
    }
  };

  const movebigline = (name: string, direction: string) => {
    // console.log("fakeevents",fakeevents);

    const verticalLinesCopy = deepcopy(verticalLines);
    const findverticalindex = verticalLines.findIndex(
      data => data.name && data.name == name,
    );

    verticalLinesCopy[findverticalindex].x =
      direction == 'right'
        ? verticalLines[findverticalindex].x + 10
        : verticalLines[findverticalindex].x - 10;
    setVerticalLines(verticalLinesCopy);

    //   const fakeeventsCopy = deepcopy(fakeevents);
    // const findverticalindex = fakeevents.findIndex(
    //   data => data.text && data.text[0] == name,
    // );
    // console.log("findverticalindex",findverticalindex);
    // fakeeventsCopy[findverticalindex].x =
    //   direction == 'right'
    //     ? fakeevents[findverticalindex].x + 10
    //     : fakeevents[findverticalindex].x - 10;
    // setfakeEvents(fakeeventsCopy);
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
            layer: 'above',
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
            layer: 'above',
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
            layer: 'above',
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
            layer: 'above',
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
      });
    } else {
      setSelectedEvents({
        x: [...Array(41).keys()].map(dataa => e[`shapes[0].x0`]),
        y: [...Array(41).keys()].map(
          (dat, index) => e[`shapes[0].y0`] + index / 2,
        ),

        type: 'line',
        mode: 'lines+markers',
        line: {width: 6, zindex: 10, color: '#A80000'},
        marker: {color: '#A80000', zIndex: 10},
        event_number: chartdata?.key_events?.events[0]?.event_number,
      });
    }
  };

  const plotwidth = window.innerWidth - 510;
  const ratio = plotwidth / maxx;

  console.log("max_data_pointmax_data_point",max_data_point);
  
  //   *****************************************************************************************
  //   *****************************************************************************************
  //   *****************************************************************************************
  return (
    <>

      <IoClose
        onClick={onclose}
        size={30}
        className="fixed right-[30px] top-[20px] z-[2000000] cursor-pointer"
      />


      <div className="fixed right-[0px] top-0 z-[1000000] h-screen w-screen overflow-y-auto bg-white">
        <div className="relative box-border flex h-auto w-full flex-col p-[10px] pb-[200px] pt-[50px]">
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
                  <GoZoomIn size={30} className="mt-[20px] cursor-pointer" />
                  <GoZoomOut size={30} className="mt-[20px] cursor-pointer" />
                  <img
                    onClick={() => {
                      setFixedyaxies(true), setDragmode('zoom');
                    }}
                    src={ZoomArea}
                    className="mt-[20px] h-[30px] w-[30px] cursor-pointer"
                  />
                  <img
                    onClick={() => {}}
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
                  {loading ? (
                    <div className="absolute left-[50%] top-[130px] z-20">
                      <GeneralLoadingSpinner size="h-14 w-14" />
                    </div>
                  ) : null}

                  <Plot
                    ref={plotref}
                    onRelayout={e => moveshapes(e)}
                    className="h-[500px] w-full bg-[red] p-0"
                    onHover={e =>
                      setMousecoordinate({
                        x: Number(e.points[0].x),
                        y: Number(e.points[0].y),
                      })
                    }
                    onClick={e => onclickshap()}
                    data={[
                      {
                        showlegend: false,
                        x:allchart.indexOf('Cur') > -1 && allcurveline[0]?.data?.map(dat => dat.x),
                        y:allchart.indexOf('Cur') > -1 && allcurveline[0]?.data?.map(dat => dat.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {width: 2},
                        marker: {color: '#273746'},
                      },
                      {
                        showlegend: false,
                        x:
                          allchart.indexOf('Max') > -1 &&
                          max_data_point?.map(data => data.x),
                        y:
                          allchart.indexOf('Max') > -1 &&
                          max_data_point?.map(data => data.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {width: 2},
                        marker: {color: '#A93226'},
                      },

                      {
                        showlegend: false,
                        x:
                          allchart.indexOf('Min') > -1 &&
                          min_data_points?.map(data => data.x),
                        y:
                          allchart.indexOf('Min') > -1 &&
                          min_data_points?.map(data => data.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {width: 2},
                        marker: {color: '#2471A3'},
                      },
                      {
                        showlegend: false,
                        x:
                          allchart.indexOf('Ref') > -1 &&
                          reference_data_points?.map(data => data.x),
                        y:
                          allchart.indexOf('Ref') > -1 &&
                          reference_data_points?.map(data => data.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {width: 2},
                        marker: {color: '#229954'},
                      },
                      {
                        showlegend: false,
                        x:
                          allchart.indexOf('Avg') > -1 &&
                          avg_data_points?.map(data => data.x),
                        y:
                          allchart.indexOf('Avg') > -1 &&
                          avg_data_points?.map(data => data.y),
                        type: 'scatter',
                        mode: 'lines',
                        line: {width: 2},
                        marker: {color: '#D4AC0D'},
                      },
                      ...fakeevents,
                    ]}
                    config={{
                      displayModeBar: true,
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
                      shapes: allshapes,
                      yaxis: {
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
              <div className="flex flex-row">
                {linkslengthdata.map(segmentsdata => {
                  let linklength = Number(segmentsdata.Length) * 100;

                  return (
                    <div
                      style={{width: `${linklength}px`}}
                      className={`relative mt-[30px] flex h-[10px]  bg-[#18C047]`}>
                      {segmentsdata.segments.map(data => {
                        let position = data.position * 100;
                        return (
                          <div
                            style={{left: `${position}px`}}
                            className={`absolute left-[${data.position}px] top-[-5px] z-10 h-[20px] w-[5px] bg-[#C09B18]`}></div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
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
                    ].event_location / 1000
                  )
                    .toString()
                    .substring(0, 5)}
                  maxloss={chartdata?.key_events?.events.reduce(
                    (max: any, item: any) => {
                      return item.event_loss > max ? item.event_loss : max;
                    },
                    -Infinity,
                  )}
                  AverageSplice={
                    chartdata?.key_events?.events.reduce(
                      (sum: any, item: any) => sum + item.event_loss,
                      0,
                    ) / chartdata?.key_events?.events.length
                  }
                  AverageLoss={(
                    Number(chartdata?.key_events?.end_to_end_loss) /
                    (chartdata?.key_events?.events[
                      chartdata?.key_events.events?.length - 1
                    ].event_location /
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
                <Alarms data={allalarms} onclick={e => setReightbar(e)} />
              ) : (
                <Opticalroute
                  data={chartdata?.optical_route}
                  Wavelength={chartdata?.fxd_params?.actual_wavelength}
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
                          selectedevents != null &&
                          selectedevents.text[0] == 'a'
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
                          selectedevents != null &&
                          selectedevents.text[0] == 'A'
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
                          selectedevents != null &&
                          selectedevents.text[0] == 'B'
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
                          selectedevents != null &&
                          selectedevents.text[0] == 'b'
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
                    <div className=" flex h-full w-full flex-row justify-between rounded-[10px] bg-[#C6DFF8] ">
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
                onclicktitle={(tabname: string, sortalfabet: boolean) =>
                  () => {}}
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
                          <img
                            className="ml-[5px] h-[8px] w-[16px]"
                            src={Group}
                          />
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
      </div>

    </>
  );
}

export default ChartComponent;
