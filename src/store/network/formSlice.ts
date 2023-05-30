import { createSlice } from "@reduxjs/toolkit";

const formSlice = createSlice({
  name: "networkForm",
  initialState: {
    newProject:{},
    
  },
  reducers: {
    updateNetwork: (state, action) => {
      state.newProject = { ...state.newProject, ...action.payload };
    },
  },
});

export const networkFormDetail = formSlice.actions;

export default formSlice.reducer;
