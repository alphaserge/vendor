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

import { APPEARANCE } from '../../appearance';

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

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
    //console.log(props.title)
  }, []);

  const { classes } = props;
  return (
    // #eeede8  efa29a
    <Box className="main-section">

    <Box sx={{ color: "#005bff", alignContent: "center" }} style={{ height: "80px" }}  >
      <Grid container spacing={2} sx={{ alignContent: "center"  }} >

      <Grid item display={{ xs: "none", md: "block" }} xs={12} md={4} key={"mainsect-center"} sx={{ justifyItems : "center", alignContent: "center" }} >
        <p className="site-logo">ANGELIKA</p> 
        {/* <Box
            component="img"
            sx={{ width: 360, height: 60, display: { xs: 'block', sm: 'block' } }}
            image="/afm.png"
            alt={""}
          /> */}
          {/* <picture class="header-logo-picture">
          <img src="/afm.png" alt="Вернуться на главную" class="img-fluid header-logo-main-img" style={{padding: 0, margin: 0}}>
          </img>
          </picture> */}
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
                style={{ width: "280px", border: "2px solid #005bff", borderRadius: "4px", borderColor: "#005bff" , padding: "8px 12px" }}
                onChange={ev => { setSearch(ev.target.value); props.searchProducts(ev.target.value)}}
                variant="standard"
                InputProps={{
                  disableUnderline: true,
                  endAdornment: (
                    <InputAdornment position="end" sx={{ backgroundColor: "#005bff" }}>
                      <IconButton sx={{ backgroundColor: "#005bff" }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
      </Box>
      </Grid>


      <Grid item xs={12} md={4} key={"mainsect-left"} justifyItems={{ xs: "center", md: "right" }} sx={{ alignContent: "center" }} >
        <Box sx={{display: "flex", flexDirection: "row", color: APPEARANCE.BLACK }}>
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

        
        <Tooltip title={props.cart != undefined ? props.cart.length + " items" : "Your shopping cart is empty"}>
          <Box className="cart-label" onClick={(e)=>{ props.openShoppingCart(true) }} >{props.cart && props.cart.length}</Box>
          <IconButton onClick={(e)=>{ props.openShoppingCart(true) }} sx={{ p: 0, ml: "-10px", mr: 1 }}>
            <ShoppingCartOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        <Tooltip title={props.favorites != undefined ? props.favorites.amount : "Your favorite list is empty"}>
          <IconButton onClick={props.openFavorites} sx={{ p: 0, ml: 1, mr: 1 }}>
            {/* <Avatar alt="Account" src="/static/images/avatar/2.jpg" sx={{backgroundColor: APPEARANCE.BLACK}} /> */}
            <FavoriteBorderOutlinedIcon fontSize="large" />
          </IconButton>
        </Tooltip>

        </Box>
      </Grid>
      </Grid>
    </Box>

    <Box id="simple-menu" display={{ xs: "none", md: "block" }} onMouseLeave={handleCloseMenu} >
    <Box sx={{ backgroundColor: "#849785", color: "#eee", alignContent: "center", zIndex: 100 }} >
    <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row", justifyContent: "center" }} className="center-content"  >
      <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(0); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
        Textile type
      </Box>
      <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(1); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         Design type
         </Box>
         <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(2); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         Season
         </Box>
         <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(3); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         Colour
         </Box>
         <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(4); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         Print type
         </Box>
         <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(5); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         About
         </Box>
         <Box 
        sx={{padding: "0 40px", margin: 0, cursor: "pointer"}}
        onMouseOver={e => { setPage(6); handleOpenMenu(e) }}
        onMouseLeave={handleCloseMenu} >
         Contact
         </Box>

    </Box>
    </Box> 

    <Box  sx={{ backgroundColor: "#fff", color: "#222", zIndex: 10, position: "absolute", left: 0, width: "100%", paddingBottom: "12px"  }} display={openMenu?"block":"none"} >

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==0?"block":"none"}>
    <ul sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="four-column-list center-content-menu" >
      {props.textileTypes && props.textileTypes.map((item) => {
        return (
          <ListItem key={item.key} sx={itemStyle} >
            <ListItemText primary={item.value} onClick={() => handleTextileType(item)} />
          </ListItem>
        );
      })}
    </ul>
    </Box>

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==1?"block":"none"}>
    <ul sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="four-column-list center-content-menu" >
      {props.designTypes && props.designTypes.map((item) => {
        return (
          <ListItem key={item.key} sx={itemStyle} >
            <ListItemText primary={item.value} onClick={() => handleDesignType(item)} />
          </ListItem>
        );
      })}
    </ul>
    </Box>
    
    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==2?"block":"none"}>
    <ul sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="four-column-list center-content-menu" >
      {props.seasons && props.seasons.map((item) => {
        return (
          <ListItem key={item.key} sx={itemStyle}  >
            <ListItemText primary={item.value} key={item.key} onClick={() => handleSeason(item)} />
          </ListItem>
        );
      })}
    </ul>
    </Box>

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==3?"block":"none"}>
    <ul sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="four-column-list center-content-menu" >
      {props.colors && props.colors.map((item) => {
        return (
          <ListItem key={item.key} sx={itemStyle} >
            <ListItemText primary={item.value} onClick={() => handleColor(item)} />
          </ListItem>
        );
      })}
    </ul>
    </Box>

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==4?"block":"none"}>
    <ul sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="four-column-list center-content-menu" >
      {props.printTypes && props.printTypes.map((item) => {
        return (
          <ListItem key={item.key} sx={itemStyle} >
            <ListItemText primary={item.value} onClick={() => handlePrintType(item)} />
          </ListItem>
        );
      })}
    </ul>
    </Box>

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==5?"block":"none"}>
    <Box sx={{ width: '100%', maxWidth: 800, height: '100%', textAlign: "justify" }} className="center-content-menu">
    <b>JSC Textile Company Anzhelika</b> is a company in Russia, with its main office in Moscow. It operates in the industry of wholesale trade in clothing, textiles and related products. The company was founded on January 13, 2003.
      <br/><br/>Being part of the light industrial complex, the company in its activities is primarily focused on satisfying the current needs of the end consumer. In order to saturate the market with its products, the organization cooperates with a number of large and small retail outlets in Moscow and other regions.
    </Box>
    </Box>

    <Box sx={{ }} onMouseLeave={handleCloseMenu} display={page==6?"block":"none"}>
    <Box sx={{ width: '100%', maxWidth: 800, height: '100%' }} className="center-content-menu">
      <b>Showroom address:</b><br/>
      <Box sx={{margin: "5px 0 0 10px"}}>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia<br/>
      Postal code: 141009<br/>
      Phones: +7 (926) 018-01-25,&nbsp;&nbsp;+7(916) 876-20-08</Box><br/>
      <b>Headquarters:</b><br/>
      <Box sx={{padding: "5px 0 0 10px"}}>
      Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia<br/>
      Postal code: 123242</Box>
    </Box>
    
    </Box>

    </Box>
    </Box>
    </Box>
  );
}


