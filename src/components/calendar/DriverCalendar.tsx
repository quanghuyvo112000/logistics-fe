import type React from "react";

import { Grid, Paper, styled } from "@mui/material";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  isBefore,
  isSameDay,
  isToday,
  parseISO,
  startOfMonth,
  subMonths,
} from "date-fns";
import { useEffect, useState } from "react";
import {
  createWorkSchedule,
  fetchMyWorkSchedules,
  fetchWorkSchedules,
  updateWorkScheduleStatus,
} from "../../services/calendar";
import {
  CreateWorkScheduleRequest,
  UpdateWorkScheduleStatusRequest,
  UserRole,
  WorkingSchedule,
} from "../../types/calendar.types";
import { hideLoading, showLoading } from "../shared/loadingHandler";
import { CalendarHeader } from "./CalendarHeader";
import { CalendarLegend } from "./CalendarLegend";
import { DayCell } from "./DayCell";
import { DriverPopover } from "./DriverPopover";
import { RegistrationDialog } from "./RegistrationDialog";
import { RoleIndicator } from "./RoleIndicator";
import { StatusUpdateDialog } from "./StatusUpdateDialog";
import { WeekDaysHeader } from "./WeekDaysHeader";

// Styled components
const CalendarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  backgroundColor: "#fff",
  width: "100%",
  maxWidth: "900px",
  margin: "0 auto",
  position: "relative",
  "&:before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: 0,
    width: "20px",
    height: "100%",
    background:
      "linear-gradient(90deg, rgba(0,0,0,0.03) 0%, rgba(0,0,0,0) 100%)",
    zIndex: 1,
    pointerEvents: "none",
  },
}));

interface DriverCalendarProps {
  userRole: UserRole;
  initialSchedules?: WorkingSchedule[];
  onScheduleChange?: (schedules: WorkingSchedule[]) => void;
}

