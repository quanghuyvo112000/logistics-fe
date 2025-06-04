export interface Driver {
  fullName: string;
  email: string;
  phone: string;
  birthday: string;
  province: string;
  district: string;
  ward: string;
  address: string;
  role: string;
  vehicleType: string;
  vehiclePlate: string;
  createdAt: string | null;
  updatedAt: string | null;
  warehouseName?: string;
}