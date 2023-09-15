import { createSlice} from "@reduxjs/toolkit";

const initialState = {
  type: "Cable",
} as any;

const changetyperstate = createSlice({
  name: "type",
  initialState,
  reducers: {
   settypestate: (state, action) => {
      state.type = action.payload;
    },

  },
});

export const {settypestate } = changetyperstate.actions;

export default changetyperstate.reducer;