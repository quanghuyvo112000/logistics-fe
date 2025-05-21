import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import Sidebar from "./components/layout/Sidebar";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Authentication from "./pages/Authentication";
import Calendar from "./pages/Calendar";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Warehouses from "./pages/Warehouses";
import History from "./pages/History";

const drawerWidth = 240;

function AppLayout() {
  const location = useLocation();
  const isNoLayoutRoute = ["/", "/authentication"].includes(location.pathname);

  return (
    <>
      <CssBaseline />
      {!isNoLayoutRoute && <Header />}
      {!isNoLayoutRoute && <Sidebar drawerWidth={drawerWidth} />}
      {!isNoLayoutRoute ? (
        <MainContent drawerWidth={drawerWidth}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </MainContent>
      ) : (
        <Routes>
          <Route path="/" element={<History />} />
          <Route path="/authentication" element={<Authentication />} />
        </Routes>
      )}
      {!isNoLayoutRoute && <Footer drawerWidth={drawerWidth} />}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <SnackbarProvider>
        <AppLayout />
      </SnackbarProvider>
    </BrowserRouter>
  );
}

export default App;
