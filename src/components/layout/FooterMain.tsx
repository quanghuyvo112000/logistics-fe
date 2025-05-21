import type React from "react"
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  TextField,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  useMediaQuery,
} from "@mui/material"
import { MapPin, Phone, Mail, Clock, Facebook, Twitter, Instagram, Youtube, ChevronRight, Send } from "lucide-react"

const FooterMain: React.FC = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: theme.palette.grey[900],
        color: "white",
        pt: 8,
        pb: 4,
        mt: 8,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={6}>
          {/* Company Info */}
          <Grid size={{xs:12, md:4}}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Typography variant="h5" component="div" fontWeight="bold">
                Tracking System
              </Typography>
            </Box>
            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.grey[300] }}>
              Chúng tôi cung cấp dịch vụ vận chuyển hàng đầu với hơn 10 năm kinh nghiệm, cam kết mang đến dịch vụ vận
              chuyển nhanh chóng, an toàn và đáng tin cậy.
            </Typography>

            <List dense disablePadding>
              <ListItem disableGutters sx={{ mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                  <MapPin size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                      123 Đường Nguyễn Văn Linh, Quận 7, TP. Hồ Chí Minh
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disableGutters sx={{ mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                  <Phone size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                      +84 (0) 28 1234 5678
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disableGutters sx={{ mb: 1.5 }}>
                <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                  <Mail size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                      info@trackingsystem.com
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 36, color: theme.palette.primary.main }}>
                  <Clock size={20} />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body2" sx={{ color: theme.palette.grey[300] }}>
                      Thứ Hai - Thứ Sáu: 8:00 - 17:30
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>

          {/* Quick Links */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Liên kết nhanh
            </Typography>
            <List dense disablePadding>
              {[
                { text: "Trang chủ", action: () => scrollToSection("home") },
                { text: "Về chúng tôi", action: () => scrollToSection("about") },
                { text: "Cam kết", action: () => scrollToSection("commitment") },
                { text: "Dịch vụ", action: () => {} },
                { text: "Bảng giá", action: () => {} },
                { text: "Liên hệ", action: () => {} },
              ].map((item, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    mb: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      pl: 1,
                      color: theme.palette.primary.main,
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, color: "inherit" }}>
                    <ChevronRight size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link
                        component="button"
                        underline="none"
                        onClick={item.action}
                        sx={{
                          color: "inherit",
                          fontSize: "0.9rem",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {item.text}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Services */}
          <Grid size={{xs:12, sm:6, md:2}}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Dịch vụ
            </Typography>
            <List dense disablePadding>
              {[
                "Vận chuyển nội thành",
                "Vận chuyển liên tỉnh",
                "Vận chuyển quốc tế",
                "Giao hàng nhanh",
                "Giao hàng tiết kiệm",
                "Dịch vụ kho bãi",
              ].map((text, index) => (
                <ListItem
                  key={index}
                  disableGutters
                  sx={{
                    mb: 1,
                    transition: "all 0.2s",
                    "&:hover": {
                      pl: 1,
                      color: theme.palette.primary.main,
                    },
                    textAlign:"left"
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 24, color: "inherit" }}>
                    <ChevronRight size={16} />
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Link
                        component="button"
                        underline="none"
                        sx={{
                          color: "inherit",
                          fontSize: "0.9rem",
                          "&:hover": {
                            color: theme.palette.primary.main,
                          },
                        }}
                      >
                        {text}
                      </Link>
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>

          {/* Newsletter */}
          <Grid size={{xs:12, sm:6, md:4}}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 3 }}>
              Đăng ký nhận tin
            </Typography>
            <Typography variant="body2" sx={{ mb: 3, color: theme.palette.grey[300] }}>
              Đăng ký để nhận thông tin mới nhất về dịch vụ, khuyến mãi và tin tức từ chúng tôi.
            </Typography>

            <Box sx={{ display: "flex", mb: 4 }}>
              <TextField
                variant="outlined"
                placeholder="Email của bạn"
                size="small"
                fullWidth
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  borderRadius: 1,
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.2)",
                    },
                    "&:hover fieldset": {
                      borderColor: "rgba(255, 255, 255, 0.3)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                  "& .MuiInputBase-input": {
                    color: "white",
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <Button variant="contained" color="primary" sx={{ borderRadius: "0 4px 4px 0", px: 2 }}>
                      <Send size={18} />
                    </Button>
                  ),
                }}
              />
            </Box>

            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Kết nối với chúng tôi
            </Typography>
            <Box sx={{ display: "flex", gap: 2 }}>
              {[
                { icon: Facebook, color: "#1877F2" },
                { icon: Twitter, color: "#1DA1F2" },
                { icon: Instagram, color: "#E4405F" },
                { icon: Youtube, color: "#FF0000" },
              ].map((social, index) => {
                const SocialIcon = social.icon
                return (
                  <Box
                    key={index}
                    sx={{
                      bgcolor: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "50%",
                      width: 40,
                      height: 40,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      transition: "all 0.3s",
                      "&:hover": {
                        bgcolor: social.color,
                        transform: "translateY(-3px)",
                      },
                    }}
                  >
                    <SocialIcon size={20} />
                  </Box>
                )
              })}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255, 255, 255, 0.1)" }} />

        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            justifyContent: "space-between",
            alignItems: isMobile ? "center" : "flex-start",
            textAlign: isMobile ? "center" : "left",
          }}
        >
          <Typography variant="body2" sx={{ color: theme.palette.grey[400] }}>
            © {new Date().getFullYear()} Tracking System. Tất cả các quyền được bảo lưu.
          </Typography>
          <Box sx={{ display: "flex", gap: 3, mt: isMobile ? 2 : 0 }}>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: theme.palette.grey[400],
                fontSize: "0.875rem",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              Điều khoản sử dụng
            </Link>
            <Link
              href="#"
              underline="hover"
              sx={{
                color: theme.palette.grey[400],
                fontSize: "0.875rem",
                "&:hover": { color: theme.palette.primary.main },
              }}
            >
              Chính sách bảo mật
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  )
}

export default FooterMain
