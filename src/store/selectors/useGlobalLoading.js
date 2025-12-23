import { useSelector } from "react-redux";

export const useGlobalLoading = () => {
  return useSelector((state) => {
    return (
      state.auth.loading || state.meeting.loading
      // add more slices here later
    );
  });
};
