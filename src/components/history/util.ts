import { Package, Truck, CheckCircle, Home, ArrowRight, MapPin, Clock, type LucideIcon } from "lucide-react"

export const statusColorMap: Record<string, "success" | "info" | "warning" | "error" | "primary" | "secondary"> = {
  CREATED: "primary",
  ASSIGNED_TO_SHIPPER: "info",
  PICKED_UP_SUCCESSFULLY: "success",
  RECEIVED_AT_SOURCE: "info",
  LEFT_SOURCE: "warning",
  AT_DESTINATION: "info",
  OUT_FOR_DELIVERY: "warning",
  DELIVERED_SUCCESSFULLY: "success",
}

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case "CREATED":
      return "Đã tạo";
    case "ASSIGNED_TO_SHIPPER":
      return "Đã giao cho shipper";
    case "PICKED_UP_SUCCESSFULLY":
      return "Shipper đã lấy hàng";
    case "RECEIVED_AT_SOURCE":
      return "Đã nhận tại kho nguồn";
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
      return status
  }
};


export const getStatusIcon = (status: string): LucideIcon => {
  const iconMap: Record<string, LucideIcon> = {
    CREATED: Package,
    ASSIGNED_TO_SHIPPER: Clock,
    PICKED_UP_SUCCESSFULLY: CheckCircle,
    RECEIVED_AT_SOURCE: Home,
    LEFT_SOURCE: ArrowRight,
    AT_DESTINATION: MapPin,
    OUT_FOR_DELIVERY: Truck,
    DELIVERED_SUCCESSFULLY: CheckCircle,
  }

  return iconMap[status] || Package
}
