import {createSlice} from '@reduxjs/toolkit';

type veiwerlists = {
  payload: string[];
  type: string;
};
type staionveiwerlists = {
  payload: {id: string; name: string; latitude: string; longitude: string}[];
  type: string;
};
type linkveiwerlists = {
  payload: {id: string; name: string; source: string; destination: string}[];
  type: string;
};
type veiwerlistsstatus = {
  payload: boolean;
  type: string;
};
type linkpoints = {
  payload: {latitude: number; longitude: number}[];
  type: string;
};
const initialState = {
  type: [],
  networkviewers: [],
  networkviewersstatus: false,
  regionviewers: [],
  regionviewersstatus: false,
  stationviewers: [],
  stationviewersstatus: false,
  linkviewers: [],
  linkviewersstatus: false,
  newregionstationlist: [],
  newregionstationliststatus: false,
  newregionlinklist: [],
  newregionlinkliststatus: false,
} as any;

const changetyperstate = createSlice({
  name: 'type',
  initialState,
  reducers: {
    settypestate: (state, action) => {
      const finddataindex = state.type.findIndex(
        (data: any) => data.id == action.payload.id,
      );
      if (finddataindex > -1) {
        const newdata = [...state.type];
        newdata[finddataindex]=action.payload;
        state.type = newdata;
      } else {
        state.type = [...state.type, action.payload];
      }
    },
    setnetworkviewers: (state, action: veiwerlists) => {
      state.networkviewers = action.payload;
    },
    setnetworkviewersstatus: (state, action: veiwerlistsstatus) => {
      state.networkviewersstatus = action.payload;
    },
    setregionviewers: (state, action: veiwerlists) => {
      state.regionviewers = action.payload;
    },
    setregionviewersstatus: (state, action: veiwerlistsstatus) => {
      state.regionviewersstatus = action.payload;
    },
    setstationviewers: (state, action: veiwerlists) => {
      state.stationviewers = action.payload;
    },
    setstationviewersstatus: (state, action: veiwerlistsstatus) => {
      state.stationviewersstatus = action.payload;
    },
    setlinkviewers: (state, action: veiwerlists) => {
      state.linkviewers = action.payload;
    },
    setlinkviewersstatus: (state, action: veiwerlistsstatus) => {
      state.linkviewersstatus = action.payload;
    },
    setnewregionstationlist: (state, action: staionveiwerlists) => {
      state.newregionstationlist = action.payload;
    },
    setnewregionstationliststatus: (state, action: veiwerlistsstatus) => {
      state.newregionstationliststatus = action.payload;
    },
    setnewregionlinklist: (state, action: linkveiwerlists) => {
      state.newregionlinklist = action.payload;
    },
    setnewregionlinkliststatus: (state, action: veiwerlistsstatus) => {
      state.newregionlinkliststatus = action.payload;
    },
  },
});

export const {
  settypestate,
  setnetworkviewers,
  setregionviewers,
  setstationviewers,
  setlinkviewers,
  setnewregionstationlist,
  setnewregionlinklist,
  setnetworkviewersstatus,
  setstationviewersstatus,
  setlinkviewersstatus,
  setregionviewersstatus,
  setnewregionstationliststatus,
  setnewregionlinkliststatus,
} = changetyperstate.actions;

export default changetyperstate.reducer;
