import {createSlice} from '@reduxjs/toolkit';
import { deepcopy } from '~/util';

export type alarmtypedetailtype = {
  id: string;
  name: string;
  comment: string;
  owner_id: string;
  time_created: string;
  time_modified: string;
  alarm_definition?: {
    low_severity?: {
      conditions: [
        {
          index: number;
          parameter: string;
          operator: string;
          coef: number;
          value: string;
          logical_operator: string;
        },
      ] | [];
      fault: string;
    };
    medium_severity?: {
      conditions: [
        {
          index: number;
          parameter: string;
          operator: string;
          coef: number;
          value: string;
          logical_operator: string;
        },
      ] | [];
      fault: string;
    };
    high_severity?: {
      conditions: [
        {
          index: number;
          parameter: string;
          operator: string;
          coef: number;
          value: string;
          logical_operator: string;
        },
      ] | [];
      fault: string;
    };
  };
  alarm_content: {
    primary_source: string;
    secondary_source: string;
    alarm_details: {
      date_and_time: string[];
      network: string[];
      rtu:string[];
      optical_route: string[];
      test_setup: string[];
      test_result: string[];
    };
  };
  alert_sending?: {
    about: string;
    user: [string];
  };
  automatic_events?: {
    escalate_alarm: {
      severity_at_least: string;
      escalate_pending_after: {
        days: number;
        hours: number;
        minutes: number;
      };
      escalate_acknowledged_after: {
        days: number;
        hours: number;
        minutes: number;
      };
    };
    timeout_alarm: {
      timeout_pending_after: {
        days: number;
        hours: number;
        minutes: number;
      };
      timeout_acknowledged_after: {
        days: number;
        hours: number;
        minutes: number;
      };
    };
    delete_alarm: {
      delete_resolved_after: {
        days: number;
        hours: number;
        minutes: number;
      };
      delete_in_progress_after: {
        days: number;
        hours: number;
        minutes: number;
      };
      delete_timeout_after: {
        days: number;
        hours: number;
        minutes: number;
      };
    };
  };
  alarm_networks?: {
    network_id_list: [string];
  };
};

export type alarmtypelist = {
  id: string;
  name: string;
}[];
export type initialStatetype = {
  alarmtypedetail: alarmtypedetailtype;
  alarmtypelist: alarmtypelist;
};

const initialState: initialStatetype = {
  alarmtypedetail: {
    id: '',
    name: '',
    comment: '',
    owner_id: '',
    time_created: '',
    time_modified: '',
    alarm_definition: {
      low_severity: {
        conditions: [
        
        ],
        fault: "No"
      },
      medium_severity: {
        conditions: [
       
        ],
        fault: "No"
      },
      high_severity: {
        conditions: [
      
        ],
        fault: "No",
      },
    },
    alarm_content: {
      primary_source: "",
      secondary_source: "",
      alarm_details: {
        date_and_time:[],
        network: [],
        rtu: [],
        optical_route: [],
        test_setup: [],
        test_result: [],
      }
    }
  },
  alarmtypelist: [],
};

// ********** slices ********* slices ******************* slice *********
const alarmtypeslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setalarmsdetail: (state, action) => {
      state.alarmtypedetail = action.payload;
    },
    setalarmlist: (state, action) => {
      state.alarmtypelist = action.payload;
    },

    cretealarmtype: (state, action:{type:string,payload:{id:string,name:string}}) => {
      state.alarmtypelist.push({id:action.payload.id,name:action.payload.name})
    },

    deletealarmtype:(state,action:{type:string,payload:string})=>{
      state.alarmtypelist= state.alarmtypelist.filter(data => data.id != action.payload)
    }
  },
});

export const {setalarmsdetail, setalarmlist,cretealarmtype,deletealarmtype} = alarmtypeslice.actions;

export default alarmtypeslice.reducer;
