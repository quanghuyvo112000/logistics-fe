export const getChartTitle = (statType: string) => {
  switch (statType) {
    case "monthly":
      return "Thống Kê Doanh Thu Theo Tháng"
    case "quarterly":
      return "Thống Kê Doanh Thu Theo Quý"
    case "warehouse":
      return "Thống Kê Doanh Thu Theo Kho"
    default:
      return "Thống Kê Doanh Thu"
  }
}