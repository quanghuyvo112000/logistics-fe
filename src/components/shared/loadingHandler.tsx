import React, { useState } from "react";
import { CircularProgress, Backdrop } from "@mui/material";

interface LoadingHandlerProps {
  children: (
    showLoading: () => void,
    hideLoading: () => void
  ) => React.ReactNode;
}

const LoadingHandler: React.FC<LoadingHandlerProps> = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const showLoading = (): void => setLoading(true);
  const hideLoading = (): void => setLoading(false);

  return (
    <>
      {children(showLoading, hideLoading)}
      <Backdrop
        style={{zIndex: 1000}}
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </>
  );
};

export default LoadingHandler;
