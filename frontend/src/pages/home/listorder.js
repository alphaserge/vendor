import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { colors, FormControl, Icon } from "@mui/material";
import { Paid } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import { InputLabel } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import Property from '../../components/property';
import MySelect from '../../components/myselect';
import OrderItemStatus from '../../components/orderitemstatus';
import { APPEARANCE } from '../../appearance';

import { non, fined, status, quantityInfo, computePrice } from "../../functions/helper"
import { getTransportCompanies } from '../../api/vendors'

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "940px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
//const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
//const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }
const buttonStyle = { height: 26, backgroundColor: "#222", color: APPEARANCE.WHITE, textTransform: "none" }
const disableStyle = { height: 26, backgroundColor: "#ccc", color: APPEARANCE.WHITE, textTransform: "none" }
const labelStyle = { m: 0, ml: 0, mr: 0 }
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0  }

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}


export default function ListOrderV(props) {

  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false)
  const [orders, setOrders] = useState([])
  const [expand, setExpand] = useState([])
  const [detail, setDetail] = useState([])
  const [filter, setFilter] = useState(false)
  const [transportCompanies, setTransportCompanies] = useState([])

  const saveOrderItem = async (index) => {


  let data = JSON.stringify({
      id: orders[index].id,
      details: orders[index].details,
      deliveryCompany: orders[index].deliveryCompany,
      deliveryNo: orders[index].deliveryNo,
    })

  await axios.post(config.api + '/ChangeDetails', data, {headers:{"Content-Type" : "application/json"}})
    .then(function (response) {
      console.log('response for ChangeDetails:');
      console.log(response);
      let ords = [...orders]
      ords[index].changes = false
      setOrders(ords)
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    })
  };

  const postAccept = async (itemId) => {

  await axios.post(config.api + '/Accept', 
    {
      itemId: itemId,
    })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    })
  };

  const toggleExpand = (index) => {
    let exp = [...expand]
    exp[index] = !exp[index]
    setExpand(exp)
  }

    const loadOrders = async (e) => {

      axios.get(config.api + '/OrderItems?vendorId=' + props.user.vendorId  //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
      ).then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                  id        : d.id,
                  productId : d.productId,
                  orderId   : d.orderId,
                  imagePath : d.imagePath,
                  itemName  : d.itemName,
                  spec      : d.composition,
                  price     : d.price,
                  owner     : d.vendorName,
                  quantity  : d.quantity,
                  unit      : d.unit,
                  rollLength: d.rollLength,
                  colorNames: d.colorNames,
                  colorNo   : d.colorNo,
                  total     : d.total,
                  details   : d.details,
                  delivered : d.delivered,
                  shipped   : d.shipped,
                  paid      : d.paid,
                  deliveryNo: d.deliveryNo,
                  deliveryCompany : d.deliveryCompany,
                  changes: false,
                  }
              })
          setOrders(result)
          setFilter(false)
          setDetail(result.map((e)=> { return e.details }))
          const desiredLength = result.length;
          setExpand(new Array(desiredLength).fill(false))
          })      
      .catch (error => {
        console.log(error)
      })
    }

    const setDetails = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].orderId == orderId && ords[j].id == id) {
              ords[j].details = value
              ords[j].changes = true
              try { ords[j].total = eval(value) } catch (e) { ords[j].total = 0 }
              setOrders(ords)
              break
            }
          }
    }

    useEffect(() => {
      loadOrders()
      getTransportCompanies(props.user.vendorId, setTransportCompanies)
    }, [toggle]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        <div>

        <Box component="form" noValidate style={outboxStyle}>

        <Box sx={{ fontWeight: "500", fontSize: "15px", pt: 3, pb: 3, pr: 6, textAlign: "left" }} > {"Order list of " + props.user.vendorName}</Box> 
          
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "60px 1fr 1fr 90px 100px 200px 55px 70px",
          columnGap: "4px",
          rowGap: "8px",
          alignItems: "center" }}>
            <Grid item sx={{p:0, m:0}}><Header text="Photo"/></Grid>
            <Grid item sx={{p:0, m:0}}><Header text="Item name"/></Grid>
            <Grid item><Header text="Color"/></Grid>
            <Grid item><Header text="Ordered"/></Grid>
            <Grid item><Header text="Actual"/></Grid>
            <Grid item><Header text="Delivery"/></Grid>
            <Grid item><Header text="Status"/></Grid>
            <Grid item><Header text="-"/></Grid>

    {orders.map((data, index) => (
      <React.Fragment>
        <Link to={"/updateproduct?id=" + data.productId } style={{ textDecoration: 'none' }} >
          <Grid item>
                <Box sx={{padding: "8px 0 0 0" }}>
                  <img 
                    src={config.api + "/" + data.imagePath}
                    width={55}
                    height={45}
                    alt={data.itemName}
                /> 
                </Box>
                </Grid></Link>
                
        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column", height: 50, wordBreak: "break-all" }}>
          <Property value={fined(data.itemName, "-")}  />
        </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column", height: 50, wordBreak: "break-all"}}>
          <Property value={fined(data.colorNames, "-")} />
        </Grid>
        </Link>
       
        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <Property value={quantityInfo(data)} textAlign="center" />
        </Grid>
        </Link>

        <Grid item sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <Property value={fined(data.total) + (data.total + data.details!="" ? " = ": "") + fined(data.details)} textAlign="center" />
        </Grid>
        
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={ fined(data.deliveryCompany) + (data.deliveryCompany + data.deliveryNo!="" ? " / ": "") + fined(data.deliveryNo)} textAlign="center" />
        </Grid>

        <Grid item sx={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <OrderItemStatus item={data} />
        </Grid>

        <Button 
            onClick={(e)=>{ saveOrderItem(index) }} 
            edge="end" 
            sx={{
              visibility: !data.details ? "hidden":"visible",
              backgroundColor: "#777", 
              color: "#fff", 
              borderRadius: "2px", 
              height: "26px", 
              minWidth: "20px", 
              fontSize: "14px", 
              fontWeight: "333",
              textTransform: "none"}}>
                Payment
          </Button>

      </React.Fragment>
    ))}

    </Box>
    </Box>
    <br/>
    <br/>
    </div>
    <Footer />
    </Container>
              
    </ThemeProvider>
  );
}
