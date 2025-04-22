import { Box, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material"
import { format, parseISO } from "date-fns"
import { useEffect, useState } from "react"
import { statusLabels, UpdateWorkScheduleStatusRequest, WorkingSchedule } from "../../types/calendar.types"
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
  // Use a simple string state instead of a union type
  const [status, setStatus] = useState("APPROVED")

  // Reset form when dialog opens with new schedule
  useEffect(() => {
    if (open && schedule) {
      setStatus("APPROVED")
    }
  }, [open, schedule])

  const handleSubmit = () => {
    if (!schedule) return

    console.log("Submitting status:", status) // Debug log

    // Cast the status to the expected type when submitting
    onConfirm({
      scheduleId: schedule.id,
      status: status as "APPROVED" | "REJECTED",
    })
  }

  if (!schedule) return null

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

        <FormControl fullWidth margin="normal">
          <InputLabel id="status-label">Trạng thái</InputLabel>
          <Select
            labelId="status-label"
            id="status-select"
            value={status}
            label="Trạng thái"
            onChange={(e) => {
              console.log("Selected value:", e.target.value) // Debug log
              setStatus(e.target.value)
            }}
          >
            <MenuItem value="APPROVED">{statusLabels.APPROVED}</MenuItem>
            <MenuItem value="REJECTED">{statusLabels.REJECTED}</MenuItem>
          </Select>
        </FormControl>
      </Box>
    </CommonModal>
  )
}
