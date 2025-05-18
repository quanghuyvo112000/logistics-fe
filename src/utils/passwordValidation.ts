export const passwordRequirements = [
  { regex: /[a-z]/, message: "At least one lowercase letter" },
  { regex: /[A-Z]/, message: "At least one uppercase letter" },
  { regex: /\d/, message: "At least one numeric character" },
  { regex: /.{8,}/, message: "Minimum 8 characters" },
  { regex: /[!@#$%^&*]/, message: "At least one special character" },
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

export const generateValidPassword = (): string => {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const number = "0123456789";
  const special = "!@#$%^&*";
  const all = upper + lower + number + special;

  const getRandom = (charset: string) =>
    charset[Math.floor(Math.random() * charset.length)];

  // Đảm bảo có ít nhất 1 ký tự từ mỗi nhóm bắt buộc
  const requiredChars = [
    getRandom(upper),
    getRandom(number),
    getRandom(special),
  ];

  // Thêm các ký tự ngẫu nhiên để đủ tối thiểu 8 ký tự
  while (requiredChars.length < 10) {
    requiredChars.push(getRandom(all));
  }

  // Trộn ngẫu nhiên chuỗi
  return requiredChars.sort(() => Math.random() - 0.5).join("");
};
