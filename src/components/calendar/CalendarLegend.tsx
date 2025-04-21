import { Box, Typography, useTheme } from "@mui/material"

// Status colors
const statusColors = {
  available: "#4caf50", // green
  working: "#1976d2", // blue
  dayOff: "#ff9800", // orange
  vacation: "#f44336", // red
}

// Status labels
const statusLabels = {
  available: "Sẵn sàng",
  working: "Đang làm việc",
  dayOff: "Nghỉ",
  vacation: "Nghỉ phép",
}

interface CalendarLegendProps {
  userRole: "ADMIN" | "WAREHOUSE_MANAGER" | "DRIVER"
  driversCount?: number
}

export const CalendarLegend = ({ userRole, driversCount = 0 }: CalendarLegendProps) => {
  const theme = useTheme()

  return (
    <Box mt={2} display="flex" justifyContent="space-between">
      <Box display="flex" gap={2}>
        {userRole === "DRIVER" ? (
          // Legend for driver
          <>
            <Box display="flex" alignItems="center">
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  backgroundColor: theme.palette.success.main,
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <Typography variant="caption">Đã đăng ký</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <Typography variant="caption">Hôm nay</Typography>
            </Box>
          </>
        ) : (
          // Legend for admin/manager
          Object.entries(statusColors).map(([status, color]) => (
            <Box key={status} display="flex" alignItems="center">
              <Box
                component="span"
                sx={{
                  display: "inline-block",
                  width: 12,
                  height: 12,
                  backgroundColor: color,
                  borderRadius: "50%",
                  mr: 1,
                }}
              />
              <Typography variant="caption">{statusLabels[status as keyof typeof statusLabels]}</Typography>
            </Box>
          ))
        )}
      </Box>
      <Box>
        <Typography variant="caption">
          {userRole === "DRIVER" ? "Nhấp vào ngày để đăng ký làm việc" : `Tổng số lịch: ${driversCount || 0}`}
        </Typography>
      </Box>
    </Box>
  )
}