const DriverCalendar = ({
  userRole,
  initialSchedules,
  onScheduleChange,
}: DriverCalendarProps) => {
  // State
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [selectedDaySchedules, setSelectedDaySchedules] = useState<
    WorkingSchedule[]
  >([]);
  const [registrationDialogOpen, setRegistrationDialogOpen] =
    useState<boolean>(false);
  const [statusUpdateDialogOpen, setStatusUpdateDialogOpen] =
    useState<boolean>(false);
  const [registrationDate, setRegistrationDate] = useState<Date | null>(null);
  const [selectedSchedule, setSelectedSchedule] =
    useState<WorkingSchedule | null>(null);
  const [schedules, setSchedules] = useState<WorkingSchedule[]>(
    initialSchedules || []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);

  // Fetch schedules on component mount
  useEffect(() => {
    if (!initialSchedules) {
      fetchSchedules();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialSchedules]);

  // Update schedules when initialSchedules changes
  useEffect(() => {
    if (initialSchedules) {
      setSchedules(initialSchedules);
    }
  }, [initialSchedules]);

  // Fetch schedules from API
  const fetchSchedules = async () => {
    showLoading();
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setError(null);

    try {
      let data: WorkingSchedule[];

      // Use different API endpoint based on user role
      if (userRole === "DRIVER") {
        data = (await fetchMyWorkSchedules()).map((schedule) => ({
          ...schedule,
          nameDriver: schedule.nameDriver || "Unknown Driver",
        }));
        console.log("Driver schedules:", data); // Debug log
      } else {
        data = (await fetchWorkSchedules()).map((schedule) => ({
          ...schedule,
          nameDriver: schedule.nameDriver || "Unknown Driver",
        }));
      }

      setSchedules(data);
      if (onScheduleChange) {
        onScheduleChange(data);
      }
    } catch (err) {
      setError("Failed to fetch schedules");
      console.error(err);
    } finally {
      hideLoading();
    }
  };

  // Danh sách các ngày trong tuần
  const weekDays = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];

  // Ngày trong tháng hiện tại
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  // Ngày đầu tiên trong tháng (0 = Chủ nhật, 1 = Thứ 2, ..., 6 = Thứ 7)
  const startDay = startOfMonth(currentMonth).getDay();

  // Hàm xử lý tháng tiếp theo
  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Hàm xử lý tháng trước
  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  // Hàm xử lý quay về tháng hiện tại
  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  // Hàm xử lý khi click vào một ngày
  const handleDateClick = (day: Date, event: React.MouseEvent<HTMLElement>) => {
    // Kiểm tra xem ngày có phải là ngày trong quá khứ không
    const isPastDay = isBefore(day, new Date()) && !isToday(day);

    // Không cho phép chọn ngày trong quá khứ
    if (isPastDay) return;

    setSelectedDate(day);

    if (userRole === "DRIVER") {
      // Check if the day already has a schedule
      const daySchedules = schedules.filter((schedule) => {
        try {
          return isSameDay(parseISO(schedule.workDate), day);
        } catch (error) {
          console.error("Error parsing date:", schedule.workDate, error);
          return false;
        }
      });

      // If there are already schedules for this day, show them in a popover
      if (daySchedules.length > 0) {
        setSelectedDaySchedules(daySchedules);
        setAnchorEl(event.currentTarget);
      } else {
        // Otherwise, open the registration dialog
        setRegistrationDate(day);
        setRegistrationDialogOpen(true);
      }
    } else {
      // Hiển thị popover cho admin/manager
      const daySchedules = schedules.filter((schedule) => {
        try {
          return isSameDay(parseISO(schedule.workDate), day);
        } catch (error) {
          console.error("Error parsing date:", schedule.workDate, error);
          return false;
        }
      });

      setSelectedDaySchedules(daySchedules);

      if (daySchedules.length > 0) {
        setAnchorEl(event.currentTarget);
      }
    }
  };

  // Hàm đóng popover
  const handleClosePopover = () => {
    setAnchorEl(null);
  };

  // Hàm xử lý đăng ký lịch làm việc cho driver
  const handleRegisterWork = async (
    scheduleData: CreateWorkScheduleRequest
  ) => {
    try {
      setLoading(true);
      showLoading();
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newSchedule = await createWorkSchedule(scheduleData);

      const updatedSchedules = [...schedules, newSchedule];
      setSchedules(updatedSchedules);

      if (onScheduleChange) {
        onScheduleChange(updatedSchedules);
      }

      setRegistrationDialogOpen(false);
      setRegistrationDate(null);
    } catch (err) {
      console.error("Failed to register work schedule:", err);
      setError("Failed to register work schedule");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  // Hàm xử lý hủy đăng ký lịch làm việc

  // Hàm mở dialog cập nhật trạng thái
  const handleOpenStatusUpdate = (schedule: WorkingSchedule) => {
    setSelectedSchedule(schedule);
    setStatusUpdateDialogOpen(true);
    handleClosePopover(); // Close the popover
  };

  // Hàm xử lý cập nhật trạng thái
  const handleUpdateStatus = async (
    request: UpdateWorkScheduleStatusRequest
  ) => {
    try {
      setLoading(true);
      showLoading();
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const updatedSchedule = await updateWorkScheduleStatus(request);

      // Update the schedule in the state
      const updatedSchedules = schedules.map((schedule) =>
        schedule.id === updatedSchedule.id ? updatedSchedule : schedule
      );
      setSchedules(updatedSchedules);

      if (onScheduleChange) {
        onScheduleChange(updatedSchedules);
      }

      setStatusUpdateDialogOpen(false);
      setSelectedSchedule(null);
    } catch (err) {
      console.error("Failed to update work schedule status:", err);
      setError("Failed to update work schedule status");
    } finally {
      setLoading(false);
      hideLoading();
    }
  };

  // Render các ngày trong tháng
  const renderDays = () => {
    const totalSlots = Math.ceil((daysInMonth.length + startDay) / 7) * 7;
    const daySlots = [];

    for (let i = 0; i < totalSlots; i++) {
      const dayIndex = i - startDay;
      const dayDate =
        dayIndex >= 0 && dayIndex < daysInMonth.length
          ? daysInMonth[dayIndex]
          : new Date(
              currentMonth.getFullYear(),
              currentMonth.getMonth(),
              dayIndex + 1
            );

      daySlots.push(
        <Grid size={{ xs: 12 / 7 }} key={i}>
          <DayCell
            day={dayDate}
            currentMonth={currentMonth}
            selectedDate={selectedDate}
            userRole={userRole}
            schedules={schedules}
            onDateClick={handleDateClick}
          />
        </Grid>
      );
    }

    return daySlots;
  };

  return (
    <CalendarContainer>
      {/* Role indicator */}
      <RoleIndicator userRole={userRole} />

      {/* Calendar Header */}
      <CalendarHeader
        currentMonth={currentMonth}
        userRole={userRole}
        onPrevMonth={handlePrevMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />

      {/* Week Days Header */}
      <WeekDaysHeader weekDays={weekDays} />

      {/* Calendar Grid */}
      <Grid container>{renderDays()}</Grid>

      {/* Calendar Legend */}
      <CalendarLegend userRole={userRole} />

      {/* Driver Popover for admin/manager */}
      {(userRole === "ADMIN" || userRole === "WAREHOUSE_MANAGER") && (
        <DriverPopover
          anchorEl={anchorEl}
          selectedDate={selectedDate}
          selectedDaySchedules={selectedDaySchedules}
          userRole={userRole}
          onClose={handleClosePopover}
          onUpdateStatus={handleOpenStatusUpdate}
        />
      )}

      {/* Registration Dialog for driver */}
      {userRole === "DRIVER" && (
        <RegistrationDialog
          open={registrationDialogOpen}
          registrationDate={registrationDate}
          onClose={() => setRegistrationDialogOpen(false)}
          onConfirm={handleRegisterWork}
          loading={loading}
        />
      )}

      {/* Status Update Dialog for admin/manager */}
      {(userRole === "ADMIN" || userRole === "WAREHOUSE_MANAGER") && (
        <StatusUpdateDialog
          open={statusUpdateDialogOpen}
          schedule={selectedSchedule}
          onClose={() => setStatusUpdateDialogOpen(false)}
          onConfirm={handleUpdateStatus}
          loading={loading}
        />
      )}
    </CalendarContainer>
  );
};

export default DriverCalendar;
