import {PayloadAction, createSlice} from '@reduxjs/toolkit';
import {UserGroupsSliceType} from '~/types';

const initialState: UserGroupsSliceType = {
  isEditingGroupMembers: false,
};

const userGroupsSlice = createSlice({
  name: 'userGroups',
  initialState,
  reducers: {
    setIsEditingGroupMembers: (state, action: PayloadAction<boolean>) => {
      state.isEditingGroupMembers = action.payload;
    },
  },
});

export const userGroupsActions = userGroupsSlice.actions;
export const userGroupsReducer = userGroupsSlice.reducer;
