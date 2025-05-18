import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Alert,
  Box,
  Grid,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { changePw } from "../../services/authen";
import CommonModal from "../shared/CommonModal";
import { localStorageHelper } from "../shared/localStorageHelper";
import { passwordValid } from "../../utils/passwordValidation";

interface Props {
  open: boolean;
  onClose: () => void;
}

const ChangePasswordModal: React.FC<Props> = ({ open, onClose }) => {
  const { showMessage } = useSnackbar();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleConfirm = async () => {
    setSubmitError(null);

    const { oldPassword, newPassword, confirmNewPassword } = formData;

    if (!oldPassword || !newPassword || !confirmNewPassword) {
      setSubmitError("Vui lòng điền đầy đủ thông tin.");
      return false;
    }

    if (!passwordValid(newPassword)) {
      setSubmitError(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt."
      );
      return false;
    }

    if (newPassword !== confirmNewPassword) {
      setSubmitError("Xác nhận mật khẩu không khớp.");
      return false;
    }

    try {
      const email = localStorageHelper.getItem<string>("email");

      if (!email) {
        setSubmitError("Không tìm thấy email trong localStorage.");
        return false;
      }

      setIsSubmitting(true);
      await changePw({ email, oldPassword, newPassword });

      showMessage("Thay đổi mật khẩu thành công!", "success");
      setFormData({
        ...formData,
        confirmNewPassword: "",
        newPassword: "",
        oldPassword: "",
      });
      return true;
    } catch (error: unknown) {
      const err = error as { message?: string };
      setSubmitError(err?.message || "Đã xảy ra lỗi khi đổi mật khẩu.");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Đổi mật khẩu"
      onConfirm={async () => {
        const success = await handleConfirm();
        if (success) onClose();
        return success;
      }}
      confirmText="Lưu mật khẩu mới"
      loading={isSubmitting}
    >
      <Box mt={2}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Grid container spacing={2}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mật khẩu hiện tại"
              name="oldPassword"
              type={showPassword ? "text" : "password"}
              value={formData.oldPassword}
              onChange={handleInputChange}
              margin="normal"
              InputProps={{
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
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Mật khẩu mới"
              name="newPassword"
              type={showPassword ? "text" : "password"}
              value={formData.newPassword}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Xác nhận mật khẩu mới"
              name="confirmNewPassword"
              type={showPassword ? "text" : "password"}
              value={formData.confirmNewPassword}
              onChange={handleInputChange}
              margin="normal"
            />
          </Grid>
        </Grid>
      </Box>
    </CommonModal>
  );
};

export default ChangePasswordModal;
