import type React from "react"

import { useState } from "react"
import { Typography, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Box, SelectChangeEvent } from "@mui/material"
import { format } from "date-fns"
import { CreateWorkScheduleRequest } from "../../services/calendar"
import CommonModal from "../shared/CommonModal"
import { shiftLabels } from "../../types/calendar.types"


interface RegistrationDialogProps {
  open: boolean
  registrationDate: Date | null
  onClose: () => void
  onConfirm: (scheduleData: CreateWorkScheduleRequest) => void
  loading?: boolean
}

export const RegistrationDialog = ({
  open,
  registrationDate,
  onClose,
  onConfirm,
  loading = false,
}: RegistrationDialogProps) => {
  const [formData, setFormData] = useState<CreateWorkScheduleRequest>({
    workDate: "",
    startTime: "08:00",
    endTime: "17:00",
    shift: "MORNING",
    note: "",
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Reset form when dialog opens with new date
  if (registrationDate && open && formData.workDate !== format(registrationDate, "yyyy-MM-dd")) {
    setFormData({
      ...formData,
      workDate: format(registrationDate, "yyyy-MM-dd"),
    })
    setErrors({})
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown }> | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as { name?: string; value: string };
    if (name) {
      setFormData({
        ...formData,
        [name]: value,
      });

      // Clear error for this field if it exists
      if (errors[name]) {
        setErrors({
          ...errors,
          [name]: "",
        });
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    // Validate start time
    if (!formData.startTime) {
      newErrors.startTime = "Vui lòng nhập giờ bắt đầu"
    }

    // Validate end time
    if (!formData.endTime) {
      newErrors.endTime = "Vui lòng nhập giờ kết thúc"
    } else if (formData.startTime && formData.endTime <= formData.startTime) {
      newErrors.endTime = "Giờ kết thúc phải sau giờ bắt đầu"
    }

    // Validate shift
    if (!formData.shift) {
      newErrors.shift = "Vui lòng chọn ca làm việc"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(formData)
    }
  }

  if (!registrationDate) return null

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Đăng ký ngày làm việc"
      maxWidth="sm"
      confirmText="Xác nhận đăng ký"
      cancelText="Hủy"
      confirmColor="primary"
      onConfirm={handleSubmit}
      loading={loading}
    >
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Ngày: {format(registrationDate, "dd/MM/yyyy")}
        </Typography>

        <FormControl fullWidth margin="normal" error={!!errors.shift}>
          <InputLabel id="shift-label">Ca làm việc</InputLabel>
          <Select labelId="shift-label" name="shift" value={formData.shift} label="Ca làm việc" onChange={handleChange}>
            {Object.entries(shiftLabels).map(([value, label]) => (
              <MenuItem key={value} value={value}>
                {label}
              </MenuItem>
            ))}
          </Select>
          {errors.shift && <FormHelperText>{errors.shift}</FormHelperText>}
        </FormControl>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <TextField
            label="Giờ bắt đầu"
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            fullWidth
            error={!!errors.startTime}
            helperText={errors.startTime}
          />

          <TextField
            label="Giờ kết thúc"
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            InputLabelProps={{ shrink: true }}
            inputProps={{ step: 300 }}
            fullWidth
            error={!!errors.endTime}
            helperText={errors.endTime}
          />
        </Box>

        <TextField
          label="Ghi chú"
          name="note"
          value={formData.note}
          onChange={handleChange}
          multiline
          rows={3}
          fullWidth
          margin="normal"
        />
      </Box>
    </CommonModal>
  )
}
