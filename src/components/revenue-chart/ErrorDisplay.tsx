import React from "react";
import { Alert, AlertTitle, Box, Button, Paper } from "@mui/material";

interface ErrorDisplayProps {
  error: string;
  onRetry: () => void;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, onRetry }) => (
  <Box
    maxWidth="md"
    mx="auto"
    my={4}
    component={Paper}
    elevation={3}
    sx={{ p: 4, borderRadius: 2 }}
  >
    <Alert severity="error" sx={{ mb: 2 }}>
      <AlertTitle>Lỗi</AlertTitle>
      {error}
    </Alert>
    <Button variant="contained" color="primary" onClick={onRetry}>
      Thử lại
    </Button>
  </Box>
);

export default ErrorDisplay;
