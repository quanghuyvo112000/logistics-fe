import { Alert, Box, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { createManager } from "../../services/user";
import { CreateManagerPayload } from "../../types/user.types";
import {
  checkValidateBirthday,
  checkValidateEmail,
  checkValidatePhoneNumber,
} from "../../utils/validateForm";
import CommonModal from "../shared/CommonModal";
import LocationSelector from "../shared/LocationSelector";
import { hideLoading, showLoading } from "../shared/loadingHandler";

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
    province: "",
    district: "",
    ward: "",
    address: "",
    warehouseId: data,
  });

  useEffect(() => {
    if (!open) {
      setFormData({
        fullName: "",
        birthday: "",
        email: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        warehouseId: data,
      });
      setSubmitError(null); // reset luôn lỗi
    }
  }, [open, data]);

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

  const handleSubmit = async () => {
    try {
      showLoading("Đang tạo quản lý kho hàng...");
      setSubmitError(null);
      await new Promise((resolve) => setTimeout(resolve, 1000));

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

      if (!checkValidateEmail(formData.email)) {
        setSubmitError("Email không có hậu tố @");
        hideLoading();
        return false;
      }

      await createManager(formData);
      showMessage("Tạo quản lý thành công!", "success");
      await fetchWarehouses();
      // Reset form
      setFormData({
        fullName: "",
        birthday: "",
        email: "",
        phone: "",
        province: "",
        district: "",
        ward: "",
        address: "",
        warehouseId: data, // vẫn giữ warehouseId
      });
      // đóng modal
      onClose();
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
    <CommonModal
      open={open}
      onClose={onClose}
      title="Thêm Quản Lý Kho Hàng"
      confirmText="Lưu thông tin"
      loading={false}
      onConfirm={async () => {
        const success = await handleSubmit();
        if (success) {
          onClose();
        }
        return success;
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
            <Typography variant="h6" align="left">
              {" "}
              Địa chỉ thường trú
            </Typography>
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
  );
};

export default AddManagerModal;
