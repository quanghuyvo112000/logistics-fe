import { Box, Paper, styled, Typography } from "@mui/material"

export const ProfileLabel = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  marginBottom: "0.25rem",
}))

export const ProfileValue = styled(Typography)(() => ({
  fontWeight: 500,
  wordBreak: "break-word",
}))

export const InfoCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  height: "100%",
  display: "flex",
  flexDirection: "column",
}))

export const IconWrapper = styled(Box)(({ theme }) => ({
  marginRight: theme.spacing(1.5),
  color: theme.palette.primary.main,
  display: "flex",
  alignItems: "flex-start",
  paddingTop: "0.25rem",
}))
