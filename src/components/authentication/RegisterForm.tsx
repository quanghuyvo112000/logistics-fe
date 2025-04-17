import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { createUser } from "../../services/MethodPost/CreateUser";
import { CreateUserPayload } from "../../types/user.types";
import {
  // passwordRequirements,
  passwordValid,
} from "../../utils/passwordValidation";
import {
  checkValidateBirthday,
  checkValidateEmail,
  checkValidatePhoneNumber,
} from "../../utils/validateForm";
import LoadingHandler from "../shared/loadingHandler";
import LocationSelector from "../shared/LocationSelector";

interface RegisterFormProps {
  toggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
  const [form, setForm] = useState<CreateUserPayload>({
    fullName: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // const [passwordValidations, setPasswordValidations] = useState<boolean[]>(
  //   new Array(passwordRequirements.length).fill(false)
  // );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setForm((prevForm) => ({ ...prevForm, password: newPassword }));
    // const validations = passwordRequirements.map((req) =>
    //   req.regex.test(newPassword)
    // );
    // setPasswordValidations(validations);
  };

  const handleLocationChange = (location: {
    province: string;
    district: string;
    ward: string;
    address: string;
  }) => {
    setForm((prev) => ({
      ...prev,
      ...location,
    }));
  };

  const handleRegister = async (
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    setError(null);
    setSuccess(null);

    if (!form.fullName || !form.birthday || !form.email || !form.phone) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!checkValidateBirthday(String(form.birthday))) {
      setError("You must be over 18 years old to register.");
      return;
    }

    if (!checkValidateEmail(form.email)) {
      setError("Email does not have @ suffix");
      return;
    }

    if (!checkValidatePhoneNumber(form.phone)) {
      setError("Invalid phone number. Must be at least 10 digits.");
      return;
    }

    if (!form.province || !form.district || !form.ward || !form.address) {
      setError("Please select full address.");
      return;
    }

    if (!passwordValid(form.password)) {
      setError(
        "Password must be at least 8 characters, including uppercase letters, numbers and special characters."
      );
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Password and Confirm Password do not match.");
      return;
    }

    showLoading();
    try {
      const res = await createUser(form);
      if (res.status === 201 || res.status === 200 || res.status === 0) {
        setSuccess(res.message || "Tạo tài khoản thành công!");
        setForm({
          fullName: "",
          birthday: "",
          email: "",
          phone: "",
          password: "",
          province: "",
          district: "",
          ward: "",
          address: "",
        });
        setConfirmPassword("");
      } else if (res.status === 409) {
        setError(res.message || "Email đã tồn tại!");
      } else {
        setError(res.message || "Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Register failed:", err);
      setError("Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => (
        <Container maxWidth="sm">
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            sx={{ pt: 1 }}
          >
            <Typography
              component="h1"
              variant="h4"
              gutterBottom
              fontWeight={600}
            >
              Sign up
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Welcome to logistics supply chain platform. Register as a member
              to experience.
            </Typography>

            <Box component="form" width="100%" noValidate>
              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                    InputProps={{ sx: { bgcolor: "#f9fafb" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Birthday"
                    name="birthday"
                    type="date"
                    value={form.birthday}
                    onChange={handleChange}
                    required
                    InputLabelProps={{ shrink: true }}
                    InputProps={{ sx: { bgcolor: "#f9fafb" } }}
                  />
                </Grid>
              </Grid>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    InputProps={{ sx: { bgcolor: "#f9fafb" } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    required
                    InputProps={{ sx: { bgcolor: "#f9fafb" } }}
                  />
                </Grid>
              </Grid>

              <LocationSelector
                onChange={handleLocationChange}
                value={{
                  province: form.province,
                  district: form.district,
                  ward: form.ward,
                  address: form.address,
                }}
              />

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={handlePasswordChange}
                    required
                    sx={{ mb: 2, mt: 2 }}
                    InputProps={{
                      sx: { bgcolor: "#f9fafb" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    sx={{ mt: 2, position: "relative" }}
                    InputProps={{
                      sx: { bgcolor: "#f9fafb" },
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            edge="end"
                          >
                            {showConfirmPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
              {/* <ul className="pl-2 ml-2 mt-0" style={{ margin: 0 }}>
                {passwordRequirements.map((req, index) => (
                  <li
                    key={index}
                    style={{
                      color: passwordValidations[index] ? "green" : "red",
                      lineHeight: "1.6",
                      fontSize: "0.875rem",
                    }}
                  >
                    {req.message}
                  </li>
                ))}
              </ul> */}
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleRegister(showLoading, hideLoading)}
                sx={{ mt: 3, mb: 2, borderRadius: 2, py: 1 }}
              >
                Create Account
              </Button>

              <Typography variant="body2" align="center">
                Already a member?{" "}
                <Link
                  component="button"
                  onClick={toggleForm}
                  underline="hover"
                  sx={{ fontWeight: 600 }}
                >
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </Container>
      )}
    </LoadingHandler>
  );
};

export default RegisterForm;
