// Hàm kiểm tra tính hợp lệ của email
export function checkValidateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Hàm kiểm tra tính hợp lệ của số điện thoại
export function checkValidatePhoneNumber(phoneNumber: string): boolean {
    const phoneRegex = /^\d{10,}$/;
    return phoneRegex.test(phoneNumber);
}

// Hàm kiểm tra tính hợp lệ của ngày sinh (phải trên 18 tuổi)
export function checkValidateBirthday(birthday: string): boolean {
    const birthDate = new Date(birthday);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    const dayDifference = today.getDate() - birthDate.getDate();

    if (
        age > 18 ||
        (age === 18 && (monthDifference > 0 || (monthDifference === 0 && dayDifference >= 0)))
    ) {
        return true;
    }
    return false;
}

// Hàm tiện ích để định dạng Date thành chuỗi yyyy-MM-dd
export const formatDateToYMD = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, "0");
    const day = `${date.getDate()}`.padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  