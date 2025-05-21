import { Box, Grid, Paper, Typography, useTheme } from "@mui/material"
import { Clock, MapPin, Shield, Truck } from "lucide-react"
import type React from "react"

const AboutSection: React.FC = () => {
  const theme = useTheme()

  return (
    <Box id="about" py={10} bgcolor={theme.palette.grey[50]}>
      <Box sx={{ minWidth: "1100px", mx: "auto", px: 3 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" color="primary">
            Về Chúng Tôi
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
            Chúng tôi là đơn vị vận chuyển hàng đầu với hơn 10 năm kinh nghiệm, cam kết mang đến dịch vụ vận chuyển
            nhanh chóng, an toàn và đáng tin cậy.
          </Typography>
        </Box>

        <Grid container spacing={4}>
          <Grid size={{xs:12, md:6, lg:3}}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    bgcolor: theme.palette.primary.main,
                    color: "white",
                    borderRadius: "50%",
                    p: 2.5,
                    mb: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "rotate(10deg)",
                    },
                  }}
                >
                  <Truck size={38} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Vận Chuyển Toàn Quốc
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Dịch vụ vận chuyển đến tất cả 63 tỉnh thành trên cả nước với mạng lưới rộng khắp.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:6, lg:3}}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    bgcolor: theme.palette.success.main,
                    color: "white",
                    borderRadius: "50%",
                    p: 2.5,
                    mb: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "rotate(10deg)",
                    },
                  }}
                >
                  <Clock size={38} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Giao Hàng Nhanh Chóng
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Thời gian giao hàng nhanh chóng, đúng hẹn với hệ thống theo dõi đơn hàng thời gian thực.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:6, lg:3}}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    bgcolor: theme.palette.warning.main,
                    color: "white",
                    borderRadius: "50%",
                    p: 2.5,
                    mb: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "rotate(10deg)",
                    },
                  }}
                >
                  <Shield size={38} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  An Toàn & Bảo Mật
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Đảm bảo an toàn cho hàng hóa với quy trình đóng gói và vận chuyển chuyên nghiệp.
                </Typography>
              </Box>
            </Paper>
          </Grid>

          <Grid size={{xs:12, md:6, lg:3}}>
            <Paper
              elevation={2}
              sx={{
                p: 4,
                height: "100%",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-8px)",
                  boxShadow: 8,
                },
              }}
            >
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <Box
                  sx={{
                    bgcolor: theme.palette.info.main,
                    color: "white",
                    borderRadius: "50%",
                    p: 2.5,
                    mb: 3,
                    transition: "transform 0.3s",
                    "&:hover": {
                      transform: "rotate(10deg)",
                    },
                  }}
                >
                  <MapPin size={38} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
                  Theo Dõi Trực Tuyến
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Hệ thống theo dõi đơn hàng trực tuyến giúp khách hàng nắm bắt thông tin vận chuyển mọi lúc.
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default AboutSection

