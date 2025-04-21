import {
  Avatar,
  Box,
  Button,
  Chip,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Popover,
  Typography,
  styled,
} from "@mui/material"
import { format, parseISO } from "date-fns"
import React from "react"
import { shiftLabels, statusColors, statusLabels, UserRole, WorkingSchedule } from "../../types/calendar.types"

const StyledDriverPopover = styled(Paper)(({ theme }) => ({
  width: "300px",
  maxHeight: "400px",
  overflow: "auto",
  padding: theme.spacing(1),
}))

interface DriverPopoverProps {
  anchorEl: HTMLElement | null
  selectedDate: Date | null
  selectedDaySchedules: WorkingSchedule[]
  userRole: UserRole
  onClose: () => void
  onUpdateStatus: (schedule: WorkingSchedule) => void
}

export const DriverPopover = ({
  anchorEl,
  selectedDate,
  selectedDaySchedules,
  userRole,
  onClose,
  onUpdateStatus,
}: DriverPopoverProps) => {
  // Check if user can update status (admin or warehouse manager)
  const canUpdateStatus = userRole === "ADMIN" || userRole === "WAREHOUSE_MANAGER"

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <StyledDriverPopover>
        <Typography variant="subtitle1" sx={{ fontWeight: "bold", mb: 1 }}>
          {selectedDate && format(selectedDate, "dd/MM/yyyy")} - {selectedDaySchedules.length} lịch làm việc
        </Typography>

        <List dense sx={{ p: 0 }}>
          {selectedDaySchedules.map((schedule, index) => {
            // Use nameDriver from the API
            const driverName = schedule.nameDriver || "Chưa gán tài xế"

            return (
              <React.Fragment key={schedule.id}>
                {index > 0 && <Divider component="li" />}
                <ListItem alignItems="flex-start">
                  <ListItemAvatar>
                    <Avatar>{driverName ? driverName.charAt(0) : "?"}</Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
                          {driverName}
                        </Typography>
                        <Chip
                          size="small"
                          label={statusLabels[schedule.status]}
                          sx={{
                            backgroundColor: statusColors[schedule.status],
                            color: "#fff",
                            height: "20px",
                            fontSize: "0.7rem",
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Box mt={0.5}>
                        <Typography variant="body2" component="div">
                          {shiftLabels[schedule.shift]} • {schedule.startTime} - {schedule.endTime}
                        </Typography>
                        {schedule.note && (
                          <Typography variant="body2" color="text.secondary">
                            Ghi chú: {schedule.note}
                          </Typography>
                        )}
                        <Typography variant="caption" color="text.secondary">
                          Cập nhật: {format(parseISO(schedule.updatedAt), "dd/MM/yyyy HH:mm")}
                        </Typography>

                        {/* Status update button for admin/manager */}
                        {canUpdateStatus && schedule.status === "PENDING" && (
                          <Box mt={1}>
                            <Button
                              size="small"
                              variant="outlined"
                              color="primary"
                              onClick={() => onUpdateStatus(schedule)}
                            >
                              Cập nhật trạng thái
                            </Button>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </React.Fragment>
            )
          })}
        </List>
      </StyledDriverPopover>
    </Popover>
  )
}
