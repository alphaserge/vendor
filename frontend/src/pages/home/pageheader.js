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
import PersonIcon from '@mui/icons-material/Person';
import { Icon } from '@mui/material';

import { APPEARANCE } from '../../appearance';
import { fromUrl } from '../../functions/helper';

import config from "../../config.json"

const pages = ['Fabrics', 'Accessories', 'Orders', 'Sample Orders', 'Help', 'Contacts' ]; 
const settings = ['Login', 'Logout', 'Register'];

const menuPagesStyle = { fontSize: "14px", fontWeight: "300", color: "#fff", textTransform: "none" }

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function PageHeader(props) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const [menu, setMenu] = React.useState(pages);

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
    if (value == "Fabrics") { 
      console.log('redir')
      navigate("/listproduct")
      return
    }

    if (value == "Orders") { 
      if (props.user.vendorId==2) {
        navigate("/listorder"); 
      } else {
        navigate("/listorderv"); 
      }
      return; 
    }
     
    if (value == "Sample Orders") { 
        navigate("/listsample"); 
      return; 
    }

    if (value == "Contacts") { navigate("/contacts"); return; }
    if (value == "Profile") { navigate("/profile"); return; }
    if (value == "Account") { navigate("/account"); return; }
    if (value == "Dashboard") { navigate("/dashboard"); return; }
    if (value == "Login") { navigate("/login"); return; }
    if (value == "Logout") { navigate("/logout"); return; }
    if (value == "Register") { navigate("/register"); return; }

    setAnchorElUser(null);
    setAnchorElNav(null);
  };

  const menuItems = !!props.user ? settings.filter(x => x != 'Register' ) : settings

  useEffect(() => {

    /*if (fromUrl('vendor')+'' == '1') {
      var index = pages.indexOf('Vendor Orders');
      if (index !== -1) {
        pages.splice(index, 1);
      }
      index = pages.indexOf('Client Orders');
      if (index !== -1) {
        pages.splice(index, 1);
      }
      setMenu(pages)
    } else {
      var index = pages.indexOf('Orders');
      if (index !== -1) {
        pages.splice(index, 1);
      }
    }*/
  
    //console.log('props.title')
    //console.log(props.title)
  }, []);

  

  return (
    
    <AppBar position="fixed" sx={{background: "linear-gradient(135deg, #733b89 0%, #6f4b93 17%, #6475af 50%, #52b8da 95%, #50c0df 100%)", color: "#fff", fontSize: "15px", height: "70px", boxShadow: "none" }}>
      <Container className="header-menu" sx={{  }} maxWidth={false}  >
        <Toolbar disableGutters>
          {/* <ApiIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            //variant="h6"
            noWrap
            component="a"
            href="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            {config.company}11
          </Typography> */}

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              sx={{ color: "#fff" }} 
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
              {menu.map((page,index) => (
                <MenuItem 
                  key={"key-"+index} 
                  data-menu-value={page}
                  //style={menuPagesStyle}
                  onClick={handleMenuClick}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, ml: 2 }}>
            {pages.map((page,index) => (
              <Button
                key={"key1-"+index}
                data-menu-value={page}
                style={menuPagesStyle}
                sx={{ ml: 1, mr: 1, mt: 1, display: 'block' }}
                onClick={handleMenuClick} >
                {page}
              </Button>
            ))}
          </Box>

          <Box sx={{ flexGrow: 0, display: "flex", flexDirection: "row", alignItems : "center", mt: 1 }}>
          <Box 
            onClick={handleOpenUserMenu}
            style={menuPagesStyle} >
              {props.user != undefined? props.user.firstName + " - " + props.user.vendorName : ""}
            </Box>
          {/* <Button
                key="user"
                data-menu-value="user"
                onClick={handleMenuClick}
                sx={{ ml: 2, mr: 2, color: APPEARANCE.BLACK, display: 'inline-block' }}
              >
                Admin
           </Button> */}
            <Tooltip title={props.user != undefined? props.user.firstName: ""}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 2, mr: 4, color: "#eee" }}>
                {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
                <PersonIcon />
              </IconButton>
              
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
              {menuItems.map((item,index) => (
                <MenuItem 
                  key={"key2-"+index} 
                  data-menu-value={item}
                  onClick={handleMenuClick}>
                  <Typography textAlign="center">{item}</Typography>
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
