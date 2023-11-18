import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType'
import { object, string } from 'yup';
type veiwerlists = {
  payload: opticalrouteUpdateTestSetupDetailtype | {};
  type: string;
};

type networkselectedlisttype={
  payload: string[];
  type: string;
}

type networkopticaltype={
  payload: {networkid: string; opticalrouts: {name: string; id: string}[]}[];
  type: string;
}
type alldeleteopticalroutetype={
  payload:{networkid: string; opticalrouts: {id: string}[]};
  type: string;
}

type allcheckednetworktype={
  payload:string[];
  type: string;
}
const initialState = {
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
          period_time: "day"
        }
      },
      increase_count_options: {
        count: 2,
        timing: {
          type: "fixed",
          time: "",
          periodic_options: {
            value: 0,
            period_time: "day"
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
        period_time: "day"
      }
    }},
    networkselectedlist:[],
    networkoptical:[],
    alldeleteopticalroute:[],
    allcheckednetwork:[],
} as any;

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
    setNetworkoptical: (state, action: networkopticaltype) => {
      state.networkoptical = action.payload;
    },
    setAlldeleteopticalroute: (state, action: alldeleteopticalroutetype) => {
      state.alldeleteopticalroute = action.payload;
    },
    setAllcheckednetwork: (state, action: allcheckednetworktype) => {
      state.allcheckednetwork = action.payload;
    },
  },
});

export const {
  setopticalroutUpdateTestsetupDetail,
  setNetworkselectedlist,
  setNetworkoptical,
  setAlldeleteopticalroute,
  setAllcheckednetwork
} = opticalroute.actions;

export default opticalroute.reducer;
