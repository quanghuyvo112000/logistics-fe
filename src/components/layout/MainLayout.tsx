import {
    AppBar,
    Box,
    Button,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material"
import { MenuIcon, Truck } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FooterMain from "./FooterMain"

interface MainLayoutProps {
  children: React.ReactNode
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/authentication");
  }

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
    if (mobileOpen) {
      setMobileOpen(false)
    }
  }

  const menuItems = [
    { text: "Trang chủ", action: () => scrollToSection("home") },
    { text: "Chúng tôi", action: () => scrollToSection("about") },
    { text: "Cam kết", action: () => scrollToSection("commitment") },
  ]

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", p: 2 }}>
        <Truck size={24} />
        <Typography variant="h6" sx={{ ml: 1 }}>
          TRACKING SYSTEM
        </Typography>
      </Box>
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton sx={{ textAlign: "center" }} onClick={item.action}>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" color="default" elevation={2} sx={{ backgroundColor: "white" }}>
        <Toolbar>
          {isMobile ? (
            <>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1, justifyContent: "center" }}>
                <Truck size={24} />
                <Typography variant="h6" component="div" sx={{ ml: 1 }}>
                  TRACKING SYSTEM
                </Typography>
              </Box>
              <Button color="primary" variant="outlined" onClick={handleLogin}>
                Đăng nhập
              </Button>
            </>
          ) : (
            <>
              <Box sx={{ display: "flex", alignItems: "center", mr: 6 }}>
                <Truck size={28} />
                <Typography variant="h6" component="div" sx={{ ml: 1.5, fontWeight: 600 }}>
                  TRACKING SYSTEM
                </Typography>
              </Box>
              <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center" }}>
                {menuItems.map((item) => (
                  <Button
                    key={item.text}
                    color="inherit"
                    onClick={item.action}
                    sx={{
                      mx: 2,
                      py: 1,
                      fontSize: "1rem",
                      position: "relative",
                      "&::after": {
                        content: '""',
                        position: "absolute",
                        width: "0%",
                        height: "2px",
                        bottom: "0",
                        left: "50%",
                        transform: "translateX(-50%)",
                        backgroundColor: theme.palette.primary.main,
                        transition: "width 0.3s ease",
                      },
                      "&:hover::after": {
                        width: "80%",
                      },
                    }}
                  >
                    {item.text}
                  </Button>
                ))}
              </Box>
              <Box>
                <Button
                  color="primary"
                  variant="outlined"
                  onClick={handleLogin}
                  sx={{
                    px: 3,
                    py: 0.8,
                    borderRadius: "4px",
                    fontWeight: 500,
                  }}
                >
                  Đăng nhập / Đăng ký
                </Button>
              </Box>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Box component="nav">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": { boxSizing: "border-box", width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
        <Box sx={{ width: "100%", minWidth: "1100px", mx: 3 }}>{children}</Box>
      </Box>

      <FooterMain />
    </>
  )
}

export default MainLayout
