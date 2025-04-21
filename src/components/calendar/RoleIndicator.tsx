import { Box, Chip } from "@mui/material"
import { UserRole } from "../../types/calendar.types"

interface RoleIndicatorProps {
  userRole: UserRole
}

export const RoleIndicator = ({ userRole }: RoleIndicatorProps) => {
  // Map roles to display names and colors
  const roleConfig = {
    ADMIN: { label: "Admin", color: "error" as const },
    WAREHOUSE_MANAGER: { label: "Quản lý kho", color: "warning" as const },
    DRIVER: { label: "Tài xế", color: "success" as const },
  }

  const config = roleConfig[userRole] || roleConfig.DRIVER

  return (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 10,
        zIndex: 2,
      }}
    >
      <Chip size="small" color={config.color} label={config.label} />
    </Box>
  )
}
