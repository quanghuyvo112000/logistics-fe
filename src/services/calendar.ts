import { callApi } from "../components/shared/api"
import { CreateWorkScheduleRequest, UpdateWorkScheduleStatusRequest, WorkSchedule, WorkScheduleResponse, WorkScheduleStatus } from "../types/calendar.types"

// Get all schedules (admin or manager)
export const fetchWorkSchedules = async (): Promise<WorkSchedule[]> => {
  const response = await callApi<WorkScheduleResponse>('GET', 'work-schedules', undefined, true)
  return response.data
}

export const fetchWorkStatusSchedules = async (): Promise<WorkScheduleStatus[]> => {
  const response = await callApi<WorkScheduleResponse>('GET', 'work-schedules/manager-status', undefined, true)
  return response.data
}

// Get schedules for current driver
export const fetchMyWorkSchedules = async (): Promise<WorkSchedule[]> => {
  const response = await callApi<WorkScheduleResponse>('GET', 'work-schedules/me', undefined, true)
  return response.data
}

// Create a work schedule (for drivers)
export const createWorkSchedule = async (
  schedule: CreateWorkScheduleRequest
): Promise<WorkSchedule> => {
  const response = await callApi<{ status: number; message: string; data: WorkSchedule }>(
    'POST',
    'work-schedules',
    schedule,
    true
  )
  return response.data
}

// Update schedule status (for admin/manager)
export const updateWorkScheduleStatus = async (
  request: UpdateWorkScheduleStatusRequest
): Promise<WorkSchedule> => {
  const response = await callApi<{ status: number; message: string; data: WorkSchedule }>(
    'PUT',
    'work-schedules',
    request,
    true
  )
  return response.data
}
