import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { meetingService } from "../../services/meetingService";

/**
 * NOTE:
 * We are assuming backend response shape like:
 * { success: true, data: {...}, message?: "" }
 * If your backend differs, we only update the mapping in fulfilled reducers.
 */

export const createMeeting = createAsyncThunk(
  "meeting/create",
  async (payload, { rejectWithValue }) => {
    try {
      return await meetingService.create(payload);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const joinMeeting = createAsyncThunk(
  "meeting/join",
  async ({ meetingId, displayName }, { rejectWithValue }) => {
    try {
      return await meetingService.join({ meetingId, displayName });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const leaveMeeting = createAsyncThunk(
  "meeting/leave",
  async ({ meetingId }, { rejectWithValue }) => {
    try {
      return await meetingService.leave({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const endMeeting = createAsyncThunk(
  "meeting/end",
  async ({ meetingId }, { rejectWithValue }) => {
    try {
      return await meetingService.end({ meetingId });
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const fetchMeetingDetails = createAsyncThunk(
  "meeting/details",
  async (meetingId, { rejectWithValue }) => {
    try {
      return await meetingService.getDetails(meetingId);
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const meetingSlice = createSlice({
  name: "meeting",
  initialState: {
    loading: false,
    error: null,

    // Current meeting context
    currentMeeting: null, // { meetingId, hostId, participants, ... }
    meetingId: null, // quick access for routing
  },
  reducers: {
    resetMeetingError: (state) => {
      state.error = null;
    },
    clearCurrentMeeting: (state) => {
      state.currentMeeting = null;
      state.meetingId = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMeeting.fulfilled, (state, action) => {
        state.loading = false;
        state.meetingId = action.payload?.meetingId || null;
        state.currentMeeting = action.payload?.data || null;
      })
      .addCase(createMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // JOIN
      .addCase(joinMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(joinMeeting.fulfilled, (state, action) => {
        state.loading = false;

        state.meetingId = action.payload.meetingId;
        state.currentMeeting = {
          meetingId: action.payload.meetingId,
        };
      })
      .addCase(joinMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // LEAVE
      .addCase(leaveMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(leaveMeeting.fulfilled, (state) => {
        state.loading = false;
        // On leave we typically clear meeting context locally
        state.currentMeeting = null;
        state.meetingId = null;
      })
      .addCase(leaveMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // END
      .addCase(endMeeting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(endMeeting.fulfilled, (state) => {
        state.loading = false;
        state.currentMeeting = null;
        state.meetingId = null;
      })
      .addCase(endMeeting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // DETAILS
      .addCase(fetchMeetingDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMeetingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMeeting = action.payload?.data || null;
        state.meetingId = action.payload?.data?.meetingId || state.meetingId;
      })
      .addCase(fetchMeetingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMeetingError, clearCurrentMeeting } = meetingSlice.actions;
export default meetingSlice.reducer;
