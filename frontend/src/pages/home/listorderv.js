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

import { toFixed2, formattedDate, quantityInfo, shortUnit, safeFixed, percent } from "../../functions/helper"
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

const styleLabel = {backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}

export default function ListOrderV(props) {

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
                  clientDeliveryNo: d.clientDeliveryNo,
                  clientDeliveryCompany : d.clientDeliveryCompany,
                  stockName : d.stockName,
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

    const refreshStatus = (data) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
      for (let i=0; i< ords[j].items.length; i++) {
        if (ords[j].items[i].id == data.id) {
              ords[j].items[i].stockName = data.stockName
              ords[j].items[i].clientDeliveryCompany = data.clientDeliveryCompany
              ords[j].items[i].clientDeliveryNo = data.clientDeliveryNo
              ords[j].items[i].deliveryCompany = data.deliveryCompany
              ords[j].items[i].deliveryNo = data.deliveryNo
              setOrders(ords)
              break
            }
          }
        }
    }

    useEffect(() => {
      loadOrders()
      getTransportCompanies(props.user.vendorId, setTransportCompanies)
      getStocks(setStocks)
    }, []);


    useEffect(() => {
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

        {/* <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pb: 3, pr: 6, textAlign: "left" }} > {"Order list of " + props.user.vendorName}</Box>  */}
        <Typography sx={{textAlign: "center", fontSize: "16px", fontWeight: "500", padding: "10px 0 15px 0", color: "#555"}} >{"Order list of " + props.user.vendorName} </Typography>

        <table className="orders">
          <tr className="table-header sticky">
            <th>Photo</th>
            <th>Art / Ref no.</th>
            <th>Design /&nbsp;Color</th>
            <th>Item name</th>
            <th>Amount</th>
            {/* <th>Stock</th> */}
            <th>Delivery</th>
          </tr>

          <tr></tr>

            { orders.map((order, indexOrder) => (
              <React.Fragment>
                <tr className="orderrow">
                  <td colSpan={2} className="order no-border-right">No.&nbsp;{order.number}&nbsp;dated&nbsp;{formattedDate(order.created)}</td>
                  <td colSpan={3} className="order no-borders">{order.clientName}&nbsp;&nbsp;{order.clientPhone},&nbsp;&nbsp;{order.clientEmail}</td>
                  <td colSpan={2} className="order no-border-left"><Payments orderId={order.id}/></td>
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
                            <span className="my-val"><span style={styleLabel}>art.</span>&nbsp;{data.artNo}<br/><span style={styleLabel}>ref.</span>&nbsp;{data.refNo}</span>
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
                        <td style={{textAlign: "left", minWidth: "95px"}}>
                          <Box sx={{ display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1, cursor: "pointer" }} >
                          <span style={styleLabel}>ordered:</span>
                          <span>{data.quantity + (!data.unit?"" : ' ' + shortUnit(data.unit))}</span>
                          <span style={styleLabel}>details:</span>
                          { !!data.details && <span>{data.details}</span> }
                          { !data.details && <span style={{backgroundColor: "#ddd", width: "16px", textAlign: "center", fontSize: "11px", borderRadius: "3px"}}>?</span> }
                          <span style={styleLabel}>total:</span>
                          { !!data.total && <span>{data.total}</span> }
                          { !data.total && <span style={{backgroundColor: "#ddd", width: "16px", textAlign: "center", fontSize: "11px", borderRadius: "3px"}}>?</span> }
                          
                          </Box>
                        </td>
                        {/* <td style={{textAlign: "center"}}>
                          <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
                          <span className="my-val">{data.stockName}</span>
                          </Link>
                        </td> */}
                        <td style={{textAlign: "left", width: "auto"}}>
                          {/* <Link to={"/updateproduct?id=" + data.productId} className="my-link" > */}
                          <span className="my-val"><OrderItemStatus1 data={data} order={order} refreshFn={refreshStatus} /></span>
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