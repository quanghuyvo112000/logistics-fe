/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Cancel,
  CheckCircle,
  Home,
  Receipt,
  Warning,
} from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { blue, green, orange, red } from "@mui/material/colors";
import type React from "react";
import { useEffect, useRef, useState } from "react";
import { createIncomeByTrackingCode } from "../../services/income";
import { updateShippingPaymentStatus } from "../../services/order";

// Types
interface VNPayParams {
  vnp_Amount?: string;
  vnp_TxnRef?: string;
  vnp_TransactionNo?: string;
  vnp_PayDate?: string;
  vnp_BankCode?: string;
  vnp_ResponseCode?: string;
  [key: string]: string | undefined;
}

// Utility functions
const formatAmount = (amount: string): string => {
  const numAmount = Number.parseInt(amount) / 100;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(numAmount);
};

const formatDate = (dateString: string): string => {
  if (dateString.length === 14) {
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    const hour = dateString.substring(8, 10);
    const minute = dateString.substring(10, 12);
    const second = dateString.substring(12, 14);

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  }
  return dateString;
};

// Mock API call - replace with your actual API
const verifyVnPayReturn = async (queryParams: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // Mock different responses based on query params
      if (queryParams.includes("vnp_ResponseCode=00")) {
        resolve("Thanh toán thành công!");
      } else if (queryParams.includes("vnp_ResponseCode=")) {
        const responseCode = queryParams.match(/vnp_ResponseCode=(\d+)/)?.[1];
        resolve(`Thanh toán thất bại với mã: ${responseCode}`);
      } else {
        reject(new Error("Invalid parameters"));
      }
    }, 2000);
  });
};

