import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  type: "Cable",
  networkviewers:[],
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
  },
});

export const {settypestate,setnetworkviewers} = changetyperstate.actions;

export default changetyperstate.reducer;