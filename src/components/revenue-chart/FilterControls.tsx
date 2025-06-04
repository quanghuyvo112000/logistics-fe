import React, { useEffect } from "react";
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { StatType } from "../../types/income.type";
import authHelper from "../../utils/auth-helper";

interface FilterControlsProps {
  statType: StatType;
  selectedYear: number;
  selectedWarehouseId: string;
  availableYears: number[];
  availableWarehouses: { id: string; name: string }[];
  onStatTypeChange: (type: StatType) => void;
  onYearChange: (year: number) => void;
  onWarehouseChange: (warehouseId: string) => void;
}

const availableStatTypes: {
  value: StatType;
  label: string;
  roles: ("ADMIN" | "WAREHOUSE_MANAGER" | "CUSTOMER" | "DRIVER")[];
}[] = [
  {
    value: "monthly",
    label: "Theo tháng",
    roles: ["WAREHOUSE_MANAGER", "DRIVER"],
  },
  {
    value: "quarterly",
    label: "Theo quý",
    roles: ["WAREHOUSE_MANAGER", "DRIVER"],
  },
  { value: "warehouse", label: "Theo kho", roles: ["ADMIN"] },
];

const FilterControls: React.FC<FilterControlsProps> = ({
  statType,
  selectedYear,
  selectedWarehouseId,
  availableYears,
  availableWarehouses,
  onStatTypeChange,
  onYearChange,
  onWarehouseChange,
}) => {
  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  // Nếu statType hiện tại không hợp lệ với userRole, set lại statType mặc định
  useEffect(() => {
    if (!userRole) return;

    const allowedStatTypes = availableStatTypes
      .filter((opt) => opt.roles.includes(userRole))
      .map((opt) => opt.value);

    if (!allowedStatTypes.includes(statType)) {
      onStatTypeChange(allowedStatTypes[0]);
    }
  }, [userRole, statType, onStatTypeChange]);

  const handleStatTypeChange = (event: SelectChangeEvent) => {
    onStatTypeChange(event.target.value as StatType);
  };

  const handleYearChange = (event: SelectChangeEvent) => {
    onYearChange(Number(event.target.value));
  };

  const handleWarehouseChange = (event: SelectChangeEvent) => {
    onWarehouseChange(String(event.target.value));
  };

  return (
    <Box display="flex" flexWrap="wrap" gap={2} alignItems="center">
      <FormControl size="small" sx={{ minWidth: 150 }}>
        <InputLabel id="stat-type-select-label">Loại thống kê</InputLabel>
        <Select
          labelId="stat-type-select-label"
          id="stat-type-select"
          value={statType}
          label="Loại thống kê"
          onChange={handleStatTypeChange}
        >
          {availableStatTypes
            .filter((opt) => opt.roles.includes(userRole!))
            .map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {statType !== "warehouse" && (
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel id="year-select-label">Năm</InputLabel>
          <Select
            labelId="year-select-label"
            id="year-select"
            value={selectedYear.toString()}
            label="Năm"
            onChange={handleYearChange}
          >
            {availableYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {statType === "warehouse" && (
        <>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel id="warehouse-select-label">Kho</InputLabel>
            <Select
              labelId="warehouse-select-label"
              id="warehouse-select"
              value={selectedWarehouseId.toString()}
              label="Kho"
              onChange={handleWarehouseChange}
            >
              {availableWarehouses.map((warehouse) => (
                <MenuItem key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel id="year-select-label">Năm</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear.toString()}
              label="Năm"
              onChange={handleYearChange}
            >
              {availableYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </>
      )}
    </Box>
  );
};

export default FilterControls;
