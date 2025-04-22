import {
  Alert,
  Box,
  Container,
  Paper,
  Typography,
} from "@mui/material"
import { useEffect, useRef, useState } from "react"
import { fetchMyWorkSchedules, fetchWorkSchedules } from "../../services/calendar"
import { WorkingSchedule } from "../../types/calendar.types"
import authHelper from "../../utils/auth-helper"
import LoadingHandler from "../shared/loadingHandler"
import DriverCalendar from "./DriverCalendar"

export default function Schedules() {
  const [schedules, setSchedules] = useState<WorkingSchedule[]>([])
  const [error, setError] = useState<string | null>(null)
  const hasChecked = useRef(false)

  const userRole = authHelper.getUserRole() || "DRIVER" // Default fallback

  const loadSchedules = async (
    showLoading: () => void,
    hideLoading: () => void
  ) => {
    if (hasChecked.current) return
    hasChecked.current = true

    try {
      showLoading()

      let data: WorkingSchedule[] = []

      if (userRole === "DRIVER") {
        data = (await fetchMyWorkSchedules()).map(schedule => ({
          ...schedule,
          nameDriver: schedule.nameDriver || ""
        }))
      } else {
        data = (await fetchWorkSchedules()).map(schedule => ({
          ...schedule,
          nameDriver: schedule.nameDriver || ""
        }))
      }

      setSchedules(data)
    } catch (err) {
      if (err instanceof Error) {
        console.error("Failed to fetch schedules:", err.message)
        setError(err.message)

      }
    } finally {
      hideLoading()
    }
  }

  const handleScheduleChange = (updatedSchedules: WorkingSchedule[]) => {
    setSchedules(updatedSchedules)
  }

  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
          loadSchedules(showLoading, hideLoading)
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [])

        return (
          <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 4
                }}
              >
                <Typography variant="h4" component="h1" gutterBottom>
                  Lịch Làm Việc Tài Xế
                </Typography>
              </Box>

              <Typography variant="subtitle1" gutterBottom align="center" sx={{ mb: 4 }}>
                {userRole === "DRIVER"
                  ? "Nhấp vào ngày để đăng ký lịch làm việc"
                  : "Xem lịch làm việc của các tài xế theo ngày"}
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}

              {!error && (
                <Box sx={{ mt: 2 }}>
                  <DriverCalendar
                    userRole={userRole}
                    initialSchedules={schedules}
                    onScheduleChange={handleScheduleChange}
                  />
                </Box>
              )}
            </Paper>
          </Container>
        )
      }}
    </LoadingHandler>
  )
}
