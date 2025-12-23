import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import { Toaster } from "sonner";
import { useGlobalLoading } from "./store/selectors/useGlobalLoading";
import Loader from "./components/common/Loader";


export default function App() {
  const isLoading = useGlobalLoading();

  return (
    <BrowserRouter>
      {/* 🔄 Global Fullscreen Loader */}
      {isLoading && <Loader fullScreen />}

      {/* Routes */}
      <AppRoutes />

      {/* Notifications */}
      <Toaster
        position="top-center"
        richColors
        closeButton={false}
      />
    </BrowserRouter>
  );
}
