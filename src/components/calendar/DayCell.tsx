import type React from "react"

import { Box, Chip, Typography, styled, useTheme } from "@mui/material"
import { isSameDay, isToday, isBefore, parseISO } from "date-fns"
import { shiftLabels, statusColors, statusLabels, UserRole, WorkingSchedule } from "../../types/calendar.types"


const StyledDayCell = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "isCurrentMonth" &&
    prop !== "isToday" &&
    prop !== "isSelected" &&
    prop !== "isRegistered" &&
    prop !== "isPastDay",
})<{ isCurrentMonth: boolean; isToday: boolean; isSelected: boolean; isRegistered?: boolean; isPastDay?: boolean }>(
  ({ theme, isCurrentMonth, isToday, isSelected, isRegistered, isPastDay }) => ({
    height: "120px",
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(1),
    position: "relative",
    backgroundColor: isToday ? "rgba(25, 118, 210, 0.08)" : isRegistered ? "rgba(76, 175, 80, 0.08)" : "inherit",
    opacity: isCurrentMonth ? (isPastDay ? 0.7 : 1) : 0.5,
    cursor: isPastDay ? "default" : "pointer",
    overflow: "auto",
    "&:hover": {
      backgroundColor: isPastDay ? undefined : isRegistered ? "rgba(76, 175, 80, 0.15)" : "rgba(0, 0, 0, 0.04)",
    },
    ...(isSelected && {
      border: `2px solid ${theme.palette.primary.main}`,
    }),
    ...(isRegistered && {
      border: `1px solid ${theme.palette.success.main}`,
    }),
  }),
)

const DayNumber = styled(Typography)(() => ({
  position: "absolute",
  top: "5px",
  right: "5px",
  width: "24px",
  height: "24px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%",
}))

const ScheduleChip = styled(Chip)(() => ({
  margin: "2px",
  fontSize: "0.7rem",
  height: "24px",
}))

interface DayCellProps {
  day: Date
  currentMonth: Date
  selectedDate: Date | null
  userRole: UserRole
  schedules: WorkingSchedule[]
  onDateClick: (day: Date, event: React.MouseEvent<HTMLElement>) => void
}

export const DayCell = ({ day, currentMonth, selectedDate, userRole, schedules, onDateClick }: DayCellProps) => {
  const theme = useTheme()

  const isCurrentMonthDay = day.getMonth() === currentMonth.getMonth()
  const isTodayDay = isToday(day)
  const isSelectedDay = selectedDate ? isSameDay(day, selectedDate) : false
  const isPastDay = isBefore(day, new Date()) && !isToday(day)

  // Get schedules for this day
  const daySchedules = schedules.filter((schedule) => {
    try {
      // Parse the workDate and check if it's the same day
      const scheduleDate = parseISO(schedule.workDate)
      return isSameDay(scheduleDate, day)
    } catch (error) {
      console.error("Error parsing date:", schedule.workDate, error)
      return false
    }
  })

  // Check if the current user (driver) has registered for this day
  const isRegistered = userRole === "DRIVER" && daySchedules.length > 0

  // Get the driver's schedule for this day (if registered)
  const driverSchedule = isRegistered && daySchedules.length > 0 ? daySchedules[0] : null

  // Count schedules by status
  const countSchedulesByStatus = () => {
    const counts: Record<string, number> = {
      PENDING: 0,
      APPROVED: 0,
      REJECTED: 0,
      COMPLETED: 0,
      CANCELLED: 0,
    }

    daySchedules.forEach((schedule) => {
      counts[schedule.status]++
    })

    return counts
  }

  const statusCounts = countSchedulesByStatus()

  return (
    <StyledDayCell
      isCurrentMonth={isCurrentMonthDay}
      isToday={isTodayDay}
      isSelected={isSelectedDay}
      isRegistered={isRegistered}
      isPastDay={isPastDay}
      onClick={(event) => {
        // Only allow clicks on current month days that are not in the past
        if (isCurrentMonthDay && (!isPastDay || isTodayDay)) {
          onDateClick(day, event)
        }
      }}
    >
      <DayNumber
        variant="body2"
        sx={{
          backgroundColor: isTodayDay ? theme.palette.primary.main : "transparent",
          color: isTodayDay ? theme.palette.primary.contrastText : "inherit",
          fontWeight: isTodayDay || isSelectedDay ? "bold" : "normal",
        }}
      >
        {day.getDate()}
      </DayNumber>

      {/* Hiển thị thông tin cho admin/manager */}
      {(userRole === "ADMIN" || userRole === "WAREHOUSE_MANAGER") && isCurrentMonthDay && daySchedules.length > 0 && (
        <Box mt={3} display="flex" flexDirection="column" gap={0.5}>
          {/* Hiển thị số lượng theo trạng thái */}
          <Box display="flex" flexWrap="wrap" gap={0.5} mb={0.5}>
            {Object.entries(statusCounts).map(
              ([status, count]) =>
                count > 0 && (
                  <Box
                    key={status}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: statusColors[status],
                      color: "#fff",
                      borderRadius: "12px",
                      padding: "0 4px",
                      fontSize: "0.7rem",
                      height: "16px",
                      title: `${count} ${statusLabels[status]}`,
                    }}
                  >
                    <Box component="span" mr={0.5} fontSize="0.7rem">
                      •
                    </Box>
                    {count}
                  </Box>
                ),
            )}
          </Box>

          {/* Hiển thị các lịch làm việc (tối đa 3) */}
          <Box display="flex" flexWrap="wrap">
            {daySchedules.slice(0, 3).map((schedule, idx) => (
              <ScheduleChip
                key={idx}
                size="small"
                label={shiftLabels[schedule.shift]}
                variant="outlined"
                sx={{
                  borderColor: statusColors[schedule.status],
                  "& .MuiChip-label": { paddingLeft: "4px", paddingRight: "4px" },
                }}
              />
            ))}

            {/* Hiển thị số lịch còn lại */}
            {daySchedules.length > 3 && (
              <Chip
                size="small"
                label={`+${daySchedules.length - 3}`}
                variant="outlined"
                sx={{ margin: "2px", fontSize: "0.7rem", height: "24px" }}
              />
            )}
          </Box>
        </Box>
      )}

      {/* Hiển thị thông tin đăng ký cho driver */}
      {userRole === "DRIVER" && isCurrentMonthDay && isRegistered && driverSchedule && (
        <Box mt={3} display="flex" flexDirection="column" gap={0.5}>
          <Chip
            size="small"
            label={statusLabels[driverSchedule.status]}
            sx={{
              backgroundColor: statusColors[driverSchedule.status],
              color: "#fff",
              fontSize: "0.7rem",
              height: "20px",
            }}
          />
          <Typography variant="caption" sx={{ mt: 1 }}>
            {shiftLabels[driverSchedule.shift]}
          </Typography>
          <Typography variant="caption">
            {driverSchedule.startTime} - {driverSchedule.endTime}
          </Typography>
        </Box>
      )}

      {/* Hiển thị thông báo cho driver */}
      {userRole === "DRIVER" && isCurrentMonthDay && isPastDay && !isRegistered && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.6,
          }}
        >
          <Typography variant="caption" align="center" color="text.disabled">
            Ngày đã qua
          </Typography>
        </Box>
      )}
      {userRole === "DRIVER" && isCurrentMonthDay && !isPastDay && !isRegistered && (
        <Box
          sx={{
            display: "flex",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            opacity: 0.6,
          }}
        >
          <Typography variant="caption" align="center">
            Nhấp để đăng ký
          </Typography>
        </Box>
      )}
    </StyledDayCell>
  )
}
