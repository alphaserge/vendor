import React, { useState, useEffect } from "react";
import { useNavigate, redirect } from "react-router-dom";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';

import HoverPopover from 'material-ui-popup-state/HoverPopover';
import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state';

import { APPEARANCE } from '../../appearance';
import { Height } from "@mui/icons-material";

const findBoxStyle = { width: "calc(100% - 80px)", border: "none" }
const findTextStyle = { width: "100%", borderRadius : "8px", border: "2px solid #18515e" }
const mainMenuStyle = { padding: "0 30px", cursor: "pointer" }

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function MainSection(props) {

  const [search, setSearch] = useState("")
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const styles = theme => ({
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',            
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500,
        backgroundColor: 'green'
    },
    input: {
        backgroundColor: 'green'
    }
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = (e) => {
    return;
    if (e.currentTarget.localName !== "ul") {
      const menu = document.getElementById("simple-menu");//.children[2];
      const parn = document.getElementById("simple-menu").parentElement;//.children[2];
      const menuBoundary = {
        left: menu.offsetLeft,
        top: e.currentTarget.offsetTop + e.currentTarget.offsetHeight,
        //top: menu.offsetTop,
        right: menu.offsetLeft + menu.offsetWidth,
        bottom: e.currentTarget.offsetTop + menu.offsetHeight
      };
      console.log(menu.offsetTop + ' ' + menu.offsetHeight)
      console.log(menuBoundary)
      console.log(e.clientX + ' ' + e.clientY)
      console.log(parn.offsetLeft)
      if (
        e.clientX >= menuBoundary.left &&
        e.clientX <= menuBoundary.right &&
        e.clientY <= menuBoundary.bottom &&
        e.clientY >= menuBoundary.top
      ) {
        return;
      }
    }

    setOpenMenu(false);
  };


  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (event) => {
    let value = event.currentTarget.dataset.menuValue;
    if (value == "Sign up") { navigate("/register"); return; }
    setAnchorElUser(null);
  };


useEffect(() => {
    //console.log(props.title)
  }, []);

  const { classes } = props;
  return (
    // #eeede8  efa29a
    <Box className="main-section">
    <Box sx={{ backgroundColor: "#f78997", color: "#fff", alignContent: "center", height: "44px" }} >
      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p>Sign up for our newsletter for 15% off</p>
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      </Grid>
    </Box>

    <Box sx={{ backgroundColor: "#fff", color: "#eee", alignContent: "center" }} style={{ height: "100px" }}  >
      <Grid container spacing={2} sx={{ alignContent: "center" }} >
      <Grid item xs={12} md={4} key={"mainsect-left"} sx={{ justifyItems : "right" }} className="center-content" >
        <Box sx={{display: "flex", flexDirection: "row", paddingTop: "25px", color: APPEARANCE.BLACK }}>
        <Tooltip title={props.user != undefined ? props.user.firstName: "Sign In"}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <PersonOutlineOutlinedIcon fontSize="large" />
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
          {!props.user &&
          <MenuItem
            key={"menu-1"} 
            data-menu-value={"menu-1"}
            onClick={handleMenuClick}>
            <Typography textAlign="center">Sign up</Typography>
          </MenuItem>}

          {props.user &&
          <MenuItem
            key={"menu-1"} 
            data-menu-value={"menu-1"}
            onClick={handleMenuClick}>
            <Typography textAlign="center">Log out</Typography>
          </MenuItem>}
        </Menu>

        <Tooltip title={props.cart != undefined ? props.cart.amount : "Your shopping cart is empty"}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <ShoppingCartOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title={props.cart != undefined ? props.favorites.amount : "Your favorite list is empty"}>
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 1, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <FavoriteBorderOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        </Box>
      </Grid>
      <Grid item xs={12} md={4} key={"mainsect-center"} sx={{ justifyItems : "center", alignContent: "center" }} >
        {/* <p className="site-logo">Angelica fabric market</p> */}
        {/* <Box
            component="img"
            sx={{ width: 360, height: 60, display: { xs: 'block', sm: 'block' } }}
            image="/afm.png"
            alt={""}
          /> */}
          <picture class="header-logo-picture">
          <img src="/afm.png" alt="Вернуться на главную" class="img-fluid header-logo-main-img">
          </img>
          </picture>

      </Grid>
      <Grid item xs={12} md={4} key={"mainsect-right"} sx={{ justifyItems : "left" }} >
      <Box>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                placeholder="What are you looking for?"
                name="search"
                value={search}
                style={{ width: "280px", border: "none", borderRadius: "4px", backgroundColor: "#f0f0f0", padding: "8px 12px" }}
                onChange={ev => { setSearch(ev.target.value); props.searchProducts(ev.target.value)}}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
      </Box>
      </Grid>
      </Grid>
    </Box>

    <Box sx={{ backgroundColor: "#18515E", color: "#eee", alignContent: "center", zIndex: 100 }}  >
    <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content"  >
      <Box 
        sx={mainMenuStyle}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseMenu} >
      Textile type
      </Box>
      <Box 
        sx={mainMenuStyle}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseMenu} >
         Fabric type
         </Box>
         <Box 
        sx={mainMenuStyle}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseMenu} >
         Season
         </Box>
         <Box 
        sx={mainMenuStyle}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseMenu} >
         Color
         </Box>
         <Box 
        sx={mainMenuStyle}
        onMouseOver={handleOpenMenu}
        onMouseLeave={handleCloseMenu} >
         Print type
         </Box>
      <Box>
      </Box>

    </Box>
    </Box> 

    {/* <Box sx={{ backgroundColor: "#18515E", color: "#eee", alignContent: "center" }}  >
    <Box className="center-content"  >
    <PopupState variant="popover" popupId="demoPopover" >
      {(popupState) => (
        <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }}  >
          <Typography {...bindHover(popupState)} sx={{ backgroundColor: "#18515E", color: "#eee", alignContent: "center" }} >
            Hover with a Popover.
          </Typography>
          <Typography {...bindHover(popupState)} sx={{ backgroundColor: "#18515E", color: "#eee", alignContent: "center" }} >
            Hover with a Popover1.
          </Typography>
          <HoverPopover
            {...bindPopover(popupState)}
            slotProps={{
              paper: { style: { padding: 10 } },
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left',
            }}
          >
            <Box sx={{left: 200}}>
            <Typography  >The content of the Popover.</Typography>
            </Box>
          </HoverPopover>
        </Box>
      )}
    </PopupState>

    </Box>
    </Box> */}

    <Box sx={{ backgroundColor: "#eeeeff", color: "#222", zIndex: 10, position: "absolute", left: 0, width: "100%"  }} display={openMenu?"block":"none"} >
    <Box sx={{ }} id="simple-menu" onMouseLeave={handleCloseMenu} className="center-content" >
      Menu<br/>
      Menu<br/>
      Menu<br/>
      Menu<br/>

    </Box>
    </Box>

    </Box>
  );
}


