import {
  KeyboardArrowDown as KeyboardArrowDownIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";
import { Chip, Collapse, IconButton, TableCell, TableRow } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Warehouse } from "../../types/warehouse.types";
import WarehouseDetails from "./WarehouseDetails";

const WarehouseRow = ({
  index,
  warehouse,
  fetchWarehouses,
  isChecked,
}: {
  index: number;
  warehouse: Warehouse;
  fetchWarehouses: () => void;
  isChecked: boolean;
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (isChecked) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [isChecked]);

  return (
    <React.Fragment>
      <TableRow sx={{ "& > *": { borderBottom: "unset" }, backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#ffffff", }}>
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
          {warehouse.code}
        </TableCell>
        <TableCell>{warehouse.name}</TableCell>
        <TableCell>{warehouse.province}</TableCell>
        <TableCell>{warehouse.phone}</TableCell>
        <TableCell>{warehouse.manager?.fullName ?? "N/A"}</TableCell>{" "}
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
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <WarehouseDetails
              warehouse={warehouse}
              fetchWarehouses={fetchWarehouses}
            />
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>
  );
};

export default WarehouseRow;
