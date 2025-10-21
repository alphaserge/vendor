import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { Typography } from "@mui/material";

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import OrderLogistic from '../../components/orderlogistic';

import { toFixed2 } from "../../functions/helper"
import { orderPaidShare } from '../../api/orders'

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "940px", margin: "80px auto 20px auto", padding: "0 10px" }

const styleLabel = {backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}

export default function ListOrderV(props) {

  const navigate = useNavigate();

  const [orders, setOrders] = useState([])
  

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
                  vendorId  : d.vendorId,
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
                  paidShare : d.paidShare,
                  deliveryNo: d.deliveryNo,
                  deliveryCompany : d.deliveryCompany,
                  clientDeliveryNo: d.clientDeliveryNo,
                  clientDeliveryCompany : d.clientDeliveryCompany,
                  stockName : d.stockName,
                  changes: false,
                  }
              })
          setOrders(result)
          })      
      .catch (error => {
        console.log(error)
      })
    }

    const refreshStatus = async (data) => {
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].id === data.id) {
              ords[j].deliveryCompany = data.deliveryCompany
              ords[j].deliveryNo = data.deliveryNo
              if (ords[j].details !== data.details) {
                const paidShare = await orderPaidShare(ords[j].orderId)
                console.log('paidShare')
                console.log(paidShare)
                ords[j].paidShare = paidShare
              }
              ords[j].details = data.details
              setOrders(ords)
              break
            }
        }
    }

    useEffect(() => {
      loadOrders()
    }, []);

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
            <th>Logistic</th>
            <th>Paid</th>
          </tr>

                 {orders.map((data, index) => (
                    
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
                          <span className="my-val">{data.itemName}</span>
                          </Link>
                        </td>        
                        <td style={{textAlign: "left", width: "auto"}}>
                          <OrderLogistic data={data} order={data} user={props.user} refreshFn={refreshStatus} />
                        </td>        
                        <td style={{textAlign: "center"}}>
                          <span className="my-val">{toFixed2(data.paidShare*100)}%</span>
                        </td>        
                      </tr>
                 ))}
        </table>   

    </Box>
    </div>
    </Container>
    <Footer />
              
    </ThemeProvider>
  );
}