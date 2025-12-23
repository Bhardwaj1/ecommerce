import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import otpReducer from "./slices/otpSlice";
import meetingSlice from "./slices/meetingSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    otp: otpReducer,
    meeting:meetingSlice,
  },
  devTools: import.meta.env.DEV,
});
