import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink } from 'react-router-dom';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <WhatsAppIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          WhatsApp Management
        </Typography>
        <Box>
          <Button
            component={NavLink}
            to="/"
            exact
            sx={{
              color: 'white',
              '&.active': {
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
          >
            Send Message
          </Button>
          <Button
            component={NavLink}
            to="/templates"
            sx={{
              color: 'white',
              '&.active': {
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
          >
            Create Template
          </Button>
          <Button
            component={NavLink}
            to="/templates/list"
            sx={{
              color: 'white',
              '&.active': {
                fontWeight: 'bold',
                textDecoration: 'underline',
              },
            }}
          >
            List Templates
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 