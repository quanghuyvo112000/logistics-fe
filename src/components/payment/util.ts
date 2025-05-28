  export const formatAmount = (amount: string | undefined): string => {
    if (!amount) return '';
    const numAmount = parseInt(amount) / 100; // VNPay amount is in cents
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(numAmount);
  };

  export const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return '';
    // VNPay date format: yyyyMMddHHmmss
    const year = dateStr.substring(0, 4);
    const month = dateStr.substring(4, 6);
    const day = dateStr.substring(6, 8);
    const hour = dateStr.substring(8, 10);
    const minute = dateStr.substring(10, 12);
    const second = dateStr.substring(12, 14);
    
    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  };