import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
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
import MySelect from '../../components/myselect';
import { getOrders } from '../../api/orders'

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


export default function ListOrders(props) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [view, setView] = useState("rows")
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }

    const handleShowHideFilter = (event) => {
      setFilter(!filter);
    };

    const url = require('url');

    const loadOrders = async (e) => {

      axios.get(config.api + '/Orders', 
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
    }, []);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
    
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
          <Box component="form" noValidate style={outboxStyle}>

          <Box style={headStyle} sx={{ display: "flex", justifyContent:"left", margin: "0", alignItems: "center" }}  >
            <Tooltip title="Rows interface">
            <IconButton onClick={ (e) => { setView("rows")} } style={toolButtonStyle} sx={{mr: 0}} >
              <TableRowsIcon sx={{color: view=="grid" ? APPEARANCE.BLACK : APPEARANCE.GREY }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Grid interface">
            <IconButton onClick={ (e) => { setView("grid")} } style={toolButtonStyle} sx={{mr: 1}} >
              <GridViewIcon sx={{color: view=="grid" ? APPEARANCE.GREY : APPEARANCE.BLACK }} />
            </IconButton>
            </Tooltip>
          <Box style={findBoxStyle}>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                label="Find orders"
                name="search"
                style = {findTextStyle}
                sx={{borderRadius: "0"}}
                value={search}
                /*onChange={ev => searchOrders(ev.target.value)}*/
                InputProps={{
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

            <Tooltip title="Filters">
            <IconButton onClick={handleShowHideFilter} style={toolButtonStyle} sx={{mr: 1, ml: 1}} >
              <TuneIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
            </Tooltip>

          </Box>

          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
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
          </Grid>

          </Box>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
