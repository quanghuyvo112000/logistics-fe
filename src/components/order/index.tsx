import { Box, Container, Paper, Typography } from "@mui/material";
import { useEffect, useRef } from "react";
import LoadingHandler from "../shared/loadingHandler";
import CreateOrderButton from "./CreateOrderButton";
import OrdersList from "./OrdersList";

const OrdersPage = () => {
  const refreshOrdersRef = useRef<(() => void) | undefined>(undefined);
  return (
    <LoadingHandler>
      {(showLoading, hideLoading) => {
        const handleOrderCreated = async () => {
          try {
            showLoading();
            if (refreshOrdersRef.current) {
              await refreshOrdersRef.current(); 
            }
          } finally {
            hideLoading();
          }
        };

        // eslint-disable-next-line react-hooks/rules-of-hooks
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
                  <Typography variant="h5">Quản lý đơn hàng</Typography>
                  <CreateOrderButton onOrderCreated={handleOrderCreated} />
                </Box>
                <OrdersList onRefreshRef={refreshOrdersRef} />
              </Box>
            </Paper>
          </Container>
        );
      }}
    </LoadingHandler>
  );
};

export default OrdersPage;
