import {
  Alert,
  Box,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { getAllWarehouse, getWarehouse } from "../../services/warehouse";
import { Warehouse } from "../../types/warehouse.types";
import authHelper from "../../utils/auth-helper";
import { hideLoading, showLoading } from "../shared/loadingHandler";
import WarehouseRow from "./WarehouseRow";

const WarehouseList: React.FC = () => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [filteredWarehouses, setFilteredWarehouses] = useState<Warehouse[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [isChecked, setIsChecked] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const hasChecked = useRef(false);

  const userRole = authHelper.getUserRole() as
    | "ADMIN"
    | "WAREHOUSE_MANAGER"
    | "CUSTOMER"
    | "DRIVER"
    | null;

  const fetchWarehouses = async () => {
    try {
      let result: Warehouse[] = [];

      if (userRole === "ADMIN") {
        const response = await getAllWarehouse();
        result = response.data;
      } else if (userRole === "WAREHOUSE_MANAGER") {
        const response = await getWarehouse();
        result = response.data ? [response.data] : [];
        setIsChecked(true);
      }

      setWarehouses(result);
      setFilteredWarehouses(result);
    } catch (err) {
      console.error("Error loading warehouses:", err);
      setError(err instanceof Error ? err.message : "Đã xảy ra lỗi bất ngờ");
    }
  };

  const loadWarehouses = async () => {
    if (hasChecked.current) return;
    hasChecked.current = true;
    try {
      showLoading("Đang tải danh sách kho...");
      await new Promise((resolve) => setTimeout(resolve, 1000));

      await fetchWarehouses();
    } finally {
      hideLoading();
    }
  };

  useEffect(() => {
    loadWarehouses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    const lowerTerm = term.toLowerCase();

    const filtered = warehouses.filter(
      (warehouse) =>
        warehouse.name.toLowerCase().includes(lowerTerm) ||
        warehouse.province.toLowerCase().includes(lowerTerm) ||
        warehouse.code.toLowerCase().includes(lowerTerm)
    );
    setFilteredWarehouses(filtered);
    setPage(0);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (error) {
    return (
      <Container maxWidth="lg">
        <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Paper>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            py: 2,
            borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="h5" component="h2" sx={{ fontWeight: "bold" }}>
            Địa điểm kho
          </Typography>

          <TextField
            label="Tìm kiếm tên hoặc mã kho"
            size="small"
            value={searchTerm}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </Box>

        <TableContainer>
          <Table aria-label="collapsible table">
            <TableHead>
              <TableRow>
                <TableCell width="2px" />
                <TableCell sx={{ fontWeight: "bold" }}>Mã kho hàng</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Tên kho</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Khu vực</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Điện thoại</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Quản lý</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>
                  Nhân viên giao hàng
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredWarehouses
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((warehouse, index) => (
                  <WarehouseRow
                    index={index}
                    key={warehouse.id}
                    warehouse={warehouse}
                    fetchWarehouses={fetchWarehouses}
                    isChecked={isChecked}
                  />
                ))}

              {filteredWarehouses.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      Không tìm thấy kho nào
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredWarehouses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Container>
  );
};

export default WarehouseList;
