import { Alert, Box, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { CreateManagerPayload } from "../../types/user.types";
import { passwordValid } from "../../utils/passwordValidation";
import {
  checkValidateBirthday,
  checkValidateEmail,
  checkValidatePhoneNumber,
} from "../../utils/validateForm";
import CommonModal from "../shared/CommonModal";
import LocationSelector from "../shared/LocationSelector";
import LoadingHandler from "../shared/loadingHandler";
import { createManager } from "../../services/user";

interface Props {
  open: boolean;
  onClose: () => void;
  data: string;
  fetchWarehouses: () => void;
}

const AddManagerModal: React.FC<Props> = ({
  open,
  onClose,
  data,
  fetchWarehouses,
}) => {
  const { showMessage } = useSnackbar();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateManagerPayload>({
    fullName: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    warehouseId: data,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLocationChange = (location: {
    province: string;
    district: string;
    ward: string;
    address: string;
  }) => {
    setFormData((prev) => ({
      ...prev,
      ...location,
    }));
  };

  const handleSubmit = async (
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    try {
      showLoading();
      setSubmitError(null);
      if (
        !formData.fullName ||
        !formData.birthday ||
        !formData.email ||
        !formData.phone ||
        !formData.province ||
        !formData.district ||
        !formData.ward ||
        !formData.address
      ) {
        setSubmitError("Vui lòng điền vào tất cả các trường bắt buộc.");
        hideLoading();
        return false;
      }

      if (!checkValidateBirthday(String(formData.birthday))) {
        setSubmitError("Bạn phải trên 18 tuổi.");
        hideLoading();
        return false;
      }

      if (!checkValidatePhoneNumber(formData.phone)) {
        setSubmitError(
          "Số điện thoại không hợp lệ. Phải có ít nhất 10 chữ số."
        );
        hideLoading();
        return false;
      }

      if (!passwordValid(formData.password)) {
        setSubmitError(
          "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, số và ký tự đặc biệt."
        );
        hideLoading();
        return false;
      }

      if (!checkValidateEmail(formData.email)) {
        setSubmitError("Email không có hậu tố @");
        hideLoading();
        return false;
      }

      await createManager(formData);
      showMessage("Tạo quản lý thành công!", "success");
      await fetchWarehouses();
      return true;
    } catch (error) {
      console.error(error);
      showMessage("Đã xảy ra lỗi khi tạo quản lý.", "error");
      return false;
    } finally {
      hideLoading();
    }
  };

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => (
        <CommonModal
          open={open}
          onClose={onClose}
          title="Thêm Quản Lý Kho Hàng"
          confirmText="Lưu thông tin"
          loading={false}
          onConfirm={async () => {
            const success = await handleSubmit(showLoading, hideLoading)
            if (success) {
              onClose()
            }
            return success
          }}
          maxWidth="md"
        >
          <Box mt={2}>
            {submitError && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {submitError}
              </Alert>
            )}
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Họ và tên"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="birthday"
                  label="Ngày sinh"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birthday.toString()}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Số điện thoại"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid size={{ xs: 12 }}>
                <TextField
                  fullWidth
                  name="password"
                  label="Mật khẩu"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <LocationSelector
                  value={{
                    province: formData.province,
                    district: formData.district,
                    ward: formData.ward,
                    address: formData.address,
                  }}
                  onChange={handleLocationChange}
                />
              </Grid>
            </Grid>
          </Box>
        </CommonModal>
      )}
    </LoadingHandler>
  );
};

export default AddManagerModal;
