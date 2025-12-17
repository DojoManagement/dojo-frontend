// src/components/Layout/Navbar.tsx
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsKabaddiIcon from '@mui/icons-material/SportsKabaddi';

interface NavbarProps {
  onMenuClick: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          edge="start"
          onClick={onMenuClick}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <SportsKabaddiIcon sx={{ mr: 2 }} />
        <Typography variant="h6" noWrap component="div">
          Dojo Management System
        </Typography>
      </Toolbar>
    </AppBar>
  );
}