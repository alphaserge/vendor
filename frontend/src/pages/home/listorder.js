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
//import { Paid, Payments } from "@mui/icons-material";
import TextField from '@mui/material/TextField';
import { InputLabel } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import Payments from '../../components/payments';
import MySelect from '../../components/myselect';
import MyText from '../../components/mytext';
import OrderItemStatus from '../../components/orderitemstatus';
import OrderItemStatus1 from '../../components/orderitemstatus1';
import { APPEARANCE } from '../../appearance';

import { toFixed2, formattedDate, quantityInfo, computePrice, safeFixed, percent } from "../../functions/helper"
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
                    vendorId  : i.vendorId,
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
        <Typography sx={{textAlign: "center", fontSize: "16px", fontWeight: "500", padding: "10px 0 15px 0", color: "#555"}} >{"Order list of " + props.user.vendorName} </Typography>

        <table className="orders">
          <tr className="table-header sticky">
            <th>Photo</th>
            <th>Art / Ref no.</th>
            <th>Design /&nbsp;Color</th>
            <th>Item name</th>
            <th>Ordered&nbsp;/ Details</th>
            {/* <th>Stock</th> */}
            <th>Delivery</th>
          </tr>

          <tr></tr>

            { orders.map((order, indexOrder) => (
              <React.Fragment>
                <tr className="orderrow">
                  
                  <td colSpan={2} className="order no-border-right fw200">No.&nbsp;{order.number}&nbsp;dated&nbsp;{formattedDate(order.created)}</td>
                  <td colSpan={3} className="order no-borders fw200">{order.clientName}&nbsp;&nbsp;{order.clientPhone},&nbsp;&nbsp;{order.clientEmail}</td>
                  <td colSpan={2} className="order no-border-left fw200"><Payments orderId={order.id}/></td>
                </tr>

                 {order.items.map((data, index) => (
                    
                      <tr>
                        <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId } style={{ textDecoration: 'none' }} >
                            <img src={config.api + "/" + data.imagePath}
                              width={60}
                              height={50}
                              style={{padding: "4px 0 0 0" }}
                              alt={data.itemName} /> 
                          </Link>
                        </td>
                        <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                            <span className="my-val">{data.artNo}<br/>{data.refNo}</span>
                          </Link>
                        </td>

                        <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                          <span className="my-val">{data.design}<br/>No.{data.colorNo} {data.colorNames} </span>
                          </Link>
                        </td>        
                        <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                          <span className="my-val">{data.itemName}<br/>
                          (&nbsp;{data.vendorName}&nbsp;)</span>
                          </Link>
                        </td>        
                        {/* <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                          <span className="my-val">{quantityInfo(data)}</span>
                          </Link>
                        </td> */}
                        <td style={{textAlign: "center", minWidth: "95px"}}>
                          <Box display="flex" flexDirection="column" >
                          <div className="my-val">{quantityInfo(data)}</div>
                          <div className="my-val">{!!data.details ? data.details : "waiting.."}</div>
                          <div className="my-val">({!!data.total?data.total + ' mtr' : '0 mtr' })</div>
                          </Box>
                        </td>
                        {/* <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                          <span className="my-val">{data.stockName}</span>
                          </Link>
                        </td> */}
                        <td style={{textAlign: "left", width: "auto"}}>
                          {/* <Link to={"/updateproduct?id=" + data.productId} className="my-link" > */}
                          <span className="my-val"><OrderItemStatus1 data={data} order={order} /></span>
                          {/* </Link> */}
                        </td>        
                      </tr>
                ))}
              </React.Fragment>
              ))}
        </table>   

    </Box>
    </div>
    </Container>
    <Footer />
              
    </ThemeProvider>
  );
}