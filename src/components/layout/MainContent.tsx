import { Box } from '@mui/material';
import { ReactNode, useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { introspectToken } from '../../services/MethodPost/IntrospectToken';
import { logout } from '../../services/MethodPost/LogoutService';
import { refreshToken } from '../../services/MethodPost/RefreshToken';
import { localStorageHelper } from '../shared/localStorageHelper';

interface Props {
  drawerWidth: number;
  children: ReactNode;
}

const MainContent = ({ drawerWidth, children }: Props) => {
  const navigate = useNavigate();
  const hasCheckedToken = useRef(false);

  const handleLogout = useCallback(async () => {
    try {
      const response = await logout();
      console.log("🚪 Logout:", response.message);
    } catch (error) {
      console.error("❌ Logout failed:", error);
    } finally {
      navigate("/authentication");
    }
  }, [navigate]);

  const refreshAuthToken = useCallback(
    async (currentToken: string, authData: unknown) => {
      try {
        console.log("🔁 Refreshing token...");
        const newToken = await refreshToken(currentToken);

        const updatedAuthData = {
          ...(typeof authData === 'object' && authData !== null ? authData : {}),
          token: newToken,
        };

        localStorageHelper.setItem("auth_token", JSON.stringify(updatedAuthData));
        console.log("✅ Token refreshed successfully.");
      } catch (error) {
        console.error("❌ Error refreshing token:", error);
        handleLogout();
      }
    },
    [handleLogout]
  );

  useEffect(() => {
    const checkAuthToken = async () => {
      if (hasCheckedToken.current) return;
      hasCheckedToken.current = true;

      const authDataString = localStorageHelper.getItem<string>("auth_token");
      const authData = JSON.parse(authDataString || "{}");

      if (!authData?.token) {
        handleLogout();
        return;
      }

      try {
        console.log("🔍 Validating token...");
        const result = await introspectToken(authData.token);

        if (result.status === 200 && result.data === true) {
          console.log("✅ Token is valid.");
          return;
        }

        console.warn("⚠️ Token invalid or expired.");
        if (authData.rememberMe === "true") {
          await refreshAuthToken(authData.token, authData);
        } else {
          handleLogout();
        }
      } catch (error) {
        console.error("❌ Error validating token:", error);
        handleLogout();
      }
    };

    checkAuthToken();
  }, [handleLogout, refreshAuthToken]);

  return (
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        p: 3,
        mt: '64px',
        ml: `${drawerWidth}px`,
        minHeight: 'calc(100vh - 64px - 48px)',
        minWidth: `calc(99vw - ${drawerWidth}px)`,
        mb: '48px',
      }}
    >
      {children}
    </Box>
  );
};

export default MainContent;
