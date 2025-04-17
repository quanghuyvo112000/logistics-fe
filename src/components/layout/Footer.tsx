import { Box, Typography } from '@mui/material';

interface Props {
  drawerWidth: number;
}

const Footer = ({ drawerWidth }: Props) => (
  <Box
    component="footer"
    sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px`, zIndex: 1201, textAlign: 'center', p: 2, position: 'fixed', bottom: 0, backgroundColor: '#f5f5f5' }}  
  >
    <Typography variant="body2">
      © 2025 Logistics System. All rights reserved.
    </Typography>
  </Box>
);

export default Footer;
