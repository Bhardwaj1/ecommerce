import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { verifyOtp, resendOtp } from "../../services/authService";
import { OTP_MAX_ATTEMPTS, OTP_LOCK_TIME } from "../../constants/security";

export const verifyOTP = createAsyncThunk(
  "otp/verify",
  async (payload, { rejectWithValue }) => {
    try {
      return await verifyOtp(payload);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const resendOTP = createAsyncThunk(
  "otp/resend",
  async (email, { rejectWithValue }) => {
    try {
      return await resendOtp(email);
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const otpSlice = createSlice({
  name: "otp",
  initialState: {
    loading: false,
    success: false,
    error: null,
    attempts: 0,
    lockedUntil: null,
  },
  reducers: {
    incrementAttempt: (state) => {
      state.attempts += 1;
    },
    lockOtp: (state) => {
      state.lockedUntil = Date.now() + OTP_LOCK_TIME * 1000;
    },
    resetAttempts: (state) => {
      state.attempts = 0;
      state.lockedUntil = null;
    },
    resetOtpState: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(verifyOTP.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(resendOTP.pending, (state) => {
        state.loading = true;
      })
      .addCase(resendOTP.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resendOTP.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { incrementAttempt, lockOtp, resetAttempts, resetOtpState } =
  otpSlice.actions;
export default otpSlice.reducer;
