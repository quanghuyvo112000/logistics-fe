export interface Driver {
    id: string
    name: string
    avatar?: string
  }
  
  // Updated to match the API response
  export interface WorkingSchedule {
    nameDriver?: string
    id: string
    workDate: string
    startTime: string
    endTime: string
    shift: "MORNING" | "AFTERNOON" | "EVENING" | "NIGHT"
    status: "PENDING" | "APPROVED" | "REJECTED" | "COMPLETED" | "CANCELLED"
    note: string
    createdAt: string
    updatedAt: string
    driverId?: string // We'll add this for compatibility with existing code
  }
  
  // Updated user roles
  export type UserRole = "DRIVER" | "ADMIN" | "WAREHOUSE_MANAGER"
  
  // Map for shift display names
  export const shiftLabels: Record<string, string> = {
    MORNING: "Sáng",
    AFTERNOON: "Chiều",
    EVENING: "Tối",
    NIGHT: "Đêm",
  }
  
  // Map for status display names
  export const statusLabels: Record<string, string> = {
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Từ chối",
    COMPLETED: "Hoàn thành",
    CANCELLED: "Đã hủy",
  }
  
  // Map for status colors
  export const statusColors: Record<string, string> = {
    PENDING: "#ff9800", // orange
    APPROVED: "#4caf50", // green
    REJECTED: "#f44336", // red
    COMPLETED: "#1976d2", // blue
    CANCELLED: "#9e9e9e", // grey
  }

  export interface WorkScheduleResponse {
    status: number
    message: string
    data: WorkSchedule[]
  }
  
  export interface WorkSchedule {
    id: string
    nameDriver?: string
    workDate: string
    startTime: string
    endTime: string
    shift: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'
    status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'COMPLETED' | 'CANCELLED'
    note: string
    createdAt: string
    updatedAt: string
    driverId?: string
  }

  export interface WorkScheduleStatus {
    driverId?: string
    nameDriver?: string
    vehicleType?: string
  }
  export interface CreateWorkScheduleRequest {
    workDate: string
    startTime: string
    endTime: string
    shift: 'MORNING' | 'AFTERNOON' | 'EVENING' | 'NIGHT'
    note: string
  }
  
  export interface UpdateWorkScheduleStatusRequest {
    scheduleId: string
    status: 'APPROVED' | 'REJECTED'
  }
  