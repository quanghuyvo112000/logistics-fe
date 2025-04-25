import { Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { UserInfo } from "../../types/user.types";
import { checkValidateBirthday, checkValidatePhoneNumber } from "../../utils/validateForm";
import CommonModal from "../shared/CommonModal";
import LocationSelector from "../shared/LocationSelector";
import { updateUserProfile } from "../../services/user";

interface Props {
  open: boolean;
  onClose: () => void;
  formData: Partial<UserInfo>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSuccessUpdate?: (newData: UserInfo) => void; // optional callback
}

const EditProfileModal: React.FC<Props> = ({
  open,
  onClose,
  formData,
  onInputChange,
  onSuccessUpdate,
}) => {
  const { showMessage } = useSnackbar();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationChange = (location: {
    province: string;
    district: string;
    ward: string;
    address: string;
  }) => {
    const fields = ["province", "district", "ward", "address"] as const;
    fields.forEach((field) => {
      onInputChange({
        target: {
          name: field,
          value: location[field],
        },
      } as React.ChangeEvent<HTMLInputElement>);
    });
  };

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true);

      // Xây dựng payload
      const payload = {
        fullName: formData.fullName || "",
        birthday: formData.birthday || "",
        phone: formData.phone || "",
        province: formData.province || "",
        district: formData.district || "",
        ward: formData.ward || "",
        address: formData.address || "",
      };

      // Kiểm tra validate: Tất cả các trường không được để trống
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
        showMessage("Vui lòng điền vào tất cả các trường bắt buộc.", "error");
        return;
      }

      if (!checkValidateBirthday(String(formData.birthday))) {
        showMessage("Bạn phải trên 18 tuổi.", "error");
        return;
      }

      if (!checkValidatePhoneNumber(formData.phone)) {
        showMessage("Số điện thoại không hợp lệ. Phải có ít nhất 10 chữ số.", "error");
        return;
      }

      // Gửi API cập nhật thông tin người dùng
      const response = await updateUserProfile(payload);

      if (response.status === 200 && response.data) {
        showMessage("Cập nhật hồ sơ thành công!", "success");

        // Tạo đối tượng người dùng mới từ response và dữ liệu form
        const updatedUserInfo: UserInfo = {
          ...response.data,
          email: formData.email || "",
          role: formData.role || "user",
          createdAt: formData.createdAt || new Date().toISOString(), // Cung cấp mặc định nếu không có createdAt
        };

        // Gọi callback nếu có
        onSuccessUpdate?.(updatedUserInfo);

        // Đóng modal sau khi cập nhật thành công
        onClose();
      } else {
        showMessage("Cập nhật không thành công", "error");
      }
    } catch (error) {
      console.error("Error while updating:", error);
      showMessage("Đã xảy ra lỗi khi cập nhật thông tin.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Chỉnh Sửa Thông Tin"
      onConfirm={handleConfirm}
      confirmText="Lưu thay đổi"
      loading={isSubmitting}
      maxWidth="md"
    >
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Họ và tên"
            name="fullName"
            value={formData.fullName || ""}
            onChange={onInputChange}
            margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            disabled
            fullWidth
            label="Email"
            name="email"
            value={formData.email || ""}
            onChange={onInputChange}
            margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Số điện thoại"
            name="phone"
            value={formData.phone || ""}
            onChange={onInputChange}
            margin="normal"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ngày sinh"
            name="birthday"
            type="date"
            value={formData.birthday ? formData.birthday.split("T")[0] : ""}
            onChange={onInputChange}
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <LocationSelector
            onChange={handleLocationChange}
            value={{
              province: formData.province || "",
              district: formData.district || "",
              ward: formData.ward || "",
              address: formData.address || "",
            }}
          />
        </Grid>
      </Grid>
    </CommonModal>
  );
};

export default EditProfileModal;
