// src/components/Navbar.jsx
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';

const Navbar = () => {
  return (
    <AppBar position="fixed" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          Cordly AI
        </Typography>
        {/* <Box>
          <Button component={RouterLink} to="/" color="primary">
            Home
          </Button>
          <Button component={RouterLink} to="/history" color="primary">
            History
          </Button>
          <Button component={RouterLink} to="/about" color="primary">
            About
          </Button>
          <Button component={RouterLink} to="/admin" color="primary">
            Admin
          </Button>
        </Box> */}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
