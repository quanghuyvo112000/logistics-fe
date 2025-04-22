import {
  Box,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { callApi } from "./api";

interface Location {
  province: string;
  district: string[];
  ward: string[];
}

interface LocationSelectorValue {
  province: string;
  district: string;
  ward: string;
  address: string;
}

interface Props {
  value: LocationSelectorValue;
  onChange: (location: LocationSelectorValue) => void;
}

const LocationSelector: React.FC<Props> = ({ value, onChange }) => {
  const [locations, setLocations] = useState<Location[]>([]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await callApi(
          "GET",
          "provinces",
          undefined,
          false
        ) as { status: number; data: Location[] };

        if (response.status === 200 && Array.isArray(response.data)) {
          setLocations(response.data);
        } else {
          console.error("Failed to fetch locations: Invalid response format.");
        }
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const handleChange = (field: keyof LocationSelectorValue, newValue: string) => {
    const updated = { ...value, [field]: newValue };

    // Reset dependent fields when parent changes
    if (field === "province") {
      updated.district = "";
      updated.ward = "";
    } else if (field === "district") {
      updated.ward = "";
    }

    onChange(updated);
  };

  return (
    <Box mt={2}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="medium">
            <InputLabel id="province-label">Chọn tỉnh/ Thành phố</InputLabel>
            <Select
              labelId="province-label"
              value={value.province}
              label="Chọn tỉnh/ Thành phố"
              onChange={(e: SelectChangeEvent) =>
                handleChange("province", e.target.value)
              }
              sx={{ bgcolor: "#f9fafb" }}
            >
              <MenuItem value="">Chọn tỉnh/ Thành phố</MenuItem>
              {locations.map((location) => (
                <MenuItem key={location.province} value={location.province}>
                  {location.province}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="medium" disabled={!value.province}>
            <InputLabel id="district-label">Chọn quận</InputLabel>
            <Select
              labelId="district-label"
              value={value.district}
              label="Chọn quận"
              onChange={(e: SelectChangeEvent) =>
                handleChange("district", e.target.value)
              }
              sx={{ bgcolor: "#f9fafb" }}
            >
              <MenuItem value="">Chọn quận</MenuItem>
              {locations
                .find((location) => location.province === value.province)
                ?.district.map((district) => (
                  <MenuItem key={district} value={district}>
                    {district}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth size="medium" disabled={!value.district}>
            <InputLabel id="ward-label">Chọn phường</InputLabel>
            <Select
              labelId="ward-label"
              value={value.ward}
              label="Chọn phường"
              onChange={(e: SelectChangeEvent) =>
                handleChange("ward", e.target.value)
              }
              sx={{ bgcolor: "#f9fafb" }}
            >
              <MenuItem value="">Chọn phường</MenuItem>
              {locations
                .find((location) => location.province === value.province)
                ?.ward.map((ward) => (
                  <MenuItem key={ward} value={ward}>
                    {ward}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Địa chỉ"
            name="address"
            value={value.address}
            onChange={(e) => handleChange("address", e.target.value)}
            sx={{ bgcolor: "#f9fafb" }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default LocationSelector;
