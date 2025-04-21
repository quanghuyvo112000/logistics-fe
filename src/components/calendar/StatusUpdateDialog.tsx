
import { Box, FormControl, FormHelperText, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material"
import { format, parseISO } from "date-fns"
import { useState } from "react"
import { UpdateWorkScheduleStatusRequest } from "../../services/calendar"
import { statusLabels, WorkingSchedule } from "../../types/calendar.types"
import CommonModal from "../shared/CommonModal"

interface StatusUpdateDialogProps {
  open: boolean
  schedule: WorkingSchedule | null
  onClose: () => void
  onConfirm: (request: UpdateWorkScheduleStatusRequest) => void
  loading?: boolean
}

export const StatusUpdateDialog = ({
  open,
  schedule,
  onClose,
  onConfirm,
  loading = false,
}: StatusUpdateDialogProps) => {
  const [status, setStatus] = useState<"APPROVED" | "REJECTED">("APPROVED")
  const [error, setError] = useState<string | null>(null)

  // Reset form when dialog opens with new schedule
  if (schedule && open && status !== "APPROVED") {
    setStatus("APPROVED")
    setError(null)
  }

  const handleChange = (event: SelectChangeEvent<"APPROVED" | "REJECTED">) => {
    setStatus(event.target.value as "APPROVED" | "REJECTED")
    setError(null)
  }

  const handleSubmit = () => {
    if (!schedule) return

    onConfirm({
      scheduleId: schedule.id,
      status,
    })
  }

  if (!schedule) return null

  // Use nameDriver from the API if available
  const driverName = schedule.nameDriver || "Tài xế"

  return (
    <CommonModal
      open={open}
      onClose={onClose}
      title="Cập nhật trạng thái đăng ký"
      maxWidth="sm"
      confirmText="Xác nhận"
      cancelText="Hủy"
      confirmColor={status === "APPROVED" ? "success" : "error"}
      onConfirm={handleSubmit}
      loading={loading}
    >
      <Box sx={{ mt: 1 }}>
        <Typography variant="subtitle1" gutterBottom>
          Cập nhật trạng thái đăng ký cho {driverName}
        </Typography>

        <Box sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Ngày:</strong> {format(parseISO(schedule.workDate), "dd/MM/yyyy")}
          </Typography>
          <Typography variant="body2">
            <strong>Ca:</strong> {schedule.shift}
          </Typography>
          <Typography variant="body2">
            <strong>Thời gian:</strong> {schedule.startTime} - {schedule.endTime}
          </Typography>
          {schedule.note && (
            <Typography variant="body2">
              <strong>Ghi chú:</strong> {schedule.note}
            </Typography>
          )}
        </Box>

        <FormControl fullWidth margin="normal" error={!!error}>
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select labelId="status-label" value={status} label="Trạng thái" onChange={handleChange}>
            <MenuItem value="APPROVED">{statusLabels.APPROVED}</MenuItem>
            <MenuItem value="REJECTED">{statusLabels.REJECTED}</MenuItem>
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      </Box>
    </CommonModal>
  )
}
