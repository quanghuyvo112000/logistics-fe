export interface LocationValue {
  province: string
  district: string
  ward: string
  address: string
}

export interface FormData {
  sourceWarehouseId: string
  destinationWarehouseId: string
  senderName: string
  senderPhone: string
  senderAddress: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  weight: string
  orderPrice: number
  shippingFee: string
  expectedDeliveryTime: string

  // pickupImage: File | null
}

export interface FormErrors {
  sourceWarehouseId?: string
  destinationWarehouseId?: string
  senderName?: string
  senderPhone?: string
  senderAddress?: string
  receiverName?: string
  receiverPhone?: string
  receiverAddress?: string
  weight?: string
  orderPrice?: string
  shippingFee?: string
  pickupImage?: string
}

export interface Warehouse {
  id: string
  warehouseName: string
}

export interface CreateOrderRequest {
  sourceWarehouseId: string
  destinationWarehouseId: string
  senderName: string
  senderPhone: string
  senderAddress: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  weight: number
  orderPrice: number
  shippingFee: number
  expectedDeliveryTime: string

}

export interface OrderResponse {
  status: number;
  message: string;
  data: Order[];
}

export interface Order {
  trackingCode: string;
  customerName: string;
  sourceWarehouseName: string;
  destinationWarehouseName: string;
  senderName: string;
  senderPhone: string;
  senderAddress: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  weight: number;
  orderPrice: number;
  shippingFee: number;
  pickupImage: string;
  deliveryImage: string;
  status: string;
  isSourceWarehouse?: boolean;
  isPickupDriverNull?: boolean;
  isDeliveryDriverNull?: boolean;
  warehouseManagerRole?: string;
  expectedDeliveryTime: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export interface AssignShipperRequest {
  trackingCode: string;
  driverId: string
}

export interface AssignWarehouseRequest {
  trackingCode: string;
}

export enum PaymentStatus {
    NOTPAID = "NOTPAID",
    PAID = "PAID"
}

export interface OrderConfirmPickupRequest {
  trackingCode: string;
  paymentStatus:string;
  pickupImage: File | null
}

export interface OrderConfirmDeliveryRequest {
  trackingCode: string;
  pickupImage: File | null
}