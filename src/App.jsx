import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useGlobalLoading } from "./store/selectors/useGlobalLoading";
import Loader from "./components/common/Loader";
import { useEffect } from "react";
import { connectSocket } from "./socket/socketEvents";

export default function App() {
  const isLoading = useGlobalLoading();

  useEffect(() => {
    connectSocket(); // 🔌 connect ONCE
  }, []);

  return (
    <BrowserRouter>
      {isLoading && <Loader fullScreen />}
      <AppRoutes />
      <Toaster position="top-center" richColors closeButton={false} />
    </BrowserRouter>
  );
}
