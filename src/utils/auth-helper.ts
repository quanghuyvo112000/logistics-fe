import { localStorageHelper } from "../components/shared/localStorageHelper"
import { UserRole } from "../types/calendar.types"
import { decryptData } from "./crypto"


/**
 * Get the current user's role from local storage
 * @returns The user role or null if not found
 */
export const getUserRole = (): UserRole | null => {
  try {
    const authDataString = localStorageHelper.getItem<string>("auth_token")
    if (!authDataString) return null

    const authData = JSON.parse(authDataString || "{}")
    const role = decryptData(authData.role)

    // Validate that the role is one of the expected values
    if (role === "ADMIN" || role === "WAREHOUSE_MANAGER" || role === "DRIVER" || role === "CUSTOMER") {
      return role as UserRole
    }

    return null
  } catch (error) {
    console.error("Error getting user role:", error)
    return null
  }
}

const authHelper = {
  decryptData,
  getUserRole,
}

export default authHelper
