import React from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ReportIcon from "@mui/icons-material/Report";
import { MonthlyOrderStatusGroupResponse } from "../../types/income.type";

interface Props {
  data: MonthlyOrderStatusGroupResponse | null;
}

const OrderStatsCards: React.FC<Props> = ({ data }) => {
  const time =
    data?.created[0]?.time ||
    data?.deliveredSuccessfully[0]?.time ||
    "Không có dữ liệu";

  const totalCreated = data?.created?.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );

  const totalDelivered = data?.deliveredSuccessfully?.reduce(
    (sum, item) => sum + item.totalOrders,
    0
  );

  return (
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {/* Đơn đã tạo */}
      <Grid size={{xs:12, sm:6}}>
        <Card sx={{ p: 2, backgroundColor: "#e3f2fd" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <AssignmentIcon sx={{ fontSize: 40, color: "#1976d2", mr: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                Đơn đã tạo ({time})
              </Typography>
              {totalCreated !== undefined && totalCreated !== null ? (
                <Typography variant="h4" color="primary" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {totalCreated}
                </Typography>
              ) : (
                <Typography color="textSecondary">
                  <ReportIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Không có dữ liệu
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>

      {/* Giao thành công */}
      <Grid size={{xs:12, sm:6}}>
        <Card sx={{ p: 2, backgroundColor: "#e8f5e9" }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <CheckCircleIcon sx={{ fontSize: 40, color: "#2e7d32", mr: 2 }} />
            <Box>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold", textAlign: "center" }}>
                Giao thành công ({time})
              </Typography>
              {totalDelivered !== undefined && totalDelivered !== null ? (
                <Typography variant="h4" color="success.main" sx={{ fontWeight: "bold", textAlign: "center" }}>
                  {totalDelivered}
                </Typography>
              ) : (
                <Typography color="textSecondary">
                  <ReportIcon sx={{ verticalAlign: "middle", mr: 1 }} />
                  Không có dữ liệu
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default OrderStatsCards;
