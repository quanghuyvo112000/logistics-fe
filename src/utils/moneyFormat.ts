export const formatCurrency = (value: number | string): string => {
  const number = Number(value);
  return number.toLocaleString('vi-VN');
};

export const unformatCurrency = (value: string): number => {
  return Number(value.replace(/[^\d]/g, ''));
};