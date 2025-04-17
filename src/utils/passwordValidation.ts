
export const passwordRequirements = [
  { regex: /[a-z]/, message: "At least one lowercase letter" },
  { regex: /[A-Z]/, message: "At least one uppercase letter" },
  { regex: /\d/, message: "At least one numeric character" },
  { regex: /.{8,}/, message: "Minimum 8 characters" },
  { regex: /[!@#$%^&*]/, message: "At least one special character" }
];

export const passwordValid = (password: string): boolean => {
    // Yêu cầu:
    // - Ít nhất 8 ký tự
    // - Ít nhất 1 chữ in hoa
    // - Ít nhất 1 số
    // - Ít nhất 1 ký tự đặc biệt (!@#$%^&*)
    const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  };
