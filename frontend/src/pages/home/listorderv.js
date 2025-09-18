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
import { colors, FormControl, Icon } from "@mui/material";
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

import { orderStatusString, fined, status, quantityInfo, computePrice, notNull } from "../../functions/helper"
import { getTransportCompanies } from '../../api/vendors'
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
  const [transportCompanies, setTransportCompanies] = useState([])
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

      axios.get(config.api + '/OrderItems?vendorId=' + props.user.vendorId 
        //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
      ).then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                  id        : d.id,
                  productId : d.productId,
                  orderId   : d.orderId,
                  imagePath : d.imagePath,
                  itemName  : d.itemName,
                  artNo     : d.artNo,
                  refNo     : d.refNo,
                  design    : d.design,
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

    const setDeliveryNo = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].orderId == orderId && ords[j].id == id) {
              ords[j].deliveryNo = value
              ords[j].changes = true
              setOrders(ords)
              break
            }
          }
    }

    useEffect(() => {
      loadOrders()
      getTransportCompanies(props.user.vendorId, setTransportCompanies)
    }, []);


    useEffect(() => {
    }, [expand]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  console.log("expand");
  console.log(expand);

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

            

    {orders.map((data, index) => (
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
                
                </Grid></Link>

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
          <IconButton aria-label="Expand" size="small" sx={{backgroundColor: "#f2f2f2", border: "none", borderRadius: "2px", margin: "0px", padding: "2px 4px" }}>
          <KeyboardArrowDownIcon 
            sx={{ color: "#666", fontSize: 22 }}
            onClick={(e)=>{toggleExpand(index)}} >
          </KeyboardArrowDownIcon>
          </IconButton> 
        </Grid>

        { expand[index] && <Grid item sx={{ gridColumn: "1 / -1" }} visibility={"visible"} > 
        <Box sx={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center",
            columnGap: "10px", 
            height: "85px", 
            padding: "10px", 
            backgroundColor: "#f4f4f4"}} >
          <MyText 
            label="Details" 
            value={data.details}
            onChange={value => { setDetails(data.orderId, data.id, value)}}
          ></MyText>
          <MySelectLab 
              label="Delivery company"
              valueName="deliveryCompany"
              width="160px"
              disabled={!data.paid}
              valueVariable={data.deliveryCompany}
              setValueFn={(value) => { setTransportCompany(data.orderId, data.id, value) }}
              data={transportCompanies}
            />
          <MyText label="Delivery No." value={data.deliveryNo}></MyText>
          {/* <TextField //label="Details"
              margin="normal"
              size="small" 
              id={"valuedetails-" + index}
              name={"valuedetails-" + index}
              label={!!data.details ? "" : "Details"}
              sx={{marginTop: 0, backgroundColor: !!data.details ? "none" : "#fcc"}}
              value={data.details}
              onChange={ev => { setDetails(data.orderId, data.id, ev.target.value)}} /> */}
          <Button 
            onClick={(e)=>{ saveOrderItem(index) }} 
            edge="end" 
            disabled={!data.changes}
            sx={{
              // visibility: !data.details ? "hidden":"visible", 
              backgroundColor: !data.changes ? "#ccc" : "#222",
              //border: !data.changes ? "none" : "1px solid #aaa",
              borderRadius: "3px",
              color: !data.changes ? "#fff" : "#fff", 
              borderRadius: "2px", 
              height: "32px", 
              minWidth: "20px", 
              fontSize: "14px", 
              marginTop: "15px",
              padding: "6px 10px",
              textTransform: "none"}}>
                Save
          </Button>

          </Box>
        </Grid> }
        { !expand[index] && <Grid item sx={{ gridColumn: "1 / -1" }} visibility= {"collapse"} > 
        <Box height={0} ></Box>
        </Grid> }

        {/* <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <div style={{height: "82px", textAlign: "center"}} >
          <TextField //label="Details"
              margin="normal"
              size="small" 
              id={"valuedetails-" + index}
              name={"valuedetails-" + index}
              label={!!data.details ? "" : "Details"}
              sx={{marginTop: 0, backgroundColor: !!data.details ? "none" : "#fcc"}}
              value={data.details}
              onChange={ev => { setDetails(data.orderId, data.id, ev.target.value)}} />
              { !!data.total && <span className="my-val" style={{fontSize: "14px"}}>{data.total + " m."}</span> }
                </div>
        </Grid>

        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <div style={{marginTop: "3px"}}>
            <MySelect 
              id="transportCompanies"
              title="Delivery company"
              hideLabel={!!data.deliveryCompany}
              valueName="deliveryCompany"
              labelStyle={labelStyle}
              itemStyle={itemStyle1}
              disabled={!data.paid}
              MenuProps={MySelectProps}
              valueVariable={data.deliveryCompany}
              setValueFn={(value) => { setTransportCompany(data.orderId, data.id, value) }}
              data={transportCompanies}
            />
            </div>
          <TextField
              margin="normal"
              size="small" 
              disabled={!data.paid}
              label={!!data.deliveryNo ? "" : "Delivery no."}
              id={"valueDeliveryNo-" + index}
              name={"valueDeliveryNo-" + index}
              sx={{marginTop: "0px"}}
              value={data.deliveryNo}
              onChange={ev => { setDeliveryNo(data.orderId, data.id, ev.target.value)}}/>
          <Property value={ "Delivery:  " + fined(data.deliveryCompany) } />
          <Property value={ "Track no: " + fined(data.deliveryNo)} /> 
        </Grid>

<Grid item sx={{display: "flex", flexDirection: "column"}}>
  <div style={{height: "82px", textAlign: "center"}}>
        <Button 
            onClick={(e)=>{ saveOrderItem(index) }} 
            edge="end" 
            disabled={!data.changes}
            sx={{
              //visibility: !data.changes ? "hidden":"visible",
              backgroundColor: !data.changes ? "#ccc" : "#222",
              //border: !data.changes ? "none" : "1px solid #aaa",
              borderRadius: "3px",
              color: !data.changes ? "#fff" : "#fff", 
              borderRadius: "2px", 
              height: "26px", 
              minWidth: "20px", 
              fontSize: "14px", 
              marginTop: "2px",
              textTransform: "none"}}>
                Save
          </Button>
          </div>
          </Grid> */}
          
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