import { Box, IconButton, Typography, styled } from "@mui/material"
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Today as TodayIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { UserRole } from "../../types/calendar.types"

const StyledCalendarHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(2),
  padding: theme.spacing(1),
  borderBottom: `1px solid ${theme.palette.divider}`,
}))

interface CalendarHeaderProps {
  currentMonth: Date
  userRole: UserRole
  onPrevMonth: () => void
  onNextMonth: () => void
  onToday: () => void
}

export const CalendarHeader = ({ currentMonth, userRole, onPrevMonth, onNextMonth, onToday }: CalendarHeaderProps) => {
  return (
    <StyledCalendarHeader>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        {userRole === "DRIVER" ? "Đăng ký lịch làm việc" : "Lịch làm việc tài xế"}
      </Typography>
      <Box>
        <IconButton onClick={onPrevMonth}>
          <ChevronLeftIcon />
        </IconButton>
        <Typography variant="subtitle1" component="span" sx={{ mx: 2, fontWeight: "bold" }}>
          {format(currentMonth, "MMMM yyyy", { locale: vi }).charAt(0).toUpperCase() +
            format(currentMonth, "MMMM yyyy", { locale: vi }).slice(1)}
        </Typography>
        <IconButton onClick={onNextMonth}>
          <ChevronRightIcon />
        </IconButton>
        <IconButton onClick={onToday} sx={{ ml: 1 }}>
          <TodayIcon />
        </IconButton>
      </Box>
    </StyledCalendarHeader>
  )
}
