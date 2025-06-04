import React from "react";
import { Alert, Box } from "@mui/material";

const NoDataMessage: React.FC = () => (
  <Box my={2}>
    <Alert severity="info">Không có dữ liệu để hiển thị</Alert>
  </Box>
);

export default NoDataMessage;
