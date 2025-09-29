import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link} from "react-router-dom";
import { useSelector } from 'react-redux'

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
import ApiIcon from '@mui/icons-material/Api';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import HomeIcon from '@mui/icons-material/Home';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

import axios from 'axios'
import config from "../../config.json"
import { getYearsFull } from "../../functions/helper"

import ExpandDown from './../../components/symbol/expanddown';
import { Api } from "@mui/icons-material";


//const buttonStyle = { color: "#222", backgroundColor: "#fff", border: "2px solid #333", borderRadius: "50%", padding: "3px" }  
const buttonStyle = { color: "#555", border: "none", padding: "3px", fontSize: "28px" }  

export default function MainSection(props) {

  const [search, setSearch] = useState("")
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const shopCart = useSelector((state) => state.cart.items)
  const shoppingCartRef = useRef()


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

  const location = useLocation()

  const dropFilters = () => {
    if(props.setSeason) { props.setSeason([]) }
    if(props.setTextileType) { props.setTextileType([]) }
    if(props.setDesignType) { props.setDesignType([]) }
    if(props.setColor) { props.setColor([]) }
    if(props.setPrintType) { props.setPrintType([]) }
    if(props.setOverworkType) { props.setOverworkType([]) }
  }

  const handleFilter = (event, entity) => {
    if(props.setFilter) {
      props.setFilter("clear", [])
      props.setFilter(entity, [event.id])
    }

    if (location.pathname != "/") {
      navigate("/")
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

   const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
   }

    const searchProducts = async (e) => {

      setSearch(e)
      axios.get(config.api + '/Products/Products', //?id='+props.user.id,
        { params:
            {
              search: e
            }})
      .then(function (res) {
          props.setProducts(res.data)
          navigate("/")
      })
      .catch (error => {
        console.log(error)
      })
    }

useEffect(() => {
  }, []);

  const age = getYearsFull(new Date() , new Date(2013,1,1,0,0,0,0))

  const { classes } = props;
  return (
    // #eeede8  efa29a
    
    <Box className="main-section" >

    {/* <Box sx={{ background: "linear-gradient(135deg, #733b89 0%, #6f4b93 17%, #6475af 50%, #52b8da 95%, #50c0df 100%)", color: "#fff", alignContent: "center", justifyItems: "center", height: "70px" }} > 
      <Box spacing={2} className="center-content" >
        <Typography sx={{  }}>- {age} years of trading a wide range of high quality fabrics -</Typography>
      </Box>
    </Box> */}

    <Box sx={{ color: "#222", alignContent: "center", justifyItems: "center", height: "90px" }} > 
      
        <Box 
          spacing={2} 
          className="center-content">
            <Box 
          sx={{ 
            display: "flex", 
            gridTemplateColumns: "1fr 1fr 1fr",
            columnGap: "40px",
            fontSize: "16px",
            alignItems: "center"  }}>


          <Grid item sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-start", minWidth: "260px"}}>

            <Tooltip title={"Home page"}>
              <IconButton onClick={(e)=>{navigate("/")}} sx={{ p: 0, ml: 2, mr: "10px" }}>
                <HomeOutlinedIcon fontSize="26px" sx={buttonStyle} />
              </IconButton>
            </Tooltip>

            <Link to="/orders" style={{ textDecoration: 'none' }} >
              <Tooltip title="Your orders"  >
                <IconButton onClick={(e)=>{navigate("/orders")}} sx={{ p: 0, ml: 0, mr: "10px" }}>
                  <PersonOutlineOutlinedIcon fontSize="large" sx={buttonStyle} />
              </IconButton>
              </Tooltip>
            </Link>
        
            <Tooltip title={shopCart && shopCart.length>0  ? shopCart + " items" : "Shopping cart is empty"}>
              <Box className="cart-label" onClick={(e)=>{ handleShowShoppingCart(true) }} >{shopCart && shopCart.length}</Box>
                <IconButton onClick={(e)=>{ navigate("/shoppingcart?what=cart") /*props.openShoppingCart(true)*/ }} sx={{ p: 0, ml: "-16px", mr: "10px" }}>
                  <ShoppingCartOutlinedIcon fontSize="large" sx={buttonStyle} />
                </IconButton>
            </Tooltip>

            <Tooltip title={shopCart && shopCart.length>0  ? shopCart + " items" : "Shopping cart is empty"}>
              <Box className="cart-label" onClick={(e)=>{ handleShowShoppingCart(true) }} >{shopCart && shopCart.length}</Box>
                <IconButton onClick={(e)=>{ navigate("/shoppingcart?what=samples") /*props.openShoppingCart(true)*/ }} sx={{ p: 0, ml: "-16px", mr: "10px" }}>
                  <ApiIcon fontSize="large" sx={buttonStyle} />
                </IconButton>
            </Tooltip>

            <Tooltip title={props.favorites != undefined ? props.favorites.amount : "Your favorite list is empty"}>
              <IconButton onClick={props.openFavorites} sx={{ p: 0, ml: 0, mr: "10px" }}>
                <FavoriteBorderOutlinedIcon fontSize="large" sx={buttonStyle} />
              </IconButton>
            </Tooltip>
            
          </Grid>


          <Grid item sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", minWidth: "260px"}}>
            <picture class="header-logo-picture" onClick={(e)=>{ navigate("/") }}>
            <img src="/afm.png" alt="Вернуться на главную" style={{padding: "10px 0", height: "88px"}}>
            </img>
            </picture>
          </Grid>


          <Grid item sx={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "flex-end", minWidth: "260px"}}>

            <TextField
              margin="normal"
              size="small" 
              id="search-value"
              placeholder="What are you looking for?"
              name="search"
              value={search}
              sx={{ width: "220px", marginTop: "8px", borderRadius: "6px" }}
              onChange={ev => { setSearch(ev.target.value); props.searchProducts(ev.target.value)}}
              // variant="standard"
              InputProps={{
                disableUnderline: true,
                sx: { fontSize: "13px"},
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
                    
          </Grid>

        </Box>
        </Box>

    </Box>
      
    <Box sx={{ alignContent: "center", height: "140px", pt: 1, background: "/fabrics.png" }} className="header-background"  >
    
      <Grid container spacing={0} sx={{ textAlign: "center" }} className="center-content" >
      
        <Grid item key={"mainsect-left"} sx={{ alignContent: "center" }} ><Box sx={{display: "flex", flexDirection: "row", justifyContent: "center" }}></Box></Grid>
        
        <Grid display={{ xs: "none", md: "block" }} item xs={12} md={4} key={"mainsect-center"} sx={{ justifyItems : "center", alignContent: "center" }} >
            &nbsp;
        </Grid>
        
        <Grid item xs={12} md={4} key={"mainsect-right"} textAlign={{ xs: "center", md: "center" }}  sx={{ alignContent: "center" }} ></Grid>

      </Grid>

    </Box>

<Box sx={{ background: "linear-gradient(135deg, #733b89 0%, #6f4b93 17%, #6475af 50%, #52b8da 95%, #50c0df 100%)", color: "#fff", fontSize: "15px", height: "60px"}}>
<nav>
  <ul className="mainmenu">
    <li>
      <a href="#0">Textile type <ExpandDown /></a>
      <ul class="columns-2">
        {props.data.textileTypes && props.data.textileTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"textileType")}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Design type <ExpandDown /></a>
      <ul class="columns-2">
        {props.data.designTypes && props.data.designTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"designType")}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Color <ExpandDown /></a>
      <ul class="columns-3">
        {props.data.colors && props.data.colors.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"color")}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li>
      <a href="#0">Season <ExpandDown /></a>
      <ul>
        {props.data.seasons && props.data.seasons.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"season")}>{item.value}</a></li>); })}
      </ul>
    </li>
    <li><a href="#0">Print type <ExpandDown /></a>
    <ul>
        {props.data.printTypes && props.data.printTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"printType")}>{item.value}</a></li>); })}
      </ul>
    </li>

    <li><a href="#0">Product type <ExpandDown /></a>
    <ul>
        {props.data.printTypes && props.data.productTypes.map((item) => { return (
          <li><a href="#0" onClick={() => handleFilter(item,"productType")}>{item.value}</a></li>); })}
      </ul>
    </li>

    <li><a href="#0">Contacts <ExpandDown /></a>
    <ul style={{ minWidth: "200px" }} >
      <Box sx={{ minWidth: "200px" }} >
      <b>Showroom address:</b><br/>
      <Box sx={{margin: "5px 0 0 10px"}}>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia<br/>
      Postal code: 141009<br/></Box>
      <b>Phones:</b><br/>+7 (926) 018-01-25 <br/>+7(916) 876-20-08<br/>
      <b>Headquarters:</b><br/>
      <Box sx={{padding: "5px 0 0 10px"}}>
      Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia<br/>
      Postal code: 123242</Box>
    </Box>
      </ul>
    </li>

  </ul>
</nav>
</Box>
</Box>
  );
}


