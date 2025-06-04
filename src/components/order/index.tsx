import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import { showLoading, hideLoading } from "../shared/loadingHandler"; // dùng hàm toàn cục
import CreateOrderButton from "./CreateOrderButton";
import OrdersList from "./OrdersList";

const OrdersPage = () => {
  const refreshOrdersRef = useRef<(() => void) | undefined>(undefined);

  const handleOrderCreated = async () => {
    try {
      showLoading("Đang tải danh sách đơn hàng...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      if (refreshOrdersRef.current) {
        await refreshOrdersRef.current();
      }
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    handleOrderCreated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <Paper>
        <Box sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              Quản lý đơn hàng
            </Typography>
            <CreateOrderButton onOrderCreated={handleOrderCreated} />
          </Box>
          <OrdersList onRefreshRef={refreshOrdersRef} />
        </Box>
      </Paper>
    </Container>
  );
};

export default OrdersPage;
