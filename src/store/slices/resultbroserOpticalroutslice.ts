import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType'
import { deepcopy } from '~/util';
export type alldefaultstationsrtutype = {
  stationid: string;
  networkid: string;
  rtues: {name: string; id: string}[];
  deletertues: string[];
};
type veiwerlists = {
  payload: opticalrouteUpdateTestSetupDetailtype;
  type: string;
};
export type resultbrosernetworkopticaltype={networkid: string; opticalrouts: {name: string; id: string}[]}[]
type networkselectedlisttype={
  payload: string[];
  type: string;
}

type networkopticaltypeAction={
  payload:resultbrosernetworkopticaltype;
  type: string;
}
export  type alldeleteopticalroutetype={
  networkid: string; opticalrouts:string[];
}[]
export type alldefaultregionstationstype = {
  networkid: string;
  stations: {name: string; id: string}[];
};
export type defaultstationsrtutype = {
  payload: alldefaultstationsrtutype[];
  type: string;
};
type alldeleteopticalroutetypeAction={
  payload:alldeleteopticalroutetype;
  type: string;
}

type networkopticalroutetype={networkid: string; opticalrouts: {name: string; id: string}[]}


type initialStatetype={
  defaultregionstations: alldefaultregionstationstype[];
  opticalroutUpdateTestsetupDetail:opticalrouteUpdateTestSetupDetailtype
  resultnetworkselectedlist:string[]
  resultbrosernetworkoptical:networkopticalroutetype[]
  alldeleteopticalroute:alldeleteopticalroutetype
  opticalroutenetworkidadmin:string[]
  gettestsetupdetaildata:boolean,
  defaultstationsrtu: alldefaultstationsrtutype[];
  modalloading:boolean,
  openallopt:boolean
}
const initialState:initialStatetype = {
  opticalroutUpdateTestsetupDetail:{    name: "",
    station_id: "",
    station_name: "",
    init_rtu_id: "",
    init_rtu_name: "",
    startdatePart:"",
    starttimePart:"",
    enddatePart:"",
   endtimePart:"",
    parameters: {
      enabled: true,
      type: "monitoring",
      wavelength: "1625",
      break_strategy: "skip",
      date_save_policy: "save",
      test_mode: "fast",
      run_mode:"average",
      distance_mode: "manual",
      range: 3,
      pulse_width_mode: "manual",
      pulse_width: 3,
      sampling_mode: "duration",
      sampling_duration: 4,
      IOR:1.476,
      RBS: -79,
      event_loss_threshold: 0.05,
      event_reflection_threshold: -40,
      fiber_end_threshold: 5,
      total_loss_threshold: 5,
      section_loss_threshold: 5,
      injection_level_threshold: 5
    },
    learning_data: {
      targeted_count_per_cycle: 30,
      start_cycle_time: {
        type: "fixed",
        time: "",
        periodic_options: {
          value: 0,
          period_time: "secondly"
        }
      },
      increase_count_options: {
        count: 2,
        timing: {
          type: "fixed",
          time: "",
          periodic_options: {
            value: 0,
            period_time: "secondly"
          }
        },
        maximum_count: 60
      }
    },
    test_program: {
      starting_date: {
        start:"",
        immediately: false
      },
      end_date: {
        end:"",
        indefinite: true
      },
      period_time: {
        value: 0,
        period_time: "hourly"
      }
    }},
    defaultregionstations:[],
    defaultstationsrtu:[],
    resultnetworkselectedlist:[],
    resultbrosernetworkoptical:[],
    alldeleteopticalroute:[],
    opticalroutenetworkidadmin:[],
    gettestsetupdetaildata:false,
    modalloading:false,
    openallopt:false
};

export type defaultregionstationstype = {
  payload: {networkid: string; stations: {name: string; id: string}[]};
  type: string;
};

const resultbroserOpticalroutslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setopticalroutUpdateTestsetupDetail: (state, action: veiwerlists) => {
      state.opticalroutUpdateTestsetupDetail = action.payload;
    },
    setresultNetworkselectedlist: (state, action: networkselectedlisttype) => {
      state.resultnetworkselectedlist = action.payload;
    },
    setresultbrozernetworkoptical: (state, action: networkopticaltypeAction) => {
      state.resultbrosernetworkoptical = action.payload;
    },
    setAlldeleteopticalroute: (state, action: alldeleteopticalroutetypeAction) => {
      state.alldeleteopticalroute = action.payload;
    },
    setresultbroserOpticalrouteNetworkidadmin: (state, action: {type: string; payload: string}) => {
      const findinlist = state.opticalroutenetworkidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        state.opticalroutenetworkidadmin.push(action.payload);
      }
    },
    changeOpticalroutename: (state, action: {type: string; payload:{networkid:string,opticalId:string,opticalName:string}}) => {
      console.log("🚞",action.payload);
      
      const networkopticalCopy:networkopticalroutetype[]=deepcopy(state.resultbrosernetworkoptical)
      const findinlist = networkopticalCopy.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      console.log("🧑‍✈️",findinlist);
      
      const findoptical=networkopticalCopy[findinlist].opticalrouts.findIndex(data => data.id == action.payload.opticalId)
      console.log("7🧑‍✈️7",findinlist);
      networkopticalCopy[findinlist].opticalrouts[findoptical].name=action.payload.opticalName
 state.resultbrosernetworkoptical=networkopticalCopy
    },
    setgettestsetupdetaildata:(state, action: {type: string; payload: boolean}) => {
      state.gettestsetupdetaildata=action.payload
    },
    setmodalloading:(state, action: {type: string; payload: boolean}) => {
      state.modalloading=action.payload
    },
    setopenallopt:(state, action: {type: string; payload: boolean}) => {
      state.openallopt=action.payload
    },
    setdefaultRegionstations: (state, action: defaultregionstationstype) => {
      console.log('🧟', action.payload);

      const defaultregionStationsCopy = deepcopy(state.defaultregionstations);
      const finddataindex = state.defaultregionstations.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      if (finddataindex > -1) {
        console.log('ok');

        defaultregionStationsCopy[finddataindex].stations =
          action.payload.stations;
      } else {
        console.log('no');
        defaultregionStationsCopy.push(action.payload);
      }
      state.defaultregionstations = defaultregionStationsCopy;
    },
    setdefaultStationsrtu: (state, action: defaultstationsrtutype) => {
      state.defaultstationsrtu = action.payload;
    },
  },
});

export const {
  setopticalroutUpdateTestsetupDetail,
  setresultNetworkselectedlist,
  setresultbrozernetworkoptical,
  setAlldeleteopticalroute,
  setresultbroserOpticalrouteNetworkidadmin,
  changeOpticalroutename,
  setgettestsetupdetaildata,
  setmodalloading,
  setopenallopt,
  setdefaultStationsrtu,
  setdefaultRegionstations
} = resultbroserOpticalroutslice.actions;

export default resultbroserOpticalroutslice.reducer;
