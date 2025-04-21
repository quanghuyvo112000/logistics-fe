import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Container,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import LoadingHandler from "../shared/loadingHandler";
import { localStorageHelper } from "../shared/localStorageHelper";
import { useNavigate } from "react-router-dom";
import { encryptData } from "../../utils/crypto";
import { login } from "../../services/authen";

interface LoginFormProps {
  toggleForm: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ toggleForm }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (showLoading: () => void, hideLoading: () => void) => {
    try {
      setError(null);
      showLoading();

      if (!email || !password) {
        setError("Email and password are required!");
        return;
      }

      const response = await login(email, password, rememberMe);
      const data = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      const token = data.token;
      const role = encryptData(data.role);

      const authData = {
        token,
        rememberMe,
        role,
      };

      localStorageHelper.setItem("auth_token", JSON.stringify(authData));
      navigate("/dashboard");
    } catch (error) {
      console.error("Login failed:", error);
      setError("Invalid email or password!");
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => (
        <Container maxWidth="xs">
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ pt: 4 }}>
            <Typography component="h1" variant="h4" gutterBottom>
              Sign in
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: "center" }}>
              Welcome to logistics supply chain platform. Sign in to continue.
            </Typography>

            <Box component="form" width="100%" noValidate>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                E-mail
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="your.email or your.email@example"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { bgcolor: "#f9fafb" },
                }}
              />

              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Password
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="••••••••••"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: { bgcolor: "#f9fafb" },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <FormControlLabel
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    sx={{ color: "primary.main" }}
                  />
                }
                label="Remember me"
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleLogin(showLoading, hideLoading)}
                sx={{ mb: 3 }}
              >
                Sign In
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don&apos;t have an account?{" "}
                  <Link
                    component="button"
                    onClick={toggleForm}
                    sx={{ fontWeight: 600, color: "primary.main", textDecoration: "none" }}
                  >
                    Sign up
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      )}
    </LoadingHandler>
  );
};

export default LoginForm;
