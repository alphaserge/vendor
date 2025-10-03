import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { Link } from 'react-router-dom';
import { colors, FormControl, Icon, Typography } from "@mui/material";
import { Paid, Payments } from "@mui/icons-material";
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

import { orderStatusString, formattedDate, quantityInfo, computePrice, safeFixed } from "../../functions/helper"
import { getCurrencies, getCourse } from '../../api/currencies'
import { postPayment, orderPayments } from '../../api/payments'
import { getTransportCompanies } from '../../api/vendors'
import { getStocks } from '../../api/stocks'
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

export default function ListOrder(props) {

  const navigate = useNavigate();

  const [toggle, setToggle] = useState(false)
  const [orders, setOrders] = useState([])
  const [expand, setExpand] = useState([])
  const [detail, setDetail] = useState([])
  const [filter, setFilter] = useState(false)
  const [paySumm, setPaySumm] = useState([])
  const [currencies, setCurrencies] = useState([])
  const [courseRur, setCourseRur] = useState(0)
  const [transportCompanies, setTransportCompanies] = useState([])
  const [stocks, setStocks] = useState([])
    
  //const [expand, setExpand] = useState(new Set())

  const saveOrderItem = async (id) => {

    var orderIndex = -1
    var itemIndex = -1
      for (let j=0; j< orders.length; j++) {
      for (let i=0; i< orders[j].items.length; i++) {
        if (orders[j].items[i].id == id) {
            orderIndex = j
            const data = JSON.stringify({
                id: orders[j].items[i].id,
                stock: orders[j].items[i].stockName,
                clientDeliveryCompany: orders[j].items[i].clientDeliveryCompany,
                clientDeliveryNo: orders[j].items[i].clientDeliveryNo,
              })

            await axios.post(config.api + '/OrderItemUpdate', data, {headers:{"Content-Type" : "application/json"}})
              .then(function (response) {
                console.log('response for OrderItemUpdate:');
                console.log(response);
                let ords = [...orders]
                ords[orderIndex].items[itemIndex].changes = false
                setOrders(ords)
                return true;
              })
              .catch(function (error) {
                console.log(error);
                return false;
              })

            break
            }
          }
        }
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
    let ords = orders
    ords[index].expand = !ords[index].expand
    /*if (expand.has(index)) {
      exp.delete(index)
    } else {
      exp.add(index)
    }*/
    setOrders(ords)
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
                  payments  : d.payments,
                  total     : d.items.reduce((accumulator, value) => { return accumulator + value.price*value.quantity; }, 0),
                  makePayment: false,
                  expand: false,
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
                  vendorName: i.vendorName,
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
                  clientDeliveryNo: i.clientDeliveryNo,
                  clientDeliveryCompany : i.clientDeliveryCompany,
                  stockName : i.stockName,
                  changes: false,
                  expand : true }}) }
              })
          setOrders(result)
          setFilter(false)
          setDetail(result.map((e)=> { return e.details }))
          setPaySumm(result.map((e)=> { return "" }))
          const desiredLength = result.length;
          setExpand(new Array(desiredLength).fill(false))
          const courseRur = getCourse(setCourseRur,'rur')
          })      
      .catch (error => {
        console.log(error)
      })
    }

    const setTransportCompany = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
      for (let i=0; i< ords[j].items.length; i++) {
        if (ords[j].id == orderId && ords[j].items[i].id == id) {
              ords[j].items[i].clientDeliveryCompany = value
              ords[j].items[i].changes = true


              setOrders(ords)
              break
            }
          }
        }
    }

    const setDeliveryNo = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
      for (let i=0; i< ords[j].items.length; i++) {
        if (ords[j].id == orderId && ords[j].items[i].id == id) {
              ords[j].items[i].clientDeliveryNo = value
              ords[j].items[i].changes = true
              setOrders(ords)
              break
            }
          }
        }
    }

    const setStock = (orderId, id, value) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
      for (let i=0; i< ords[j].items.length; i++) {
        if (ords[j].id == orderId && ords[j].items[i].id == id) {
              ords[j].items[i].stockName = value
              ords[j].items[i].changes = true
              setOrders(ords)
              break
            }
          }
        }
    }

    const updatePayment = (orderIndex) => {
      orderPayments(orders[orderIndex].id, (payments, total) => { 
        let ords = [...orders]  
        ords[orderIndex].payments = payments
        ords[orderIndex].paySumm = total
        setOrders(ords)
      } )
    }

    const makePayment = async (orderIndex) => {
      let ords = [...orders]
      let addSumm = 0
      if (ords[orderIndex].makePayment) {
        let order = ords[orderIndex]
        let currency = ''
        currencies.forEach((c)=> { if (c.id == order.currencyNew) { currency = c.value } })
        let pay = { 
          amount: parseFloat(order.paySummNew), 
          currencyAmount: parseFloat(order.paySummNew), 
          currencyId: order.currencyNew, 
          orderId: order.id, 
          date: new Date() 
        }
        await postPayment(pay)
        //pay.currency = currency
        //order.payments.push(pay)

        setTimeout( () =>  { 
          updatePayment(orderIndex) 
        }, 500)

        /* todo - courses cash 
        let curShort = currencies.find(({ id }) => id == order.currencyNew);
        if (!!curShort) {s
          const crs = await getCourse(curShort.value)
          addSumm = parseFloat(order.paySummNew)*crs
          ords[orderIndex].paySumm += addSumm
        }*/
       //temp:
        //let course = order.currencyNew == 1 ? 1 : courseRur
        //addSumm = parseFloat(order.paySummNew) / (course > 0 ? course : 1e-9)
        //ords[orderIndex].paySumm += addSumm
      }
      ords[orderIndex].makePayment = !ords[orderIndex].makePayment
      setOrders(ords)
    }

    const setPay = (orderIndex, value) => {
      let ords = [...orders]
      ords[orderIndex].paySummNew = value;
      setOrders(ords)
    }

    const setCurrency = (orderIndex, value) => {
      let ords = [...orders]
      ords[orderIndex].currencyNew = value;
      setOrders(ords)
    }


    useEffect(() => {
      loadOrders()
      getCurrencies(setCurrencies)
      getTransportCompanies(props.user.vendorId, setTransportCompanies)
      getStocks(setStocks)
    }, []);


    useEffect(() => {
    }, [toggle]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }


  console.log(stocks);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        <div>

        <Box component="form" noValidate style={outboxStyle}>

        {/* <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pb: 3, pr: 6, textAlign: "left" }} > {"Order list of " + props.user.vendorName}</Box>  */}
        <Typography sx={{textAlign: "center", fontSize: "16px", fontWeight: "500", padding: "10px 0 15px 0", color: "#444"}} >{"Order list of " + props.user.vendorName} </Typography>
          
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "65px 105px 100px 1fr 120px 70px 110px 120px 30px",
          columnGap: "0px",
          rowGap: "0px",
          alignItems: "flex-start",
          fontSize: "15px" }}>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Photo"/></Grid>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Art / Ref no."/></Grid>
            {/* <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Ref.no."/></Grid> */}
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Design"/></Grid>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Item name"/></Grid>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Vendor"/></Grid>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Amount"/></Grid>
            <Grid item sx={{marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Details"/></Grid>
            <Grid item sx={{gridColumn: "8 / span 2", marginBottom: "4px", position: "sticky", top: "70px", zIndex: 10}}><Header text="Status"/></Grid>

    {orders.map((order, indexOrder) => (
      <React.Fragment>
        <Grid item sx={{ 
          gridColumn: "1 / -1", 
          backgroundColor: "#eee", // "#cfe1ed", 
          padding: "10px",
          margin: "10px 0",
          //border: "1px solid #ccc",
          //borderRadius: "6px",
          display: "grid",
          gridTemplateColumns: "1fr 20px 70px 190px 60px",
          gridTemplateRows: "auto 1fr",
          columnGap: "4px",
          rowGap: "0px",
          flexDirection: "row",
          alignItems: "flex-start",
          minHeight: "70px" }} visibility={"visible"} > 
        
        <table className="my-val-1" sx={{ gridRow: "1 / span 2", gridColumn: "1 / 1" }}>
          <tr>
            <td className="caption w100">Order No:</td><td><span className="fw600">{order.number}</span>&nbsp;dated&nbsp;{formattedDate(order.created)}</td>
          </tr>
          <tr>
            <td className="caption w100">Client:</td><td>{order.clientName}&nbsp;&nbsp;{order.clientPhone},&nbsp;&nbsp;{order.clientEmail}</td>
          </tr>
          {/* <tr>
            <td className="caption w100">Contacts:</td><td>{order.clientPhone},&nbsp;&nbsp;{order.clientEmail}</td>
          </tr> */}
          <tr>
            <td className="caption w100">Total summ:</td><td><span className="fw600">{ safeFixed(order.total, 2) }&nbsp;usd</span></td>
          </tr>
        </table>
            <Typography></Typography>
            <Typography> { !order.makePayment && order.payments.length > 0 && <span className="caption">Payments:</span> }</Typography>
            { !order.makePayment && <Box sx={{ gridRow: "1 / span 2", gridColumn: "4 / 4" }}>
            <table style={{marginTop: "-4px"}}>
              {order.payments.map((data, index) => (
                <tr>
                <td className="my-val-1">{formattedDate(data.date)}</td>
                <td style={{textAlign: "center"}}>-</td>
                <td className="my-val-1" style={{textAlign: "right"}}>{ safeFixed(data.amount,2) }</td>
                <td style={{textAlign: "center"}}>{data.currency}</td>
                </tr>
              ))}
              <tr>
              <td className="caption">Paid total</td>
              <td style={{textAlign: "center"}}>-</td>
              <td className="my-val-1" style={{textAlign: "right"}}><span className="fw600">{ safeFixed(order.paySumm, 2) }</span></td>
              <td style={{textAlign: "center"}}><span className="fw500">usd</span></td>
              </tr>
              </table>
              {/* <span className="my-val-1">Order total</span>
              <span style={{textAlign: "center"}}>-</span>
              <span className="my-val-1">{order.total}&nbsp;usd</span> */}
            </Box> }

            { order.makePayment && <Box sx={{ gridRow: "1 / span 2", gridColumn: "4 / 4", display: "grid", gridTemplateColumns: "100px  100px"}}>
               <Typography>
               <MyText 
                label="Pay summ" 
                value={order.paySummNew}
                width="80px"
                onChange={value => { setPay(indexOrder, value)}}></MyText>
              </Typography> 
              <Typography >
              <MySelectLab 
                label="Currency"
                valueName="shortName"
                width="80px"
                disabled={false}
                valueVariable={order.currencyNew}
                setValueFn={(value) => { setCurrency(indexOrder, value) }}
                data={currencies}
              /> 
              </Typography>
            </Box> }

<Box sx={{display: "flex", flexDirection: "column", height: "100%"}}>
  <Button 
              onClick={(e)=>{ makePayment(indexOrder); }} 
              //edge="end" 
              disabled={false}
              sx={{
                //gridRow: "1 / span 2",
                //gridColumn: "8 / 8",
                // visibility: !data.details ? "hidden":"visible", 
                backgroundColor: false ? "#ccc" : "#627eb5",
                //border: !data.changes ? "none" : "1px solid #aaa",
                borderRadius: "3px",
                color: false ? "#fff" : "#fff", 
                borderRadius: "2px", 
                height: "26px",
                minWidth: "20px", 
                fontSize: "14px", 
                margin: "0px", padding: "2px 4px",
                //padding: "0 10px",
                textTransform: "none"}}>
                  { order.makePayment && <React.Fragment>Save</React.Fragment> }
                  { !order.makePayment && <React.Fragment>Add</React.Fragment> }
            </Button>
  
                      <IconButton aria-label="Expand" size="small" sx={{backgroundColor: "#f2f2f2", border: "none", borderRadius: "2px", margin: "0px", padding: "2px 4px", marginTop: "auto" }}>
                      <KeyboardArrowDownIcon 
                        sx={{ color: "#666", fontSize: 22 }}
                        onClick={(e)=>{ toggleExpand(indexOrder)}} >
                      </KeyboardArrowDownIcon>
                      </IconButton> 
                    
  </Box>
            
            
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
                    width={60}
                    height={50}
                    style={{padding: "4px 0 0 0" }}
                    alt={data.itemName}
                /> 
          </Grid>
        </Link>

        {/* <Link to={"/updateproduct?id=" + data.productId} >
        <Grid item ><span className="my-val">{data.artNo}</span></Grid>
        </Link> */}

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{ textAlign: "center" }} ><span className="my-val">{data.artNo}<br/>{data.refNo}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{ textAlign: "center" }} ><span className="my-val">{data.design}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{ textAlign: "center" }} ><span className="my-val">{data.itemName}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{ textAlign: "center" }} ><span className="my-val">{data.vendorName}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        {/* <Grid item >{data.quantity}&nbsp;{data.unit}</Grid> */}
        <Grid item sx={{textAlign: "center"}}><span className="my-val">{quantityInfo(data)}</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{textAlign: "center"}}><span className="my-val">{!!data.details? data.details : "-"}</span><br/><span className="my-val">({data.total + ' m'})</span></Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{ textAlign: "center" }} ><span className="my-val">{OrderItemStatus(data)}</span></Grid>
        </Link>

        <Grid item sx={{ textAlign: "center" }} >
          {/* <IconButton aria-label="Expand" size="small" sx={{backgroundColor: "#f2f2f2", border: "none", borderRadius: "2px", margin: "0px", padding: "2px 4px" }}>
          <KeyboardArrowDownIcon 
            sx={{ color: "#666", fontSize: 22 }}
            onClick={(e)=>{toggleExpand(index)}} >
          </KeyboardArrowDownIcon>
          </IconButton>  */}
        </Grid>

        { order.expand && <Grid item sx={{ gridColumn: "1 / -1" }} visibility={"visible"} > 
        <Box sx={{ 
            display: "flex", 
            flexDirection: "row", 
            alignItems: "center",
            columnGap: "10px", 
            height: "85px", 
            padding: "0 10px 0 0", 
            backgroundColor: "#f2f2f2"}} >
              <Box sx={{display: "flex", 
                flexDirection: "column", 
                alignItems: "flex-start", 
                padding: "10px"}}>
                  <Typography className="caption mb4" >Vendor delivery:</Typography>
                  <Typography>No.&nbsp;{data.deliveryNo}&nbsp;-&nbsp;{data.deliveryCompany}</Typography>
              </Box>
          <MySelectLab 
              label="Stock"
              valueName="stockName"
              width="130px"
              //disabled={!data.paid}
              valueVariable={data.stockName}
              setValueFn={(value) => { setStock(data.orderId, data.id, value) }}
              data={stocks}
            />
          <MySelectLab 
              label="Customer delivery company"
              valueName="clientDeliveryCompany"
              width="180px"
              //disabled={!data.paid}
              valueVariable={data.clientDeliveryCompany}
              setValueFn={(value) => { setTransportCompany(data.orderId, data.id, value) }}
              data={transportCompanies}
            />
            <Box sx={{marginTop: "7px"}}>
            <MyText label="Delivery No." value={data.clientDeliveryNo} onChange={value => { setDeliveryNo(data.orderId, data.id, value)}}></MyText>
            </Box>
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
            onClick={(e)=>{ saveOrderItem(data.id) }} 
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