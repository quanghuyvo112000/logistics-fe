import type React from "react"
import { useEffect } from "react"
import { Grid, TextField, Typography, Box, FormHelperText } from "@mui/material"
import { FormErrors, FormData,  LocationValue, Warehouse } from "../../types/order.type"
import { searchWarehouseLocations } from "../../services/order"
import LocationSelector from "../shared/LocationSelector"

interface ReceiverInformationProps {
  formData: FormData
  receiverLocation: LocationValue
  destinationWarehouses: Warehouse[]
  errors: FormErrors
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  setReceiverLocation: React.Dispatch<React.SetStateAction<LocationValue>>
  setDestinationWarehouses: React.Dispatch<React.SetStateAction<Warehouse[]>>
  setFormData: React.Dispatch<React.SetStateAction<FormData>>
}

const ReceiverInformation: React.FC<ReceiverInformationProps> = ({
  formData,
  receiverLocation,
  destinationWarehouses,
  errors,
  handleInputChange,
  setReceiverLocation,
  setDestinationWarehouses,
  setFormData,
}) => {
  // Fetch warehouses when receiver location changes
  useEffect(() => {
    const fetchDestinationWarehouses = async () => {
      if (receiverLocation.province && receiverLocation.district) {
        try {
          const response = await searchWarehouseLocations({
            province: receiverLocation.province,
            district: receiverLocation.district,
          })

          if (response.status === 200 && response.data) {
            setDestinationWarehouses(response.data)
            // Automatically select the first warehouse if available
            if (response.data.length > 0) {
              setFormData((prev) => ({
                ...prev,
                destinationWarehouseId: response.data[0].id,
              }))
            }
          }
        } catch (error) {
          console.error("Error fetching destination warehouses:", error)
        }
      } else {
        setDestinationWarehouses([])
        setFormData((prev) => ({
          ...prev,
          destinationWarehouseId: "",
        }))
      }
    }

    fetchDestinationWarehouses()
  }, [receiverLocation.province, receiverLocation.district, setFormData, setDestinationWarehouses])

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
        Thông tin người nhận
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Tên người nhận"
            name="receiverName"
            value={formData.receiverName}
            onChange={handleInputChange}
            error={!!errors.receiverName}
            helperText={errors.receiverName}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            required
            fullWidth
            label="Số điện thoại người nhận"
            name="receiverPhone"
            value={formData.receiverPhone}
            onChange={handleInputChange}
            error={!!errors.receiverPhone}
            helperText={errors.receiverPhone}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom>
            Địa chỉ người nhận
          </Typography>
          <LocationSelector value={receiverLocation} onChange={setReceiverLocation} />
          {errors.receiverAddress && <FormHelperText error>{errors.receiverAddress}</FormHelperText>}
        </Grid>
        <Grid size={{ xs: 12 }}>
          <Typography variant="subtitle2" gutterBottom>
            Kho nhận hàng
          </Typography>
          {destinationWarehouses.length > 0 ? (
            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#f9fafb" }}>
              <Typography variant="body1">
                {destinationWarehouses.find((w) => w.id === formData.destinationWarehouseId)?.warehouseName ||
                  "Không có kho phù hợp"}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ p: 2, border: "1px solid #e0e0e0", borderRadius: 1, bgcolor: "#f9fafb" }}>
              <Typography variant="body2" color="text.secondary">
                {receiverLocation.province && receiverLocation.district
                  ? "Không tìm thấy kho nhận hàng tại khu vực này"
                  : "Vui lòng chọn tỉnh/thành phố và quận/huyện để hiển thị kho nhận hàng"}
              </Typography>
            </Box>
          )}
          {errors.destinationWarehouseId && <FormHelperText error>{errors.destinationWarehouseId}</FormHelperText>}
        </Grid>
      </Grid>
    </>
  )
}

export default ReceiverInformation
