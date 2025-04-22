import React from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Divider,
  Paper,
  styled,
  Button,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import MapIcon from "@mui/icons-material/Map";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import CakeIcon from "@mui/icons-material/Cake";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import BadgeIcon from "@mui/icons-material/Badge";
import UpdateIcon from "@mui/icons-material/Update";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { format } from "date-fns";
import { UserInfo } from "../../types/user.types";

interface ProfileDisplayProps {
  userInfo: UserInfo;
  onEditClick?: () => void;
}

const ProfileLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginBottom: "0.25rem",
}));

const ProfileValue = styled(Typography)(() => ({
  fontWeight: 500,
  wordBreak: "break-word",
}));

const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "0.25rem",
}));

const ProfileDisplay: React.FC<ProfileDisplayProps> = ({ userInfo, onEditClick }) => {
  const formatDate = (dateString: string): string => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card sx={{ mb: 4, overflow: "visible" }}>
      <CardContent>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            alignItems: { xs: "center", md: "flex-start" },
            mb: 4,
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              fontSize: "3rem",
              bgcolor: "primary.main",
              mb: { xs: 2, md: 0 },
              mr: { xs: 0, md: 4 },
            }}
          >
            {userInfo.fullName?.charAt(0).toUpperCase() || "U"}
          </Avatar>
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "center", md: "flex-start" },
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <Box sx={{ textAlign: { xs: "center", md: "left" } }}>
              <Typography variant="h4" sx={{ mb: 1 }}>
                {userInfo.fullName}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: { xs: "center", md: "flex-start" },
                }}
              >
                <BadgeIcon fontSize="small" sx={{ mr: 1 }} />
                {userInfo.role || "User"}
              </Typography>
            </Box>
            <Button
              variant="contained"
              size="small"
              startIcon={<EditIcon />}
              sx={{
                minWidth: "80px",
                minHeight: "36px",
                alignSelf: { xs: "center", md: "flex-start" },
                mt: { xs: 2, md: 0 },
              }}
              onClick={onEditClick}
            >
              Chỉnh sửa thông tin 
            </Button>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <InfoCard elevation={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin cá nhân
              </Typography>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <PersonIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Họ và tên</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.fullName || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <EmailIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Email</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.email || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <PhoneIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Số điện thoại</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.phone || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <CakeIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Ngày sinh</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.birthday
                      ? formatDate(userInfo.birthday)
                      : "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>
            </InfoCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <InfoCard elevation={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin địa chỉ
              </Typography>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <MapIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Tỉnh/ Thành phố</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.province || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <LocationOnIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Quận/ Thành phố</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.district || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <LocationOnIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Phường</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.ward || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>

              <Box sx={{ display: "flex", mb: 2 }}>
                <IconWrapper>
                  <LocationOnIcon />
                </IconWrapper>
                <Box>
                  <ProfileLabel>Địa chỉ hiện tại</ProfileLabel>
                  <ProfileValue variant="body1">
                    {userInfo.address || "Not provided"}
                  </ProfileValue>
                </Box>
              </Box>
            </InfoCard>
          </Grid>

          <Grid item xs={12}>
            <InfoCard elevation={1}>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Thông tin tài khoản
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <IconWrapper>
                      <CalendarTodayIcon />
                    </IconWrapper>
                    <Box>
                      <ProfileLabel>Ngày tạo</ProfileLabel>
                      <ProfileValue variant="body1">
                        {userInfo.createdAt
                          ? formatDate(userInfo.createdAt)
                          : "Not available"}
                      </ProfileValue>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: "flex", mb: 2 }}>
                    <IconWrapper>
                      <UpdateIcon />
                    </IconWrapper>
                    <Box>
                      <ProfileLabel>Ngày cập nhật</ProfileLabel>
                      <ProfileValue variant="body1">
                        {userInfo.updatedAt
                          ? formatDate(userInfo.updatedAt)
                          : "Not available"}
                      </ProfileValue>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </InfoCard>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ProfileDisplay;
