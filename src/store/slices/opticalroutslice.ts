import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType'
import { deepcopy } from '~/util';

type veiwerlists = {
  payload: opticalrouteUpdateTestSetupDetailtype;
  type: string;
};
export type networkopticaltype={networkid: string; opticalrouts: {name: string; id: string}[]}[]
type networkselectedlisttype={
  payload: string[];
  type: string;
}

type networkopticaltypeAction={
  payload:networkopticaltype;
  type: string;
}
export  type alldeleteopticalroutetype={
  networkid: string; opticalrouts:string[];
}[]


type alldeleteopticalroutetypeAction={
  payload:alldeleteopticalroutetype;
  type: string;
}

type networkopticalroutetype={networkid: string; opticalrouts: {name: string; id: string}[]}


type initialStatetype={
  opticalroutUpdateTestsetupDetail:opticalrouteUpdateTestSetupDetailtype
  networkselectedlist:string[]
  networkoptical:networkopticalroutetype[]
  alldeleteopticalroute:alldeleteopticalroutetype
  opticalroutenetworkidadmin:string[]
  gettestsetupdetaildata:boolean,
  modalloading:boolean,
  openall:boolean
}
const initialState:initialStatetype = {
  opticalroutUpdateTestsetupDetail:{    name: "",
    station_id: "",
    station_name: "",
    init_rtu_id: "",
    init_rtu_name: "",
    startdatePart:"2023-11-28",
    starttimePart:"22:26:03",
    enddatePart:"2023-11-28",
   endtimePart:"22:26:02",
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
        time: "2023-11-28 22:26:03",
        periodic_options: {
          value: 1,
          period_time: "monthly"
        }
      },
      increase_count_options: {
        count: 2,
        timing: {
          type: "fixed",
          time: "2023-11-28 22:26:03",
          periodic_options: {
            value: 1,
            period_time: "monthly"
          }
        },
        maximum_count: 60
      }
    },
    test_program: {
      starting_date: {
        start:"2023-11-28 22:26:03",
        immediately: false
      },
      end_date: {
        end:"2023-11-28 22:26:02",
        indefinite: true
      },
      period_time: {
        value: 1,
        period_time: "monthly"
      }
    }},
    networkselectedlist:[],
    networkoptical:[],
    alldeleteopticalroute:[],
    opticalroutenetworkidadmin:[],
    gettestsetupdetaildata:false,
    modalloading:false,
    openall:false
};

const opticalroute = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setopticalroutUpdateTestsetupDetail: (state, action: veiwerlists) => {
      state.opticalroutUpdateTestsetupDetail = action.payload;
    },
    setNetworkselectedlist: (state, action: networkselectedlisttype) => {
      state.networkselectedlist = action.payload;
    },
    setNetworkoptical: (state, action: networkopticaltypeAction) => {
      state.networkoptical = action.payload;
    },
    setAlldeleteopticalroute: (state, action: alldeleteopticalroutetypeAction) => {
      state.alldeleteopticalroute = action.payload;
    },
    setOpticalrouteNetworkidadmin: (state, action: {type: string; payload: string}) => {
      const findinlist = state.opticalroutenetworkidadmin.findIndex(
        data => data == action.payload,
      );
      if (findinlist < 0) {
        state.opticalroutenetworkidadmin.push(action.payload);
      }
    },
    changeOpticalroutename: (state, action: {type: string; payload:{networkid:string,opticalId:string,opticalName:string}}) => {
      console.log("🚞",action.payload);
      
      const networkopticalCopy:networkopticalroutetype[]=deepcopy(state.networkoptical)
      const findinlist = networkopticalCopy.findIndex(
        data => data.networkid == action.payload.networkid,
      );
      console.log("🧑‍✈️",findinlist);
      
      const findoptical=networkopticalCopy[findinlist].opticalrouts.findIndex(data => data.id == action.payload.opticalId)
      console.log("7🧑‍✈️7",findinlist);
      networkopticalCopy[findinlist].opticalrouts[findoptical].name=action.payload.opticalName
 state.networkoptical=networkopticalCopy
    },
    setgettestsetupdetaildata:(state, action: {type: string; payload: boolean}) => {
      state.gettestsetupdetaildata=action.payload
    },
    setmodalloading:(state, action: {type: string; payload: boolean}) => {
      state.modalloading=action.payload
    },
    setopenall:(state, action: {type: string; payload: boolean}) => {
      state.openall=action.payload
    }
  },
});

export const {
  setopticalroutUpdateTestsetupDetail,
  setNetworkselectedlist,
  setNetworkoptical,
  setAlldeleteopticalroute,
  setOpticalrouteNetworkidadmin,
  changeOpticalroutename,
  setgettestsetupdetaildata,
  setmodalloading,
  setopenall
} = opticalroute.actions;

export default opticalroute.reducer;
