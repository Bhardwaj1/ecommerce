import api from "./api";

/**
 * Meetings API Service (Domain Layer)
 * - Keep only API calling logic here
 * - No Redux/UI logic
 * - All functions return `res.data` for consistent consumer behavior
 */

export const meetingService = {
  /**
   * Create a meeting (instant or scheduled)
   * @param {Object} payload
   * @param {"INSTANT"|"SCHEDULED"} payload.type
   * @param {string=} payload.title
   * @param {string=} payload.startsAt (ISO string, for scheduled)
   */
  create: async (payload = { type: "INSTANT" }) => {
    const res = await api.post("/meeting/create-meeting", payload);
    return res.data;
  },

  /**
   * Join meeting
   * @param {Object} payload
   * @param {string} payload.meetingId
   * @param {string=} payload.displayName
   */
  join: async ({ meetingId }) => {
    const res = await api.post("/meeting/join-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * Leave meeting
   * @param {Object} payload
   * @param {string} payload.meetingId
   */
  leave: async ({ meetingId }) => {
    const res = await api.post("/meeting/leave-meeting", {
      meetingId,
    });
    return res.data;
  },

  /**
   * End meeting (host-only usually)
   * @param {Object} payload
   * @param {string} payload.meetingId
   */
  end: async ({ meetingId }) => {
    const res = await api.post(`/meeting/${meetingId}/end-meeting`);
    return res.data;
  },

  /**
   * Get meeting details
   * @param {string} meetingId
   */
  getDetails: async (meetingId) => {
    const res = await api.get(`/meeting/${meetingId}`);
    return res.data;
  },

  /**
   * List my meetings (optional)
   * @param {Object=} params
   */
  list: async (params = {}) => {
    const res = await api.get("/meeting", { params });
    return res.data;
  },
};
