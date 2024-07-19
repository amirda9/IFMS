import {createSlice} from '@reduxjs/toolkit';
import { FaStapler } from 'react-icons/fa6';
import {deepcopy} from '~/util';
export type alldataType={
 details: {
   source_name: string,
   severity: string,
   status: string,
   measurement_fk: string,
   rtu_fk: string,
   link_fk: string,
   network_id: string,
   region_id: string,
   alarm_type_list: string[],
   id_list: string[],
   acting_user: string,
   network_name: string,
   alarm_number: number,
   time_created: string,
   time_modified: string,
   region_name: string,
   link_name: string,
   station_name: string,
   cable: string,
   rtu_name: string,
   core: number,
   port: number,
   to_escalation: {
     days: number,
     hours: number,
     minutes: number
   },
   to_time_out: {
     days: number,
     hours: number,
     minutes: number
   }
 },
 alarms: [
   {
     id: string,
     secondary_source: string,
     severity: string,
     status: string,
     region_name: string,
     region_admin: string,
     station_name: string,
     to_escalation: {
       days: number,
       hours: number,
       minutes: number
     },
     to_time_out: {
       days: number,
       hours: number,
       minutes: number
     },
     contributing_conditions: [
      {
        parameter:string,
        operator:string,
        fault:string,
        coef:number,
        value:string
      }
     ]
   }
 ]
}

export type initialStatetype = {
  allalarmdata:alldataType | undefined
};

const initialState: initialStatetype = {
 allalarmdata:undefined
};

// ********** slices ********* slices ******************* slice *********
const alarmsslice = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setAllalarmdata:(state, action:{type:string,payload:alldataType}) => {
      state.allalarmdata = action.payload;
    },
 

  },
});

export const {
 setAllalarmdata,
} = alarmsslice.actions;

export default alarmsslice.reducer;