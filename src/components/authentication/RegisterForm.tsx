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
import { createUser } from "../../services/user";
import { CreateCustomerPayload } from "../../types/user.types";
import {
  // passwordRequirements,
  passwordValid,
} from "../../utils/passwordValidation";
import {
  checkValidateBirthday,
  checkValidateEmail,
  checkValidatePhoneNumber,
} from "../../utils/validateForm";
import LocationSelector from "../shared/LocationSelector";
import { hideLoading, showLoading } from "../shared/loadingHandler";

interface RegisterFormProps {
  toggleForm: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({ toggleForm }) => {
  const [form, setForm] = useState<CreateCustomerPayload>({
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

  const handleRegister = async () => {
    setError(null);
    setSuccess(null);

    if (!form.fullName || !form.birthday || !form.email || !form.phone) {
      setError("Vui lòng điền vào tất cả các trường bắt buộc.");
      return;
    }

    if (!checkValidateBirthday(String(form.birthday))) {
      setError("Bạn phải trên 18 tuổi mới được đăng ký.");
      return;
    }

    if (!checkValidateEmail(form.email)) {
      setError("Email không có hậu tố @.");
      return;
    }

    if (!checkValidatePhoneNumber(form.phone)) {
      setError("Số điện thoại không hợp lệ. Phải có ít nhất 10 chữ số.");
      return;
    }

    if (!form.province || !form.district || !form.ward || !form.address) {
      setError("Vui lòng chọn địa chỉ đầy đủ.");
      return;
    }

    if (!passwordValid(form.password)) {
      setError(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt."
      );
      return;
    }

    if (form.password !== confirmPassword) {
      setError("Mật khẩu và Xác nhận mật khẩu không khớp.");
      return;
    }

    try {
      showLoading("Đang tạo tài khoản...");
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const res = await createUser(form);
      if (res.status === 201 || res.status === 200 || res.status === 0) {
        setSuccess("Tạo tài khoản thành công!");
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
        setError("Email đã tồn tại!");
      } else {
        setError("Đăng ký thất bại");
      }
    } catch (err) {
      console.error("Register failed:", err);
      setError("Đăng ký thất bại. Vui lòng thử lại sau.");
    } finally {
      hideLoading();
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        sx={{ pt: 1 }}
      >
        <Typography component="h1" variant="h4" gutterBottom fontWeight={600}>
          Đăng ký
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mb: 2, textAlign: "center" }}
        >
          Chào mừng đến với nền tảng chuỗi cung ứng hậu cần. Đăng ký làm thành
          viên để trải nghiệm.
        </Typography>

        <Box
          component="form"
          width="100%"
          noValidate
          onSubmit={(e) => {
            e.preventDefault();
            handleRegister();
          }}
        >
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Họ và tên"
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                required
                InputProps={{ sx: { bgcolor: "#f9fafb" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Ngày sinh"
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
            <Grid size={{ xs: 12, sm: 6 }}>
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Số điện thoại"
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Mật khẩu"
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
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Xác nhận lại mật khẩu"
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
          <Button
            fullWidth
            variant="contained"
            type="submit"
            sx={{ mt: 1, mb: 1, borderRadius: 2, py: 1 }}
          >
            Tạo tài khoản
          </Button>

          <Typography variant="body2" align="center">
            Đã là thành viên?{" "}
            <Link
              component="button"
              onClick={toggleForm}
              underline="hover"
              sx={{ fontWeight: 600 }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default RegisterForm;
