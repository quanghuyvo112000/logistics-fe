import { AppBar, Toolbar, Typography } from '@mui/material';

const Header = () => (
  <AppBar position="fixed">
    <Toolbar>
      <Typography variant="h6" noWrap component="div">
        Logistics Management
      </Typography>
    </Toolbar>
  </AppBar>
);

export default Header;
