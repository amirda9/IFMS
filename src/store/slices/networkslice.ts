import {createSlice} from '@reduxjs/toolkit';

type veiwerlists = {
  payload: string[];
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
  type: 'Cable',
  networkviewers: [],
  networkviewersstatus:false,
  regionviewers: [],
  stationviewers: [],
  linkviewers: [],
  newregionstationlist:[],
  newregionlinklist:[],
} as any;

const changetyperstate = createSlice({
  name: 'type',
  initialState,
  reducers: {
    settypestate: (state, action) => {
      state.type = action.payload;
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
    setstationviewers: (state, action: veiwerlists) => {
      state.stationviewers = action.payload;
    },
    setlinkviewers: (state, action: veiwerlists) => {
      state.linkviewers = action.payload;
    },
    setnewregionstationlist: (state, action: veiwerlists) => {
      state.newregionstationlist = action.payload;
    },
    setnewregionlinklist: (state, action: veiwerlists) => {
      state.newregionlinklist = action.payload;
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
  setnetworkviewersstatus
} = changetyperstate.actions;

export default changetyperstate.reducer;
