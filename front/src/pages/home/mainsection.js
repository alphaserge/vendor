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
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';

import Menu from '@mui/material/Menu';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import ExpandDown from './../../components/symbol/expanddown';

const itemStyle = { padding: 0, margin: 0, cursor: "pointer" }  

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
  const [page, setPage] = useState(0);

  const dropFilters = () => {
    if(props.setSeason) { props.setSeason([]) }
    if(props.setTextileType) { props.setTextileType([]) }
    if(props.setDesignType) { props.setDesignType([]) }
    if(props.setColor) { props.setColor([]) }
    if(props.setPrintType) { props.setPrintType([]) }
    if(props.setOverworkType) { props.setOverworkType([]) }
  }

  const handleSeason = (event) => {
    dropFilters()
    if(props.setSeason) {
      props.setSeason([event.id])
    }
    setOpenMenu(false);
  }
  const handleTextileType = (event) => {
    dropFilters()
    if(props.setTextileType) {
      props.setTextileType([event.id])
    }
    setOpenMenu(false);
  }
  const handleDesignType = (event) => {
    dropFilters()
    if(props.setDesignType) {
      props.setDesignType([event.id])
    }
    setOpenMenu(false);
  }
  const handleColor = (event) => {
    dropFilters()
    if(props.setColor) {
      props.setColor([event.id])
    }
    setOpenMenu(false);
  }
  const handlePrintType = (event) => {
    dropFilters()
    if(props.setPrintType) {
      props.setPrintType([event.id])
    }
    setOpenMenu(false);
  }
  const handleOverworkType = (event) => {
    dropFilters()
    if(props.setOverworkType) {
      props.setOverworkType([event.id])
    }
    setOpenMenu(false);
  }

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
    setOpenMenu(true);
  };

  const handleCloseMenu = (e) => {
    const mnu = document.getElementById("simple-menu");  // or document.querySelector('#simple-menu') too works

    if (mnu.matches(':hover')) {
      return;
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
  }, []);

  const { classes } = props;
  return (
    // #eeede8  efa29a
    <Box className="main-section">
    <Box sx={{ backgroundColor: "#000", color: "#fff", alignContent: "center", height: "44px" }} >
      <Grid container spacing={2} >
      <Grid item display={{ xs: "none", md: "block" }} xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>-&nbsp;</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p>Sign up for our newsletter for 15% off</p>
      </Grid>
      <Grid item display={{ xs: "none", md: "block" }} xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>-&nbsp;</p>
      </Grid>
      </Grid>
    </Box>

    <Box sx={{ alignContent: "center" }} style={{ height: "200px" }}  >
      <Grid container spacing={2} sx={{ alignContent: "center"  }} >
      <Grid item xs={12} md={4} key={"mainsect-left"} justifyItems={{ xs: "center", md: "right" }} sx={{ alignContent: "center" }} >
        <Box sx={{display: "flex", flexDirection: "row" }}>

        <Tooltip title={props.favorites != undefined ? props.favorites.amount : "Your favorite list is empty"}>
          <IconButton onClick={(e)=>{navigate("/")}} sx={{ p: 0, ml: 1, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <HomeOutlinedIcon fontSize="large" sx={{color: "#fff", backgroundColor: "#222", borderRadius: "50%", padding: "3px"}} />
          </IconButton>
        </Tooltip>


        <Tooltip title={props.user != undefined ? props.user.firstName: "Sign In"}  >
          <IconButton onClick={handleOpenUserMenu} sx={{ p: 0, ml: 0, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <PersonOutlineOutlinedIcon fontSize="large" sx={{color: "#fff", backgroundColor: "#222", borderRadius: "50%", padding: "3px"}} />
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

        
        <Tooltip title={props.cart != undefined ? props.cart.length + " items" : "Your shopping cart is empty"}>
          <Box className="cart-label" onClick={(e)=>{ props.openShoppingCart(true) }} >{props.cart && props.cart.length}</Box>
          <IconButton onClick={(e)=>{ props.openShoppingCart(true) }} sx={{ p: 0, ml: "-16px", mr: 1 }}>
            <ShoppingCartOutlinedIcon fontSize="large" sx={{color: "#fff", backgroundColor: "#222", borderRadius: "50%", padding: "3px"}} />
          </IconButton>
        </Tooltip>

        <Tooltip title={props.favorites != undefined ? props.favorites.amount : "Your favorite list is empty"}>
          <IconButton onClick={props.openFavorites} sx={{ p: 0, ml: 0, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <FavoriteBorderOutlinedIcon fontSize="large" sx={{color: "#fff", backgroundColor: "#222", borderRadius: "50%", padding: "3px"}} />
          </IconButton>
        </Tooltip>

        </Box>
      </Grid>
      <Grid display={{ xs: "none", md: "block" }} item xs={12} md={4} key={"mainsect-center"} sx={{ justifyItems : "center", alignContent: "center" }} >
        {/* <p className="site-logo">Angelica fabric market</p> */}
        {/* <Box
            component="img"
            sx={{ width: 360, height: 60, display: { xs: 'block', sm: 'block' } }}
            image="/afm.png"
            alt={""}
          /> */}
          <picture class="header-logo-picture" onClick={(e)=>{ navigate("/") }}>
          <img src="/afm.png" alt="Вернуться на главную" class="img-fluid header-logo-main-img" 
            style={{padding: "10px 0", height: "180px"}}>
          </img>
          </picture>

      </Grid>
      <Grid item xs={12} md={4} key={"mainsect-right"} justifyItems={{ xs: "center", md: "left" }}  sx={{ alignContent: "center" }} >
      <Box>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                placeholder="What are you looking for?"
                name="search"
                value={search}
                sx={{ width: "280px" }}
                onChange={ev => { setSearch(ev.target.value); props.searchProducts(ev.target.value)}}
                // variant="standard"
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

<Box>
<nav>
  <ul className="mainmenu">
    <li>
      <a href="#0">Textile type <ExpandDown /></a>
      <ul class="columns-2">
        {props.textileTypes && props.textileTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleTextileType(item)}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Design type <ExpandDown /></a>
      <ul class="columns-2">
        {props.designTypes && props.designTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleDesignType(item)}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Color <ExpandDown /></a>
      <ul class="columns-3">
        {props.colors && props.colors.map((item) => { return (
          <li><a href="#0" onClick={() => handleColor(item)}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Season <ExpandDown /></a>
      <ul>
        {props.seasons && props.seasons.map((item) => { return (
          <li><a href="#0" onClick={() => handleSeason(item)}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li><a href="#0">Print type <ExpandDown /></a>
    <ul>
        {props.printTypes && props.printTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handlePrintType(item)}>{item.value}</a></li>); })}
      </ul>
    </li>

    <li><a href="#0">Product type <ExpandDown /></a>
    <ul>
        {props.printTypes && props.productTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handlePrintType(item)}>{item.value}</a></li>); })}
      </ul>
    </li>

  </ul>
</nav>
</Box>
    </Box>
  );
}


