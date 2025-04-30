import type React from "react"
import { useState } from "react"
import { Button } from "@mui/material"
import { Add } from "@mui/icons-material"
import CreateOrderModal from "./CreateOrderModal"

interface OrderButtonProps {
  onOrderCreated?: () => void
}

const CreateOrderButton: React.FC<OrderButtonProps> = ({ onOrderCreated }) => {
  const [open, setOpen] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const handleSuccess = () => {
    if (onOrderCreated) {
      onOrderCreated()
    }
  }

  return (
    <>
      <Button variant="contained" color="primary" startIcon={<Add />} onClick={handleOpen}>
        Tạo đơn hàng mới
      </Button>
      <CreateOrderModal open={open} onClose={handleClose} onSuccess={handleSuccess} />
    </>
  )
}

export default CreateOrderButton