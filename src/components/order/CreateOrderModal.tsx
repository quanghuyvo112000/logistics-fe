import { Alert, Box, Button, CircularProgress, Snackbar } from "@mui/material";
import type React from "react";
import { useEffect, useState } from "react";
import { createOrder } from "../../services/order";
import { FormData, FormErrors, LocationValue } from "../../types/order.type";
import CommonModal from "../shared/CommonModal";
import OrderDetails from "./OrderDetails";
import ReceiverInformation from "./ReceiverInformation";
import SenderInformation from "./SenderInformation";
import { useSnackbar } from "../../contexts/SnackbarContext";

interface CreateOrderModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const CreateOrderModal: React.FC<CreateOrderModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  // State for form data
  const [formData, setFormData] = useState<FormData>({
    sourceWarehouseId: "",
    destinationWarehouseId: "",
    senderPhone: "",
    senderAddress: "",
    receiverName: "",
    receiverPhone: "",
    receiverAddress: "",
    weight: "",
    orderPrice: "",
    shippingFee: "",
  });

  // State for location selectors
  const [senderLocation, setSenderLocation] = useState<LocationValue>({
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  const [receiverLocation, setReceiverLocation] = useState<LocationValue>({
    province: "",
    district: "",
    ward: "",
    address: "",
  });

  // State for warehouse options
  const [sourceWarehouses, setSourceWarehouses] = useState<
    { id: string; warehouseName: string }[]
  >([]);
  const [destinationWarehouses, setDestinationWarehouses] = useState<
    { id: string; warehouseName: string }[]
  >([]);

  // State for form validation
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const { showMessage } = useSnackbar();

  // Update sender address when location changes
  useEffect(() => {
    const fullAddress = [
      senderLocation.address,
      senderLocation.ward,
      senderLocation.district,
      senderLocation.province,
    ]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      senderAddress: fullAddress,
    }));
  }, [senderLocation]);

  // Update receiver address when location changes
  useEffect(() => {
    const fullAddress = [
      receiverLocation.address,
      receiverLocation.ward,
      receiverLocation.district,
      receiverLocation.province,
    ]
      .filter(Boolean)
      .join(", ");

    setFormData((prev) => ({
      ...prev,
      receiverAddress: fullAddress,
    }));
  }, [receiverLocation]);

  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error for this field
    if (errors[name as keyof FormErrors]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sourceWarehouseId) {
      newErrors.sourceWarehouseId = "Vui lòng chọn kho gửi hàng";
    }

    if (!formData.destinationWarehouseId) {
      newErrors.destinationWarehouseId = "Vui lòng chọn kho nhận hàng";
    }

    if (!formData.senderPhone) {
      newErrors.senderPhone = "Vui lòng nhập số điện thoại người gửi";
    } else if (!/^\d{10,11}$/.test(formData.senderPhone)) {
      newErrors.senderPhone = "Số điện thoại không hợp lệ";
    }

    if (!formData.senderAddress) {
      newErrors.senderAddress = "Vui lòng nhập địa chỉ người gửi";
    }

    if (!formData.receiverName) {
      newErrors.receiverName = "Vui lòng nhập tên người nhận";
    }

    if (!formData.receiverPhone) {
      newErrors.receiverPhone = "Vui lòng nhập số điện thoại người nhận";
    } else if (!/^\d{10,11}$/.test(formData.receiverPhone)) {
      newErrors.receiverPhone = "Số điện thoại không hợp lệ";
    }

    if (!formData.receiverAddress) {
      newErrors.receiverAddress = "Vui lòng nhập địa chỉ người nhận";
    }

    if (!formData.weight) {
      newErrors.weight = "Vui lòng nhập trọng lượng";
    } else if (isNaN(Number(formData.weight)) || Number(formData.weight) <= 0) {
      newErrors.weight = "Trọng lượng phải là số dương";
    }

    if (!formData.orderPrice) {
      newErrors.orderPrice = "Vui lòng nhập giá trị đơn hàng";
    } else if (
      isNaN(Number(formData.orderPrice)) ||
      Number(formData.orderPrice) < 0
    ) {
      newErrors.orderPrice = "Giá trị đơn hàng phải là số không âm";
    }

    if (!formData.shippingFee) {
      newErrors.shippingFee = "Vui lòng nhập phí vận chuyển";
    } else if (
      isNaN(Number(formData.shippingFee)) ||
      Number(formData.shippingFee) < 0
    ) {
      newErrors.shippingFee = "Phí vận chuyển phải là số không âm";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmitError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      // Tạo một đối tượng mới để gửi đến API
      const requestData = {
        sourceWarehouseId: formData.sourceWarehouseId,
        destinationWarehouseId: formData.destinationWarehouseId,
        senderPhone: formData.senderPhone,
        senderAddress: formData.senderAddress,
        receiverName: formData.receiverName,
        receiverPhone: formData.receiverPhone,
        receiverAddress: formData.receiverAddress,
        weight: Number(formData.weight),
        orderPrice: Number(formData.orderPrice),
        shippingFee: Number(formData.shippingFee),
      };

      const response = await createOrder(requestData);

      if (response) {
        showMessage("Đơn hàng đã được tạo thành công!", "success");
      } else {
        showMessage("Đã xảy ra lỗi khi tạo đơn hàng.", "error");
      }

      // Hiển thị thông báo thành công
      setSuccessMessage("Đơn hàng đã được tạo thành công!");

      // Reset form
      setFormData({
        sourceWarehouseId: "",
        destinationWarehouseId: "",
        senderPhone: "",
        senderAddress: "",
        receiverName: "",
        receiverPhone: "",
        receiverAddress: "",
        weight: "",
        orderPrice: "",
        shippingFee: "",
      });

      setSenderLocation({
        province: "",
        district: "",
        ward: "",
        address: "",
      });

      setReceiverLocation({
        province: "",
        district: "",
        ward: "",
        address: "",
      });


      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }

      // Đóng modal sau 1 giây để người dùng thấy thông báo thành công
      setTimeout(() => {
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error creating order:", error);
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại sau."
      );
    } finally {
      setLoading(false);
    }
  };

  // Reset form when modal closes
  const handleClose = () => {
    setFormData({
      sourceWarehouseId: "",
      destinationWarehouseId: "",
      senderPhone: "",
      senderAddress: "",
      receiverName: "",
      receiverPhone: "",
      receiverAddress: "",
      weight: "",
      orderPrice: "",
      shippingFee: "",
    });

    setSenderLocation({
      province: "",
      district: "",
      ward: "",
      address: "",
    });

    setReceiverLocation({
      province: "",
      district: "",
      ward: "",
      address: "",
    });

    setErrors({});
    setSubmitError(null);
    setSuccessMessage(null);
    onClose();
  };

  // Đóng thông báo thành công
  const handleCloseSuccessMessage = () => {
    setSuccessMessage(null);
  };

  return (
    <CommonModal
      open={open}
      onClose={handleClose}
      title="Tạo đơn hàng mới"
      maxWidth="md"
      disableActions
    >
      <Box component="form" noValidate sx={{ mt: 1 }}>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}

        <SenderInformation
          formData={formData}
          senderLocation={senderLocation}
          sourceWarehouses={sourceWarehouses}
          errors={errors}
          handleInputChange={handleInputChange}
          setSenderLocation={setSenderLocation}
          setSourceWarehouses={setSourceWarehouses}
          setFormData={setFormData}
        />

        <ReceiverInformation
          formData={formData}
          receiverLocation={receiverLocation}
          destinationWarehouses={destinationWarehouses}
          errors={errors}
          handleInputChange={handleInputChange}
          setReceiverLocation={setReceiverLocation}
          setDestinationWarehouses={setDestinationWarehouses}
          setFormData={setFormData}
        />

        <OrderDetails
          formData={formData}
          errors={errors}
          handleInputChange={handleInputChange}
          setFormData={setFormData}
          setErrors={setErrors}
        />

        <Box
          sx={{ display: "flex", justifyContent: "flex-end", mt: 4, gap: 2 }}
        >
          <Button onClick={handleClose} color="inherit">
            Hủy
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : null}
          >
            {loading ? "Đang xử lý..." : "Tạo đơn hàng"}
          </Button>
        </Box>
      </Box>

      {/* Thông báo thành công */}
      <Snackbar
        open={!!successMessage}
        autoHideDuration={3000}
        onClose={handleCloseSuccessMessage}
        message={successMessage}
      />
    </CommonModal>
  );
};

export default CreateOrderModal;
