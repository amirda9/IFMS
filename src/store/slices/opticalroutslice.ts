import {createSlice} from '@reduxjs/toolkit';
import {opticalrouteUpdateTestSetupDetailtype} from './../../types/opticalrouteType'
import { object } from 'yup';
type veiwerlists = {
  payload: opticalrouteUpdateTestSetupDetailtype | {};
  type: string;
};


const initialState = {
  opticalroutUpdateTestsetupDetail:{}
  
} as any;

const opticalroute = createSlice({
  name: 'type',
  initialState,
  reducers: {
    setopticalroutUpdateTestsetupDetail: (state, action: veiwerlists) => {
      state.opticalroutUpdateTestsetupDetail = action.payload;
    },
  },
});

export const {
  setopticalroutUpdateTestsetupDetail
} = opticalroute.actions;

export default opticalroute.reducer;
