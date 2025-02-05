import {createSlice} from '@reduxjs/toolkit';
import {FaStapler} from 'react-icons/fa6';
import {deepcopy} from '~/util';
import {alldataType,modalvalue} from '~/types/alarm'
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
