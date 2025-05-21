import type React from "react"
import { Box, Typography, Grid, Paper, List, ListItem, ListItemIcon, ListItemText, useTheme } from "@mui/material"
import { CheckCircle } from "lucide-react"
import { commitments } from "./util"

const CommitmentSection: React.FC = () => {
  const theme = useTheme()

  return (
    <Box id="commitment" py={10}>
      <Box sx={{ minWidth: "1100px", mx: "auto", px: 3 }}>
        <Box textAlign="center" mb={8}>
          <Typography variant="h3" component="h2" gutterBottom fontWeight="bold" color="primary">
            Cam Kết Của Chúng Tôi
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: "auto", mt: 2 }}>
            Chúng tôi luôn đặt sự hài lòng của khách hàng lên hàng đầu với những cam kết cụ thể và rõ ràng
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: 5, borderRadius: 2 }}>
          <Grid container spacing={4}>
            {commitments.map((commitment, index) => (
              <Grid size={{xs:12, md:6}} key={index}>
                <List disablePadding>
                  <ListItem alignItems="flex-start" disableGutters sx={{ mb: 2 }}>
                    <ListItemIcon sx={{ minWidth: 46, color: theme.palette.primary.main }}>
                      <CheckCircle size={30} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography variant="h5" gutterBottom sx={{ mb: 1 }}>
                          {commitment.title}
                        </Typography>
                      }
                      secondary={
                        <Typography variant="body1" color="text.secondary">
                          {commitment.description}
                        </Typography>
                      }
                    />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>
    </Box>
  )
}

export default CommitmentSection
