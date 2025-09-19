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
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { colors, FormControl, Icon, Typography } from "@mui/material";
import { Paid } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import { InputLabel } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import Property from '../../components/property';
import MySelect from '../../components/myselect';
import MyText from '../../components/mytext';
import OrderItemStatus from '../../components/orderitemstatus';
import { APPEARANCE } from '../../appearance';

import { orderStatusString, formattedDate, quantityInfo, computePrice  } from "../../functions/helper"
import { getCurrencies } from '../../api/currencies'
import MySelectLab from "../../components/myselectlab";

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "940px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
//const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
//const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }
const buttonStyle = { height: 26, backgroundColor: "#222", color: APPEARANCE.WHITE, textTransform: "none" }
const disableStyle = { height: 26, backgroundColor: "#ccc", color: APPEARANCE.WHITE, textTransform: "none" }
const labelStyle = { m: 0, ml: 0, mr: 0 }
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0, mb: 0 }

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
  const [paySumm, setPaySumm] = useState([])
  const [currencies, setCurrencies] = useState([])
  //const [expand, setExpand] = useState(new Set())

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
    let exp = expand
    exp[index] = !exp[index]
    /*if (expand.has(index)) {
      exp.delete(index)
    } else {
      exp.add(index)
    }*/
    setExpand(exp)
    setToggle(!toggle)
  }

    const loadOrders = async (e) => {

      axios.get(config.api + '/Orders?vendorId=' + props.user.vendorId 
        //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
      ).then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                  id        : d.id,
                  created   : d.created,
                  vendorId  : d.vendorId,
                  uuid      : d.uuid,
                  number    : d.number,
                  vendorName: d.vendorName,
                  clientName: d.clientName,
                  clientPhone: d.clientPhone,
                  clientEmail: d.clientEmail,
                  clientAddress: d.clientAddress,
                  paySumm   : d.paySumm,
                  makePayment: false,
                  items : d.items.map(i => { return {
                  id        : i.id,
                  productId : i.productId,
                  orderId   : i.orderId,
                  imagePath : i.imagePath,
                  itemName  : i.itemName,
                  artNo     : i.artNo,
                  refNo     : i.refNo,
                  design    : i.design,
                  spec      : i.composition,
                  price     : i.price,
                  owner     : i.vendorName,
                  quantity  : i.quantity,
                  unit      : i.unit,
                  rollLength: i.rollLength,
                  colorNames: i.colorNames,
                  colorNo   : i.colorNo,
                  total     : i.total,
                  details   : i.details,
                  delivered : i.delivered,
                  shipped   : i.shipped,
                  paid      : i.paid,
                  deliveryNo: i.deliveryNo,
                  deliveryCompany : i.deliveryCompany,
                  changes: false }}) }
              })
          setOrders(result)
          setFilter(false)
          setDetail(result.map((e)=> { return e.details }))
          setPaySumm(result.map((e)=> { return "" }))
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

    const setTransportCompany = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].orderId == orderId && ords[j].id == id) {
              ords[j].deliveryCompany = value
              ords[j].changes = true
              setOrders(ords)
              break
            }
          }
    }

    const makePayment = (orderIndex) => {
      if (orders[orderIndex].makePayment) {
        
      }
      let ords = [...orders]
      ords[orderIndex].makePayment = !ords[orderIndex].makePayment;
      setOrders(ords)
    }

    const setPay = (orderIndex, value) => {
      let ords = [...orders]
      ords[orderIndex].paySumm = value;
      setOrders(ords)
    }

    const setCurrency = (orderIndex, value) => {
      let ords = [...orders]
      ords[orderIndex].currency = value;
      setOrders(ords)
    }


    useEffect(() => {
      loadOrders()
      getCurrencies(setCurrencies)
    }, []);


    useEffect(() => {
    }, [expand]);

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

        {/* <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pb: 3, pr: 6, textAlign: "left" }} > {"Order list of " + props.user.vendorName}</Box>  */}
        <Header transparent={true} text={"Order list of " + props.user.vendorName} />
          
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "55px 85px 65px 90px 1fr 70px 90px 150px 30px",
          columnGap: "4px",
          rowGap: "0px",
          alignItems: "center",
          fontSize: "15px" }}>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Photo"/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Art.no."/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Ref.no."/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Design"/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Item name"/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Amount"/></Grid>
            <Grid item sx={{marginBottom: "4px"}}><Header text="Details"/></Grid>
            <Grid item sx={{gridColumn: "8 / span 2", marginBottom: "4px"}}><Header text="Status"/></Grid>

            

    {orders.map((order, indexOrder) => (
      <React.Fragment>
        <Grid item sx={{ 
          gridColumn: "1 / -1", 
          backgroundColor: "#eee", 
          padding: "10px",
          margin: "10px 0",
          //border: "1px solid #ccc",
          borderRadius: "6px",
          display: "grid",
          gridTemplateColumns: "70px 150px 70px 1fr 80px 90px 30px 130px",
          columnGap: "4px",
          rowGap: "0px",
          flexDirection: "row",
          height: "80px" }} visibility={"visible"} > 
        
            <Typography>Order No.</Typography> 
            <Typography><span className="my-val-1">{order.number}</span>&nbsp;dated&nbsp;<span className="my-val-1">{formattedDate(order.created)}</span></Typography>
            <Typography sx={{paddingLeft: "20px"}}>Client:</Typography>
            <Typography><span className="my-val-1">{order.clientName}&nbsp;{order.clientPhone}</span></Typography>
            <Typography sx={{ gridColumn: "5 / 5", gridRow: "1 / span 2"}}>
               { order.makePayment && <MyText 
                label="Pay summ" 
                value={order.paySumm}
                width="80px"
                onChange={value => { setPay(indexOrder, value)}}></MyText> }
              </Typography> 
              <Typography sx={{ gridColumn: "6 / 6", gridRow: "1 / span 2"}}>
              { order.makePayment && <MySelectLab 
                            label="Currency"
                            valueName="shortName"
                            width="80px"
                            disabled={false}
                            valueVariable={order.currency}
                            setValueFn={(value) => { setCurrency(indexOrder, value) }}
                            data={currencies}
                          /> }
                          </Typography>
                          <Typography></Typography>
            <Button 
              onClick={(e)=>{ makePayment(indexOrder); }} 
              //edge="end" 
              disabled={false}
              sx={{
                gridRow: "1 / span 2",
                gridColumn: "8 / 8",
                // visibility: !data.details ? "hidden":"visible", 
                backgroundColor: false ? "#ccc" : "#222",
                //border: !data.changes ? "none" : "1px solid #aaa",
                borderRadius: "3px",
                color: false ? "#fff" : "#fff", 
                borderRadius: "2px", 
                height: "30px", 
                minWidth: "20px", 
                fontSize: "14px", 
                marginLeft: "auto",
                padding: "4px 8px",
                textTransform: "none"}}>
                  { order.makePayment && <React.Fragment>Save</React.Fragment> }
                  { !order.makePayment && <React.Fragment>Make a payment</React.Fragment> }
            </Button>
            
          
            <Typography>Paid:</Typography> 
            <Typography><span className="my-val-1">{order.paySumm}&nbsp;$</span></Typography> 
            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            <Typography></Typography>
            
        </Grid>

      {order.items.map((data, index) => (
        <React.Fragment>
        <Link to={"/updateproduct?id=" + data.productId } style={{ textDecoration: 'none' }} >
          <Grid item>
                
                  <img 
                    src={config.api + "/" + data.imagePath}
                    width={50}
                    height={40}
                    style={{padding: "4px 0 0 0" }}
                    alt={data.itemName}
                /> 
          </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item ><span className="my-val">{data.artNo}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item ><span className="my-val">{data.refNo}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item ><span className="my-val">{data.design}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item ><span className="my-val">{data.itemName}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        {/* <Grid item >{data.quantity}&nbsp;{data.unit}</Grid> */}
        <Grid item sx={{textAlign: "center"}}><span className="my-val">{quantityInfo(data)}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{textAlign: "center"}}><span className="my-val">{!!data.details? data.details + ' m' : "-"}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item ><span className="my-val">{orderStatusString(data)}</span></Grid>
        </Link>

        <Grid item >
          {/* <IconButton aria-label="Expand" size="small" sx={{backgroundColor: "#f2f2f2", border: "none", borderRadius: "2px", margin: "0px", padding: "2px 4px" }}>
          <KeyboardArrowDownIcon 
            sx={{ color: "#666", fontSize: 22 }}
            onClick={(e)=>{toggleExpand(index)}} >
          </KeyboardArrowDownIcon>
          </IconButton>  */}
        </Grid>


        </React.Fragment> 
      ))}

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