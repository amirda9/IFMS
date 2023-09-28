import {createSlice} from '@reduxjs/toolkit';

type veiwerlists={
    payload:string[];
    type: string;
}

const initialState = {
  type: 'Cable',
  networkviewers: [],
  regionviewers: [],
  stationviewers: [],
  linkviewers: [],
} as any;


const changetyperstate = createSlice({
  name: 'type',
  initialState,
  reducers: {
    settypestate: (state, action) => {
      state.type = action.payload;
    },
    setnetworkviewers: (state, action:veiwerlists) => {
      state.networkviewers = action.payload;
    },
    setregionviewers: (state, action:veiwerlists) => {
      state.regionviewers = action.payload;
    },
    setstationviewers: (state, action:veiwerlists) => {
      state.stationviewers = action.payload;
    },
    setlinkviewers: (state, action:veiwerlists) => {
      state.linkviewers = action.payload;
    },
  },
});

export const {
  settypestate,
  setnetworkviewers,
  setregionviewers,
  setstationviewers,
  setlinkviewers,
} = changetyperstate.actions;

export default changetyperstate.reducer;
