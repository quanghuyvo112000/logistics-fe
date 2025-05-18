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

  const handleLogin = async (
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    try {
      setError(null);
      showLoading();

      if (!email || !password) {
        setError("Vui lòng nhập email và mật khẩu!");
        return;
      }

      const response = await login(email, password, rememberMe);
      const data =
        typeof response.data === "string"
          ? JSON.parse(response.data)
          : response.data;
      const token = data.token;
      const role = encryptData(data.role);

      const authData = {
        token,
        rememberMe,
        role,
      };

      localStorageHelper.setItem("auth_token", JSON.stringify(authData));

      if (data?.isPassword) {
        localStorageHelper.setItem(
          "isPassword",
          JSON.stringify(data.isPassword)
        );
        localStorageHelper.setItem("email", data.email)
        navigate("/profile");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Login failed:", error);
      setError("E-mail hoặc mật khẩu không hợp lệ!");
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => (
        <Container maxWidth="xs">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ pt: 4 }}
          >
            <Typography component="h1" variant="h4" gutterBottom>
              Đăng nhập
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ mb: 2, textAlign: "center" }}
            >
              Chào mừng đến với nền tảng chuỗi cung ứng hậu cần. Đăng nhập để
              tiếp tục.
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
                placeholder="email của bạn có hoặc không hậu tố @"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 3 }}
                InputProps={{
                  sx: { bgcolor: "#f9fafb" },
                }}
              />

              <Typography variant="body2" fontWeight={500} sx={{ mb: 1 }}>
                Mật khẩu
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
                label="Ghi nhớ đăng nhập"
                sx={{ mb: 3 }}
              />

              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={() => handleLogin(showLoading, hideLoading)}
                sx={{ mb: 3 }}
              >
                Đăng nhập
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Bạn chưa có tài khoản?{" "}
                  <Link
                    component="button"
                    onClick={toggleForm}
                    sx={{
                      fontWeight: 600,
                      color: "primary.main",
                      textDecoration: "none",
                    }}
                  >
                    Đăng ký
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
