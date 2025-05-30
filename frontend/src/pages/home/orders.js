import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import axios from 'axios'

import config from "../../config.json"

import Header from './header';
import Footer from './footer';

import ItemOrder  from './itemorder';
import ItemOrderRow from './itemorderrow';
import VendorOrderRow from './vendororderrow';
import MySelect from '../../components/myselect';
import { getOrders, vendorQuantity } from '../../api/orders'

import { APPEARANCE } from '../../appearance';
import { Button } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 330, m: 1, ml: 0 }
const smallItemStyle = { width: 161, m: 1, ml: 0 }
const labelStyle1 = { m: 0, mt: 1, ml: 0, mr: 4 }
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, m: 1 }
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const findBoxStyle = { width: "calc(100% - 80px)" }
const findTextStyle = { width: "100%", border: "none" }
//const findTextStyle = { width: "100%", border: "none", border: "solid 1px #888", borderRadius: 1 }
const toolButtonStyle = { width: "26px", height: "26px", marginTop: "5px" }
const flexStyle = { display: "flex", flexDirection: "row", alignItems : "center", justifyContent: "space-between" }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}


export default function Orders(props) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [view, setView] = useState("rows")
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }

    const [viewAs, setViewAs] = React.useState('incoming orders');

    const handleChangeViewAs = (event) => {
      setViewAs(event.target.value);
    };    

    const handleShowHideFilter = (event) => {
      setFilter(!filter);
    };

    const setVendorQuantity  = (id, qty) => {
      //alert(id + ' --- ' + qty)

      for (let i = 0; i < orders.length; i++) {
       for (let j = 0; j < orders[i].items.length; j++) {
        if (orders[i].items[j].id==id) {
          orders[i].items[j].vendorQuantity = qty
          break
        }
      }
      }
    }

    const sendVendorQuantity  = (index) => {
          let oo = orders[index]
          vendorQuantity(orders[index]);
          setViewAs(viewAs+'1')
    }

    const url = require('url');

    const loadOrders = async (e) => {

      let api = config.api + '/VendorOrders?vendorId=' + props.user.vendorId
      if (viewAs == 'incoming orders') {
        api += '&status=incoming'
      }
      if (viewAs == 'sent orders') {
        api += '&status=sent'
      }
      if (viewAs == 'recieved orders') {
        api += '&status=recieved'
      }

      axios.get(api, 
        /*{ params: 
            { 
              name: itemName,
              artno: artNo,
              search: search
            }}*/)
      .then(function (res) {
          var result = res.data;
          setOrders(result)
          setFilter(false)
      })
      .catch (error => {
        console.log(error)
      })
    }
        
    useEffect(() => {
      loadOrders()
    }, [viewAs]);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }

  console.log('viewAs:')
  console.log(viewAs)
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
          <Box component="form" noValidate style={outboxStyle}>

          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography gutterBottom variant="h6" component="div" mr={4} className="order-header" sx={{flexGrow: 1}} ><b>Vendor orders list</b></Typography>
            <InputLabel id="demo-simple-select-label" sx={{pr:2}}>Show:</InputLabel>
            <Select
              id="view-as-select"
              size="small"
              value={viewAs}
              onChange={handleChangeViewAs}>
              <MenuItem value={'incoming orders'}>incoming orders</MenuItem>
              <MenuItem value={'paid orders'}>paid orders</MenuItem>
              <MenuItem value={'closed orders'}>closed orders</MenuItem>
            </Select>
          </Box>

          {/* { viewAs == "dummy" &&
          <Grid container spacing={2} >
            { view === "grid" && orders.map((data, index) => (
            <Grid item xs={12} md={6} key={"itemprod-"+index} >
              <ItemOrder data={data} index={index} />
              </Grid>
            ))}
            { view === "rows" && orders.map((data, index) => (
            <Grid item xs={12} md={12} key={"itemprod-"+index} >
              <ItemOrderRow data={data} index={index} />
              </Grid>
            ))}
          </Grid> } */}

          { viewAs != "dummy" &&
          <Grid container spacing={2} >
            { view === "grid" && orders.map((data, index) => (
            <Grid item xs={12} md={6} key={"itemprod-"+index} >
              <ItemOrder data={data} index={index} />
              </Grid>
            ))}
            { view === "rows" && orders.map((data, index) => (
            <Grid item xs={12} md={12} key={"itemprod-"+index} >
              <VendorOrderRow data={data} index={index} showForVendor={true} user={props.user} setVendorQuantity={setVendorQuantity} sendVendorQuantity={sendVendorQuantity} />
              </Grid>
            ))}
          </Grid> }

          </Box>
          <br/>
          <br/>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
