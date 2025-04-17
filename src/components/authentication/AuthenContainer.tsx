
import { Box, Card } from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useState } from "react";

import authImg from "../../assets/auth.png"; // Adjust the path as necessary
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: "#0052cc", // Blue color for buttons
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f7", // Light gray background
      paper: "#ffffff",
    },
    text: {
      primary: "#333333",
      secondary: "#6b7280",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    body1: {
      fontSize: "0.95rem",
    },
    body2: {
      fontSize: "0.875rem",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          textTransform: "none",
          fontWeight: 600,
          fontSize: "1rem",
          padding: "12px 0",
        },
        containedPrimary: {
          backgroundColor: "#0052cc",
          "&:hover": {
            backgroundColor: "#003d99",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          backgroundColor: "#f9fafb",
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#0052cc",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          border: "none",
        },
      },
    },
  },
});

export default function AuthenContainer() {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          width: "100%",
          maxWidth: "1200px",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          overflow: "hidden",
          borderRadius: 0,
          margin: "0 0 0 150px",
          boxShadow: 3,
        }}
      >
        <Card
          sx={{
            width: "100%",
            maxWidth: "1200px",
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            overflow: "hidden",
            borderRadius: 0,
            // minHeight: "100vh",
            height: "100vh",
          }}
        >
          {/* Left side - 3D Logistics Illustration */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "#f0f2f5",
            }}
          >
            <Box
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
            <img
              src={authImg}
              alt="Auth Illustration"
              loading="lazy"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </Box>

          {/* Right side - Auth form */}
          <Box
            sx={{
              width: { xs: "100%", md: "50%" },
              p: { xs: 3, sm: 6 },
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              bgcolor: "white",
              height: "100vh", 
              overflowY: "auto" 
            }}
          >
            {isLogin ? (
              <LoginForm toggleForm={toggleForm} />
            ) : (
              <RegisterForm toggleForm={toggleForm} />
            )}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}
