import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {UserAccessSliceType} from '~/types';

const initialState: UserAccessSliceType = {
  isEditingUserAccess: false,
};

const userAccessSlice = createSlice({
  name: 'userAccess',
  initialState,
  reducers: {
    setIsEditingUserAccess: (state, action: PayloadAction<boolean>) => {
      state.isEditingUserAccess = action.payload;
    },
  },
});

export const userAccessActions = userAccessSlice.actions;
export const userAccessReducer = userAccessSlice.reducer;
