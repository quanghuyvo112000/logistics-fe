import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import { StatType, TimeAmount, WarehouseAmount } from "../../types/income.type";
import { formatCurrency } from "../../utils/moneyFormat";

interface DataTableProps {
  data: TimeAmount[];
  warehouseData: WarehouseAmount[];
  statType: StatType;
}

const DataTable: React.FC<DataTableProps> = ({ data, warehouseData, statType }) => {
  return (
    <TableContainer component={Paper} sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ m: 2, color: "text.primary", fontWeight: 600 }}>
        Chi tiết dữ liệu
      </Typography>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 600, textTransform: "uppercase" }}>
              {statType === "warehouse" ? "Thời gian" : "Thời gian"}
            </TableCell>
            <TableCell sx={{ fontWeight: 600, textTransform: "uppercase" }}>Doanh thu</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {statType === "warehouse"
            ? warehouseData.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{item.time}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))
            : data.map((item, index) => (
                <TableRow key={index} hover>
                  <TableCell>{item.time}</TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>{formatCurrency(item.amount)}</TableCell>
                </TableRow>
              ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default DataTable;
