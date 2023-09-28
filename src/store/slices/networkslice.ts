import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  type: "Cable",
  networkviewers:[],
  regionviewers:[],
  stationviewers:[],
  linkviewers:[],
} as any;

const changetyperstate = createSlice({
  name: "type",

  initialState,
  reducers: {
   settypestate: (state, action) => {
      state.type = action.payload;
    },
    setnetworkviewers: (state, action) => {
      state.networkviewers = action.payload;
    },
    setregionviewers: (state, action) => {
      state.regionviewers = action.payload;
    },

  setstationviewers: (state, action) => {
    state.stationviewers = action.payload;
  },
  setlinkviewers: (state, action) => {
    state.linkviewers = action.payload;
  },
}
});

export const {settypestate,setnetworkviewers,setregionviewers,setstationviewers,setlinkviewers} = changetyperstate.actions;

export default changetyperstate.reducer;