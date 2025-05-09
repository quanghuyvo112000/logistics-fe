export const getStatusColor = (
    status: string
  ):
    | "default"
    | "primary"
    | "secondary"
    | "error"
    | "info"
    | "success"
    | "warning" => {
    switch (status) {
      case "CREATED":
        return "default";
      case "RECEIVED_AT_SOURCE":
        return "secondary";
      case "ASSIGNED_TO_SHIPPER":
        return "info";
      case "PICKED_UP_SUCCESSFULLY":
        return "success";
      case "LEFT_SOURCE":
        return "warning";
      case "AT_INTERMEDIATE":
        return "warning";
      case "LEFT_INTERMEDIATE":
        return "warning";
      case "AT_DESTINATION":
        return "primary";
      case "OUT_FOR_DELIVERY":
        return "secondary";
      case "DELIVERED_SUCCESSFULLY":
        return "success";
      case "DELIVERY_FAILED":
        return "error";
      default:
        return "default";
    }
  };

export const getStatusLabel = (status: string) => {
    switch (status) {
      case "CREATED":
        return "Đã tạo";
      case "RECEIVED_AT_SOURCE":
        return "Đã nhận tại kho nguồn";
      case "ASSIGNED_TO_SHIPPER":
        return "Đã giao cho shipper";
        case "PICKED_UP_SUCCESSFULLY":
          return "Shipper đã lấy hàng"
      case "LEFT_SOURCE":
        return "Đã rời kho nguồn";
      case "AT_INTERMEDIATE":
        return "Tại kho trung gian";
      case "LEFT_INTERMEDIATE":
        return "Đã rời kho trung gian";
      case "AT_DESTINATION":
        return "Đang ở kho giao";
      case "OUT_FOR_DELIVERY":
        return "Đang giao hàng";
      case "DELIVERED_SUCCESSFULLY":
        return "Giao hàng thành công";
      case "DELIVERY_FAILED":
        return "Giao hàng thất bại";
      default:
        return status;
    }
  };