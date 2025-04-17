import { Box, Grid, MenuItem, TextField } from "@mui/material";
import React, { useState } from "react";
import { useSnackbar } from "../../contexts/SnackbarContext";
import { createDriver } from "../../services/MethodPost/CreateDriver";
import { CreateDriverPayload } from "../../types/user.types";
import { passwordValid } from "../../utils/passwordValidation";
import {
    checkValidateBirthday,
    checkValidateEmail,
    checkValidatePhoneNumber,
} from "../../utils/validateForm";
import CommonModal from "../shared/CommonModal";
import LocationSelector from "../shared/LocationSelector";
import LoadingHandler from "../shared/loadingHandler";

interface Props {
  open: boolean;
  onClose: () => void;
  data: string;
  fetchWarehouses: () => void;
}

const AddDriverModal: React.FC<Props> = ({
  open,
  onClose,
  data,
  fetchWarehouses,
}) => {
  const { showMessage } = useSnackbar();

  const [formData, setFormData] = useState<CreateDriverPayload>({
    fullName: "",
    birthday: "",
    email: "",
    phone: "",
    password: "",
    province: "",
    district: "",
    ward: "",
    address: "",
    vehicleType: "",
    vehiclePlate: "",
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
        showMessage("Please fill in all required fields.", "error");
        return;
      }

      if (!checkValidateBirthday(String(formData.birthday))) {
        showMessage("You must be over 18 years old.", "error");
        return;
      }

      if (!checkValidatePhoneNumber(formData.phone)) {
        showMessage(
          "Invalid phone number. Must be at least 10 digits.",
          "error"
        );
        return;
      }

      if (!passwordValid(formData.password)) {
        showMessage(
          "Password must be at least 8 characters, including uppercase letters, numbers and special characters.",
          "error"
        );
        return;
      }

      if (!checkValidateEmail(formData.email)) {
        showMessage("Email does not have @ suffix", "error");
        return;
      }

      await createDriver(formData);
      showMessage("Create Driver successfully!", "success");
      await fetchWarehouses();
      onClose();
    } catch (error) {
      console.error(error);
      showMessage("An error occurred while creating Driver.", "error");
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
          title="Add Warehouse Driver"
          confirmText="Save"
          loading={false}
          onConfirm={() => handleSubmit(showLoading, hideLoading)}
          maxWidth="md"
        >
          <Box mt={2}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="birthday"
                  label="Brithday"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.birthday.toString()}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="email"
                  label="Email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  name="phone"
                  label="Phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  name="vehicleType"
                  label="Vehicle Type"
                  value={formData.vehicleType}
                  onChange={handleChange}
                  required
                >
                  <MenuItem value="TRUCK">Truck</MenuItem>
                  <MenuItem value="MOTORBIKE">Motorbike</MenuItem>
                  <MenuItem value="VAN">Van</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  name="vehiclePlate"
                  label="Vehicle Plate"
                  value={formData.vehiclePlate}
                  onChange={handleChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
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

export default AddDriverModal;
