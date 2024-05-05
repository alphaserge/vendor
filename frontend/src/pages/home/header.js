import React, { useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ApiIcon from '@mui/icons-material/Api';
import { Icon } from '@mui/material';

import config from "../../config.json"

const pages = ['My Products', 'Add Product', 'Contacts' ];
const settings = ['Profile', 'Account', 'Dashboard', 'Login', 'Logout', 'Register'];

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function Header(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (event) => {
    let value = event.currentTarget.dataset.menuValue;
    console.log(value)
    if (value == "My Products") { 
      console.log('redir')
      navigate("/listproduct")
      //navigate("/") 
      return
    }
    if (value == "Add Product") { 
      console.log('>>addproduct')
      //redirect("/addproduct")
      navigate("/addproduct") 
      return
    }
    if (value == "Contacts") { navigate("/contacts"); return; }
    if (value == "Profile") { navigate("/profile"); return; }
    if (value == "Account") { navigate("/account"); return; }
    if (value == "Dashboard") { navigate("/dashboard"); return; }
    if (value == "Login") { navigate("/login"); return; }
    if (value == "Logout") { navigate("/logout"); return; }
    if (value == "Register") { navigate("/register"); return; }

    //['My Products', 'Add Product', 'Contacts' ]
    setAnchorElUser(null);
    setAnchorElNav(null);
  };

  useEffect(() => {
    //console.log('props.title')
    //console.log(props.title)
  }, []);

  

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <ApiIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            //variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              //fontFamily: 'monospace',
              //fontWeight: 700,
              //letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {config.company}
          </Typography>

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages.map((page) => (
                <MenuItem 
                  key={page} 
                  data-menu-value={page}
                  onClick={handleMenuClick}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          <ApiIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
          <Typography
            variant="h5"
            noWrap
            component="a"
            href="#app-bar-with-responsive-menu"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {config.company}
          </Typography>
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 4 }}>
            {pages.map((page) => (
              <Button
                key={page}
                data-menu-value={page}
                onClick={handleMenuClick}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title={props.user != undefined? props.user.firstName: ""}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
                
              </IconButton>
              <div onClick={handleOpenUserMenu}>{props.user != undefined? props.user.firstName: ""}</div>
              
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem 
                  key={setting} 
                  data-menu-value={setting}
                  onClick={handleMenuClick}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem> 
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
//export default Header;
