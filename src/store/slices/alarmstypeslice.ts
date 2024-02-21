import {createSlice} from '@reduxjs/toolkit';
import {deepcopy} from '~/util';

export type alarmtypedetailtype = {
  id: string;
  name: string;
  comment: string;
  owner_id: string;
  time_created: string;
  time_modified: string;
  alarm_definition?: {
    low_severity?: {
      conditions:
        | [
            {
              index: number;
              parameter: string;
              operator: string;
              coef: number;
              value: string;
              logical_operator: string;
            },
          ]
        | [];
      fault: string;
    };
    medium_severity?: {
      conditions:
        | [
            {
              index: number;
              parameter: string;
              operator: string;
              coef: number;
              value: string;
              logical_operator: string;
            },
          ]
        | [];
      fault: string;
    };
    high_severity?: {
      conditions:
        | [
            {
              index: number;
              parameter: string;
              operator: string;
              coef: number;
              value: string;
              logical_operator: string;
            },
          ]
        | [];
      fault: string;
    };
  };
  alarm_content: {
    primary_source: string;
    secondary_source: string;
    alarm_details: {
      date_and_time: string[];
      network: string[];
      rtu: string[];
      optical_route: string[];
      test_setup: string[];
      test_result: string[];
    };
  };
  alert_sending: {
    about: string;
    user: [string] | [];
  };
  automatic_events: {
    escalate_alarm: {
      severity_at_least: string;
      escalate_pending_after:{
            days: number;
            hours: number;
            minutes: number;
          };
      escalate_acknowledged_after:{
            days: number;
            hours: number;
            minutes: number;
          };
    };
    timeout_alarm: {
      timeout_pending_after:{
            days: number;
            hours: number;
            minutes: number;
          };
      timeout_acknowledged_after:{
            days: number;
            hours: number;
            minutes: number;
          };
    };
    delete_alarm: {
      delete_resolved_after:{
            days: number;
            hours: number;
            minutes: number;
          };
      delete_in_progress_after:{
            days: number;
            hours: number;
            minutes: number;
          };
      delete_timeout_after:{
            days: number;
            hours: number;
            minutes: number;
          };
    };
  };
  alarm_networks: {
    network_id_list: {id:string,name:string}[];
  };
};

export type alarmtypelist = {
  id: string;
  name: string;
}[];
export type initialStatetype = {
  alarmtypedetail: alarmtypedetailtype;
  alarmtypelist: alarmtypelist;
  selectedautomaticevents:string[]
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
        conditions: [],
        fault: 'No',
      },
      medium_severity: {
        conditions: [],
        fault: 'No',
      },
      high_severity: {
        conditions: [],
        fault: 'No',
      },
    },
    alarm_content: {
      primary_source: '',
      secondary_source: '',
      alarm_details: {
        date_and_time: [],
        network: [],
        rtu: [],
        optical_route: [],
        test_setup: [],
        test_result: [],
      },
    },
    alert_sending: {
      about: 'Pending',
      user: [],
    },
    automatic_events: {
      escalate_alarm: {
        severity_at_least: '',
        escalate_pending_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
        escalate_acknowledged_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
      },
      timeout_alarm: {
        timeout_pending_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
        timeout_acknowledged_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
      },
      delete_alarm: {
        delete_resolved_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
        delete_in_progress_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
        delete_timeout_after: {
          days: 0,
          hours: 0,
          minutes: 0,
        },
      },
   
    },
    alarm_networks: {
      network_id_list: [ ]
    }
  },
  alarmtypelist: [],
  selectedautomaticevents:[]
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

    cretealarmtype: (
      state,
      action: {type: string; payload: {id: string; name: string}},
    ) => {
      state.alarmtypelist.push({
        id: action.payload.id,
        name: action.payload.name,
      });
    },

    deletealarmtype: (state, action: {type: string; payload: string}) => {
      state.alarmtypelist = state.alarmtypelist.filter(
        data => data.id != action.payload,
      );
    },

    changeAutomaticEventDate: (
      state,
      action: {
        type: string;
        payload: {
          inputname: "days" | "hours" | "minutes",
          value: number;
          parentName: "escalate_alarm" | "timeout_alarm" | "delete_alarm",
          name: "delete_resolved_after" | "delete_in_progress_after" | "delete_timeout_after" | "timeout_pending_after" | "timeout_acknowledged_after" | "escalate_acknowledged_after" | "escalate_pending_after";
        };
      },
    ) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
      state.alarmtypedetail.automatic_events[action.payload.parentName][action.payload.name][action.payload.inputname] = action.payload.value;
    },


    setSelectedautomaticEvent:(state,action)=>{
      const findevents=state.selectedautomaticevents.findIndex(data => data == action.payload)
      if(findevents > -1){
        state.selectedautomaticevents=state.selectedautomaticevents.filter(data => data != action.payload)
      }else{
        state.selectedautomaticevents.push(action.payload)
      }
    },

    changeallSelectedautomaticEvent:(state,action)=>{

        state.selectedautomaticevents=action.payload
    
    },

    setAlarmNetworks:(state,
      action:{type:string,payload:{id:string,name:string}})=>{
      const findeventsindex=state.alarmtypedetail.alarm_networks.network_id_list.findIndex(data => data.id == action.payload.id)
      if(findeventsindex > -1){
        state.alarmtypedetail.alarm_networks.network_id_list.splice(findeventsindex,1)
      }else{

        state.alarmtypedetail.alarm_networks.network_id_list.push(action.payload)
      }
    }

  },
});

 
export const {setalarmsdetail, setalarmlist, cretealarmtype, deletealarmtype,changeAutomaticEventDate,setSelectedautomaticEvent,setAlarmNetworks,changeallSelectedautomaticEvent} =
  alarmtypeslice.actions;

export default alarmtypeslice.reducer;
