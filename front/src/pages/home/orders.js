import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles, withStyles } from '@mui/styles';
import { Typography } from "@mui/material";

import FormControlLabel from '@mui/material/FormControlLabel';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';

import axios from 'axios'

import config from "../../config.json"
import Footer from './footer';
import { Button  } from "@mui/material";

import { getCourse } from '../../api/currencies'
import { getPayments } from '../../api/payments'
import PageHeader from '../../components/pageheader';
import Header from '../../components/header';
import MainSection from './mainsection';
import { formattedPrice, orderStatusString, fined, idFromUrl, formattedDate, toFixed2 } from "../../functions/helper";
import StyledButton from '../../components/styledbutton';
import StyledButtonWhite from '../../components/styledbuttonwhite';
import StyledIconButton from '../../components/stylediconbutton';
import IconButtonWhite from "../../components/iconbuttonwhite";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledTextField from '../../components/styledtextfield';

const defaultTheme = createTheme()

const theme = createTheme({
  overrides: {
    MuiCheckbox: {
      colorSecondary: {
        color: '#custom color',
        '&$checked': {
          color: '#custom color',
        },
      },
    },
  },
});

const linkStyle = { textDecoration: 'none', height: "100%" }
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }

export default function Orders(props) {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [invoiceUrl, setInvoiceUrl] = useState("")
  const [payerName, setPayerName] = useState( !props.data.user.payerName ? "" : props.data.user.payerName )

  const logout = () => {
    props.data.logOut()
  }

  const loadOrders = async (e) => {

    if (!props.data.user || props.data.user.email=="") {
        navigate("/login?return=orders")
        return
      }

      let id = idFromUrl()

      let api = config.api + '/ClientOrders'
      axios.get(api, {  params: { email: props.data.user.email }})
      .then(function (res) { return setOrders(res.data) })
      .catch (error => {
        console.log(error)
      })
   }
        
  useEffect(() => {
    loadOrders()
    //setCourseRur(getCourse(setCourseRur,'rur'))
  }, [])

  if (!props.data.user || props.data.user.Id === 0) {
    navigate("/login")
  }
  
  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

        <Box className="center-content" sx={{minHeight: "300px", padding: "0 0 0 135px"}}>
        <PageHeader value="Your orders list"></PageHeader>
        {/* <Box sx={{display: "flex", alignItems: "center", maxWidth: 650, margin: "20px 0 10px"}}>
          <PageHeader value="Your orders list"></PageHeader>
          <StyledButtonWhite sx={{ marginLeft: "auto" }} onClick={(e)=>{logout(); navigate("/")}}>Log out</StyledButtonWhite>
        </Box> */}
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "120px 120px 120px 120px",
          columnGap: "10px",
          rowGap: "20px",
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item><Header text="Number"></Header></Grid>
                  <Grid item><Header text="Date"></Header></Grid>
                  <Grid item><Header text="Items"></Header></Grid>
                  <Grid item><Header text="Total USD"></Header></Grid>
                  {/* <Grid item><Header text="Status"></Header></Grid> */}
                  {/* <Grid item><Header text="Paid"></Header></Grid> */}
            
                { orders.map((data, index) => ( 
              <React.Fragment>
                <Link to={"/order?uuid=" + data.uuid } ><Grid item sx={{textAlign: "center"}}>{data.number.toString().padStart(4, '0')}</Grid></Link>
                <Link to={"/order?uuid=" + data.uuid } ><Grid item sx={{textAlign: "center"}}>{formattedDate(data.created)}</Grid></Link>
                <Link to={"/order?uuid=" + data.uuid } ><Grid item sx={{textAlign: "center"}}>{data.items.length}</Grid></Link>
                <Link to={"/order?uuid=" + data.uuid } ><Grid item sx={{textAlign: "center"}}>{toFixed2(data.totalCost)} $</Grid></Link>
                {/* <Link to={"/orders?id=" + data.id } ><Grid item sx={{textAlign: "cent+er"}}>{data.status}</Grid></Link> */}
              </React.Fragment> ))}
        </Box>
        </Box>

        <br/><br/>

      <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
