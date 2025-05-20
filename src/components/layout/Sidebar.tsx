import {
  CalendarMonth,
  Dashboard,
  ExpandLess,
  ExpandMore,
  Inventory,
  Logout,
  Person,
  Settings,
  Warehouse,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useCallback, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { logout } from "../../services/authen";
import authHelper from "../../utils/auth-helper";

interface Props {
  drawerWidth: number;
}

const Sidebar = ({ drawerWidth }: Props) => {
  const [openSettings, setOpenSettings] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  const handleToggleSettings = () => setOpenSettings((prev) => !prev);

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout();
      console.log("🚪 Logout:", response.message);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      navigate("/authentication");
    }
  }, [navigate]);

  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
    ...(userRole === "WAREHOUSE_MANAGER" || userRole === "ADMIN"
      ? [{ text: "Kho hàng", path: "/warehouses", icon: <Warehouse /> }]
      : []),
    { text: "Lịch", path: "/calendar", icon: <CalendarMonth /> },
    { text: "Đơn hàng", path: "/orders", icon: <Inventory /> },
  ];

  const settingsItems = [
    { text: "Hồ sơ", path: "/profile", icon: <Person /> },
    {
      text: "Đăng xuất",
      path: "/authentication",
      icon: <Logout />,
      onClick: handleLogout,
    },
  ];

  const isActive = (path: string) => location.pathname === path;

  const renderMenuItem = (item: {
    text: string;
    path: string;
    icon: JSX.Element;
    onClick?: () => void;
  }) => (
    <ListItemButton
      key={item.text}
      component={Link}
      to={item.path}
      onClick={item.onClick}
      sx={{
        backgroundColor: isActive(item.path)
          ? "rgba(0, 0, 0, 0.08)"
          : "transparent",
        "&:hover": {
          backgroundColor: isActive(item.path)
            ? "rgba(0, 0, 0, 0.12)"
            : "rgba(0, 0, 0, 0.04)",
        },
      }}
    >
      <ListItemIcon>{item.icon}</ListItemIcon>
      <ListItemText primary={item.text} />
    </ListItemButton>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          mt: "64px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <List>{menuItems.map(renderMenuItem)}</List>
      </Box>

      <Box sx={{ marginBottom: "75px" }}>
        <List>
          <ListItemButton onClick={handleToggleSettings}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary="Cài đặt" />
            {openSettings ? <ExpandLess /> : <ExpandMore />}
          </ListItemButton>

          <Collapse in={openSettings} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {settingsItems.map(renderMenuItem)}
            </List>
          </Collapse>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