const VNPayReturnHandler: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transactionInfo, setTransactionInfo] = useState<VNPayParams | null>(
    null
  );

  const hasRunRef = useRef(false);

  useEffect(() => {
    const handleVNPayReturn = async (): Promise<void> => {
      if (hasRunRef.current) return; 
      hasRunRef.current = true;

      try {
        setLoading(true);

        const queryString: string = window.location.search;
        if (!queryString) {
          setError("Không tìm thấy thông tin thanh toán");
          return;
        }

        const urlParams = new URLSearchParams(queryString);
        const vnpayParams: VNPayParams = {};
        urlParams.forEach((value: string, key: string) => {
          (vnpayParams as any)[key] = value;
        });

        setTransactionInfo(vnpayParams);

        const response: string = await verifyVnPayReturn(queryString);
        setResult(response);

        if (vnpayParams.vnp_TxnRef) {
          await createIncomeByTrackingCode(vnpayParams.vnp_TxnRef);

          await new Promise((resolve) => setTimeout(resolve, 3000));

          await updateShippingPaymentStatus({
            trackingCode: vnpayParams.vnp_TxnRef,
          });
        }
      } catch (err) {
        console.error("VNPay verification error:", err);
        const errorMessage =
          err instanceof Error
            ? err.message
            : "Có lỗi xảy ra khi xác thực thanh toán";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    handleVNPayReturn();
  }, []);

  const handleGoHome = (): void => {
    window.location.href = "/dashboard";
  };

  const handleViewOrders = (): void => {
    window.location.href = "/orders";
  };

  const isSuccess: boolean = result !== null && result.includes("thành công");
  const isFailure: boolean = result !== null && result.includes("thất bại");

  if (loading) {
    return (
      <Container
        maxWidth="sm"
        sx={{
          minHeight: "100vh",
          minWidth: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Card elevation={3} sx={{ width: "100%", textAlign: "center" }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
              <CircularProgress size={80} sx={{ color: blue[500] }} />
            </Box>
            <Typography
              variant="h4"
              component="h2"
              gutterBottom
              sx={{ fontWeight: 600, color: "text.primary" }}
            >
              Đang xác thực thanh toán...
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Vui lòng chờ trong giây lát
            </Typography>
          </CardContent>
        </Card>
      </Container>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        minWidth: "1520px",
        backgroundColor: "#f5f5f5",
        px: 2,
      }}
    >
      <Card
        elevation={3}
        sx={{ width: "100%", maxWidth: 600, textAlign: "center" }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* Success State */}
          {isSuccess && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <CheckCircle sx={{ fontSize: 70, color: green[500] }} />
              </Box>
              <Typography
                variant="h5"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, color: green[600], mb: 2 }}
              >
                Thanh toán thành công!
              </Typography>
              <Chip
                label="Đã xác nhận"
                sx={{
                  bgcolor: green[100],
                  color: green[800],
                  fontWeight: 600,
                  mb: 3,
                }}
              />
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
                <p>Đơn hàng của bạn đang được xử lý.</p>
              </Typography>

              {/* Transaction Details */}
              {transactionInfo && (
                <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: "grey.50" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, textAlign: "left" }}
                  >
                    Thông tin giao dịch:
                  </Typography>
                  <Stack spacing={2}>
                    {transactionInfo.vnp_Amount && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Số tiền:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatAmount(transactionInfo.vnp_Amount)}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_TxnRef && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Mã đơn hàng:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transactionInfo.vnp_TxnRef}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_TransactionNo && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Mã giao dịch:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transactionInfo.vnp_TransactionNo}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_PayDate && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Thời gian:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatDate(transactionInfo.vnp_PayDate)}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_BankCode && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Ngân hàng:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transactionInfo.vnp_BankCode}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </>
          )}

          {/* Failure State */}
          {isFailure && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Cancel sx={{ fontSize: 100, color: red[500] }} />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, color: red[600], mb: 2 }}
              >
                Thanh toán thất bại
              </Typography>
              <Chip
                label="Không thành công"
                sx={{
                  bgcolor: red[100],
                  color: red[800],
                  fontWeight: 600,
                  mb: 3,
                }}
              />
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, mb: 1, color: "text.primary" }}
              >
                {result}
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                Vui lòng thử lại hoặc liên hệ hỗ trợ nếu vấn đề vẫn tiếp tục.
              </Typography>

              {/* Transaction Details for Failed Payment */}
              {transactionInfo && (
                <Paper elevation={1} sx={{ p: 3, mb: 4, bgcolor: "grey.50" }}>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, mb: 2, textAlign: "left" }}
                  >
                    Thông tin giao dịch:
                  </Typography>
                  <Stack spacing={2}>
                    {transactionInfo.vnp_ResponseCode && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Mã lỗi:
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{ fontWeight: 600, color: red[600] }}
                        >
                          {transactionInfo.vnp_ResponseCode}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_TxnRef && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Mã đơn hàng:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {transactionInfo.vnp_TxnRef}
                        </Typography>
                      </Box>
                    )}
                    {transactionInfo.vnp_Amount && (
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="body2" color="text.secondary">
                          Số tiền:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatAmount(transactionInfo.vnp_Amount)}
                        </Typography>
                      </Box>
                    )}
                  </Stack>
                </Paper>
              )}
            </>
          )}

          {/* Error State */}
          {error && (
            <>
              <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
                <Warning sx={{ fontSize: 100, color: orange[500] }} />
              </Box>
              <Typography
                variant="h3"
                component="h1"
                gutterBottom
                sx={{ fontWeight: 700, color: orange[600], mb: 4 }}
              >
                Có lỗi xảy ra
              </Typography>
              <Alert severity="error" sx={{ mb: 4, textAlign: "left" }}>
                {error}
              </Alert>
            </>
          )}

          {/* Action Buttons */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            justifyContent="center"
            sx={{ mt: 4 }}
          >
            <Button
              onClick={handleGoHome}
              variant="contained"
              startIcon={<Home />}
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                fontWeight: 600,
                bgcolor: blue[600],
                "&:hover": {
                  bgcolor: blue[700],
                },
              }}
            >
              Về trang chủ
            </Button>

            {isSuccess && (
              <Button
                onClick={handleViewOrders}
                variant="outlined"
                startIcon={<Receipt />}
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  borderColor: blue[600],
                  color: blue[600],
                  "&:hover": {
                    borderColor: blue[700],
                    bgcolor: blue[50],
                  },
                }}
              >
                Xem đơn hàng
              </Button>
            )}
          </Stack>

          {/* Additional Info */}
          {!isSuccess && !isFailure && !error && result && (
            <Alert severity="info" sx={{ mt: 4, textAlign: "left" }}>
              {result}
            </Alert>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default VNPayReturnHandler;
