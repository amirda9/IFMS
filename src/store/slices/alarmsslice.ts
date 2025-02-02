import {createSlice} from '@reduxjs/toolkit';
import {FaStapler} from 'react-icons/fa6';
import {deepcopy} from '~/util';
export type alldataType = {
  
  details: {
    source_name: string,
    severity: string,
    status: string,
    measurement_fk: string,
    rtu_fk: string,
    link_fk: string,
    route_fk: string,
    network_id: string,
    region_id: string,
    alarm_type:string ,
    id_list: string[],
    acting_user: string,
    network_name: string,
    alarm_number: 1,
    time_created:string,
    time_modified: string,
    to_escalation: {
      days: number,
      hours: number,
      minutes: number
    },
    to_timeout: {
      days: number,
      hours: number,
      minutes: number
    },
    region_name: string,
    link_name: string,
    station_name: string,
    cable: string,
    rtu_name: string,
    core: number,
    port: number
  };
  alarms: [
    {
      id: string,
      alarm_type: string,
      measurement_id: string,
      optical_route_id: string,
      test_setup_id: string,
      latitude: 0,
      longitude: 0,
      secondary_source: string,
      severity: string,
      status: string,
      region_name: string,
      region_admin: string,
      station_name: string,
      to_escalation: {
        days: 0,
        hours: 0,
        minutes: 0
      },
      to_timeout: {
        days: 0,
        hours: 0,
        minutes: 0
      },
      time_modified: string,
      time_created: string,
      contributing_conditions: []
    }
  ];
  total_pages:number,
  total_count: number
};

export type modalvalue = {
  contributing_conditions: {
    coef: number;
    parameter: string;
    operator:string;

    value: string;
    reference_value: number;
    measured_value: number;
  }[];

  id: string;

  region_admin: string;

  region_name: string;

  secondary_source: string;

  severity: string;

  station_name: string;

  status: string;

  time_created: string;

  time_modified: string;

  to_escalation: {
    days: number;
    hours: number;
    minutes: number;
  };
  to_timeout: {
    days: number;
    hours: number;
    minutes: number;
  };
};
export type initialStatetype = {
  allalarmdata: alldataType | undefined;
  alarmstatus: boolean;
  showparameters: boolean;
  alarmmodaldata: modalvalue | null;
};

const initialState: initialStatetype = {
  allalarmdata: undefined,
  alarmstatus: false,
  showparameters: false,
  alarmmodaldata: null,
};

// ********** slices ********* slices ******************* slice *********
const alarmsslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setAllalarmdata: (state, action: {type: string; payload: alldataType}) => {
      state.allalarmdata = action.payload;
    },

    changestate: (
      state,
      action: {type: string; payload: {id: string; value: string}},
    ) => {
      const allalarmdataCopy = deepcopy(state.allalarmdata);
      const finddataindex = state.allalarmdata?.alarms.findIndex(
        data => data.id == action.payload.id,
      );
      // state.allalarmdata = action.payload;
      allalarmdataCopy!.alarms[finddataindex!].status = action.payload.value;
      state.allalarmdata = allalarmdataCopy;
    },

    changealarmstatus: (state, action: {type: string; payload: boolean}) => {
      state.alarmstatus = action.payload;
    },

    setShowParameters: (state, action: {type: string; payload: boolean}) => {
      state.showparameters = action.payload;
    },

    setAlarmmodaldata: (
      state,
      action: {type: string; payload: modalvalue | null},
    ) => {
      state.alarmmodaldata = action.payload;
    },
    setalarmsdataStatus: (
      state,
      action: {type: string; payload: boolean},
    ) => {},
  },
});

export const {
  setAllalarmdata,
  changestate,
  changealarmstatus,
  setShowParameters,
  setAlarmmodaldata,
} = alarmsslice.actions;

export default alarmsslice.reducer;
