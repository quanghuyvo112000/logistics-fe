import { CssBaseline } from "@mui/material";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import Footer from "./components/layout/Footer";
import Header from "./components/layout/Header";
import MainContent from "./components/layout/MainContent";
import Sidebar from "./components/layout/Sidebar";
import { SnackbarProvider } from "./contexts/SnackbarContext";
import Authentication from "./pages/Authentication";
import Dashboard from "./pages/Dashboard";
import Drivers from "./pages/Drivers";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Shipments from "./pages/Shipments";
import Warehouses from "./pages/Warehouses";

const drawerWidth = 240;

function AppLayout() {
  const location = useLocation();
  const isAuthRoute = location.pathname === "/authentication";

  return (
    <>
      <CssBaseline />
      {!isAuthRoute && <Header />}
      {!isAuthRoute && <Sidebar drawerWidth={drawerWidth} />}
      {!isAuthRoute ? (
        <MainContent drawerWidth={drawerWidth}>
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/shipments" element={<Shipments />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/orders" element={<Orders />} />
          </Routes>
        </MainContent>
      ) : (
        <Routes>
          <Route path="/authentication" element={<Authentication />} />
        </Routes>
      )}
      {!isAuthRoute && <Footer drawerWidth={drawerWidth} />}
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
