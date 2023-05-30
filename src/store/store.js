import { configureStore } from '@reduxjs/toolkit'
import authReducer from './auth/authSlice'
import formSlice from "./network/formSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    networForm: formSlice,
  },

})

export default store