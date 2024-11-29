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

import { APPEARANCE } from '../../appearance';
import { Height } from "@mui/icons-material";

const findBoxStyle = { width: "calc(100% - 80px)", border: "none" }
const findTextStyle = { width: "100%", borderRadius : "8px", border: "2px solid #18515e" }

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

    <Box sx={{ backgroundColor: "#18515E", color: "#eee", alignContent: "center" }}  >
    <Box sx={{ alignContent: "center" }} style={{ height: "30px" }} className="center-content"  >
      <Grid container spacing={2} sx={{ alignContent: "center" }}  >
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
      Textile type
      </Grid>
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
         Fabric type
      </Grid>
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
         Season
      </Grid>
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
         Color
      </Grid>
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
         Print type
      </Grid>
      <Grid item xs={2} md={2} sx={{ justifyItems : "left" }} >
      </Grid>

      </Grid>
    </Box>
    </Box>
    </Box>
  );
}


