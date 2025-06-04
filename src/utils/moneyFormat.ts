export const formatCurrency = (value: number | string): string => {
  const number = Number(value);
  return number.toLocaleString("vi-VN");
};

export const unformatCurrency = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ""));
};

export const convertVehicleType = (vehicleType?: string): string => {
  switch (vehicleType) {
    case "MOTORBIKE":
      return "Xe máy";
    case "TRUCK":
      return "Xe tải lớn";
    case "VAN":
      return "Xe tải nhỏ";
    case "N/A":
      return "Không xác định";
    default:
      return vehicleType || "";
  }
};
