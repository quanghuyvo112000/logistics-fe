import {
  DirectionsCar as DirectionsCarIcon,
  LocationOn as LocationOnIcon,
  Person as PersonIcon,
  Phone as PhoneIcon,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { format } from "date-fns";
import { useState } from "react";
import { Warehouse } from "../../types/warehouse.types";
import AddManagerModal from "./AddManagerModal";
import { localStorageHelper } from "../shared/localStorageHelper";
import { decryptData } from "../../utils/crypto";
import AddDriverModal from "./AddDriverModal";

// Component for row details (expanded content)
const WarehouseDetails = ({ warehouse, fetchWarehouses }: { warehouse: Warehouse, fetchWarehouses: () => void }) => {
  const [isAddManagerModalOpen, setIsAddManagerModalOpen] = useState<boolean>(false);
  const [isAddDriverModalOpen, setIsAddDriverModalOpen] = useState<boolean>(false);

  const handleOpenManagerModal = () => setIsAddManagerModalOpen(true);
  const handleCloseManagerModal = () => setIsAddManagerModalOpen(false);

  const handleOpenDriverModal = () => setIsAddDriverModalOpen(true);
  const handleCloseDriverModal = () => setIsAddDriverModalOpen(false);

  const authDataString = localStorageHelper.getItem<string>("auth_token");
  const authData = JSON.parse(authDataString || "{}");
  const role = decryptData(authData.role);


  const formatDate = (dateString: string | null): string => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch {
      return dateString;
    }
  };

  const formatAddress = (warehouse: Warehouse): string => {
    return [
      warehouse.address,
      warehouse.ward,
      warehouse.district,
      warehouse.province,
    ]
      .filter(Boolean)
      .join(", ");
  };

  return (
    <Box sx={{ margin: 1 }}>
      <Typography variant="h6" gutterBottom component="div">
        Warehouse Details
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <LocationOnIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Location Information
              </Typography>
            </Box>
            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Full Address:</strong> {formatAddress(warehouse)}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Contact Phone:</strong> {warehouse.phone}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Created:</strong> {formatDate(warehouse.createdAt)}
              </Typography>
              <Typography variant="body2">
                <strong>Last Updated:</strong> {formatDate(warehouse.updatedAt)}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <PersonIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Manager Information
              </Typography>

              <Button
                disabled={!!warehouse.manager || role !== "ADMIN"}
                variant="contained"
                size="small"
                onClick={handleOpenManagerModal}
              >
                Add Manager
              </Button>

              <AddManagerModal
                open={isAddManagerModalOpen}
                onClose={handleCloseManagerModal}
                data={warehouse.id}
                fetchWarehouses={fetchWarehouses}
              />
            </Box>

            <Box sx={{ ml: 4 }}>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Name:</strong> {warehouse.manager?.fullName ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Email:</strong> {warehouse.manager?.email ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Phone:</strong> {warehouse.manager?.phone ?? "N/A"}
              </Typography>
              <Typography variant="body2" sx={{ mb: 1 }}>
                <strong>Birthday:</strong>{" "}
                {formatDate(warehouse.manager?.birthday ?? null)}
              </Typography>
              <Typography variant="body2">
                <strong>Address:</strong>{" "}
                {[
                  warehouse.manager?.address ?? "N/A",
                  warehouse.manager?.ward ?? "N/A",
                  warehouse.manager?.district ?? "N/A",
                  warehouse.manager?.province ?? "N/A",
                ]
                  .filter(Boolean)
                  .join(", ")}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                px: 1,
                py: 1,
                mb: 2,
                borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ mb: 2, fontWeight: "bold" }}
              >
                <DirectionsCarIcon sx={{ mr: 1, verticalAlign: "bottom" }} />
                Drivers ({warehouse.drivers.length})
              </Typography>
              <Button 
              variant="contained" 
              size="small" 
              onClick={handleOpenDriverModal}>
                Add Driver
              </Button>
              <AddDriverModal
                open={isAddDriverModalOpen}
                onClose={handleCloseDriverModal}
                data={warehouse.id}
                fetchWarehouses={fetchWarehouses}
               />
            </Box>

            {warehouse.drivers.length > 0 ? (
              <TableContainer
                component={Paper}
                elevation={0}
                variant="outlined"
              >
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold" }}>Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Contact</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Vehicle</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Address</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {warehouse.drivers.map((driver, idx) => (
                      <TableRow key={idx}>
                        <TableCell>
                          <Typography variant="body2">
                            {driver?.fullName ?? "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Birthday: {formatDate(driver?.birthday ?? null)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            sx={{ display: "flex", alignItems: "center" }}
                          >
                            <PhoneIcon fontSize="small" sx={{ mr: 0.5 }} />{" "}
                            {driver?.phone ?? "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            {driver?.email ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {driver?.vehicleType ?? "N/A"}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            Plate: {driver?.vehiclePlate ?? "N/A"}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            variant="body2"
                            noWrap
                            sx={{ maxWidth: 600 }}
                          >
                            {[
                              driver?.address ?? "N/A",
                              driver?.ward ?? "N/A",
                              driver?.district ?? "N/A",
                              driver?.province ?? "N/A",
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography variant="body2" color="textSecondary">
                No drivers assigned to this warehouse.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default WarehouseDetails;
