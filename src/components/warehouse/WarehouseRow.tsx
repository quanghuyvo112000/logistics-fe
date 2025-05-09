import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Chip, Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useState } from "react";
import { Warehouse } from "../../types/warehouse.types";
import WarehouseDetails from "./WarehouseDetails";

const WarehouseRow = ({ warehouse, fetchWarehouses }: { warehouse: Warehouse, fetchWarehouses: () => void }) => {
  const [open, setOpen] = useState(false);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">
          {warehouse.name}
        </TableCell>
        <TableCell>{warehouse.province}</TableCell>
        <TableCell>{warehouse.phone}</TableCell>
        <TableCell>
          {warehouse.manager?.fullName ?? "N/A"}
        </TableCell>{" "}
        <TableCell>
          <Chip
            size="small"
            label={`${warehouse.drivers.length} shipper(s)`}
            color={warehouse.drivers.length > 0 ? "primary" : "default"}
            variant={warehouse.drivers.length > 0 ? "filled" : "outlined"}
          />
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <WarehouseDetails warehouse={warehouse} fetchWarehouses={fetchWarehouses} />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default WarehouseRow;
