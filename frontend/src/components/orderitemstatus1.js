import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import { Typography } from '@mui/material';
import axios from 'axios'

import config from "../config.json"
import MySelectLab from "../components/myselectlab";
import MyText from '../components/mytext';
import { getTransportCompanies } from '../api/vendors'
import { getStocks } from '../api/stocks'
import { getDeliveryNo } from '../api/orders'

const styleLabel = {backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}

export default function OrderItemStatus1(props) {

  const [show, setShow] = useState(false)
  const [stockId, setStockId] = useState(props.data.stockId)
  const [deliveryCompany, setDeliveryCompany] = useState(props.data.deliveryCompany)
  const [deliveryNo, setDeliveryNo] = useState(props.data.deliveryNo)
  const [clientDeliveryCompany, setClientDeliveryCompany] = useState(props.data.clientDeliveryCompany)
  const [clientDeliveryNo, setClientDeliveryNo] = useState(props.data.clientDeliveryNo)
  const [transportCompanies, setTransportCompanies] = useState([])
  const [stocks, setStocks] = useState([])
  const [changes, setChanges] = useState(false)
  
  //const stockName = !!props.data.stockName ? props.data.stockName : "-";
  //const deliveryCompany = !!props.data.deliveryCompany ? props.data.deliveryCompany : "-";
  //const clientDeliveryCompany = !!props.data.clientDeliveryCompany ? props.data.clientDeliveryCompany : "-";

  const handleClick = (e) => {
     setShow(true) 
  }
  
  const save = async () => {

     const data = {
        id: props.data.id,
        stockId: stockId,
        deliveryNo: deliveryNo,
        deliveryCompany: deliveryCompany,
        clientDeliveryNo: clientDeliveryNo,
        clientDeliveryCompany: clientDeliveryCompany
     }

    await axios.post(config.api + '/DeliveryInfo', JSON.stringify(data), {headers:{"Content-Type" : "application/json"}})
      .then(function (response) {
      })
      .catch(function (error) {
        console.log('error for DeliveryInfo:')
        console.log(error)
      })

      if (!!stockId) {
          data.stockName = stocks.find((e) => e.id == stockId).stockName
        }
      if (props.refreshFn) {
        props.refreshFn(data)
      }
     setShow(false) 
  }

  useEffect(() => {
    // todo: make with Redux state
    getTransportCompanies(props.user.vendorId, props.data.vendorId, setTransportCompanies)
    getStocks(setStocks)
  }, []);      

  const setTransportCompany = async (value, option) => {
    
    if (option == 'client') { 
      setClientDeliveryCompany(value)
      if (value == 'Angelika Moscow' && !clientDeliveryNo) { //todo!!
        const no = await getDeliveryNo(value)
        setClientDeliveryNo(no.toString().padStart(4, '0'))
      }
    } else {
      setDeliveryCompany(value)
      if (value == 'Angelika Moscow' && !deliveryNo) { //todo!!
        const no = await getDeliveryNo(value)
        setDeliveryNo(no.toString().padStart(4, '0'))
      }
    }

    // if (value == 'Angelika Moscow') { //todo!!
    //   const no = await getDeliveryNo(value)
    //   if (!!no) {
    //     if (option == 'client') { 
    //       setClientDeliveryNo(no.toString().padStart(4, '0'))
    //     } else {
    //       setDeliveryNo(no.toString().padStart(4, '0'))
    //     }
    //   }
    // }

  }

  return <>
    <Box sx={{ display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1, cursor: "pointer" }} onClick={handleClick}>
      <span style={styleLabel}>shipment:</span>
      <span>{props.data.deliveryCompany}</span>
      <span style={styleLabel}>on stock:</span>
      <span>{props.data.stockName}</span>
      <span style={styleLabel}>delivery:</span>
      <span>{props.data.clientDeliveryCompany}</span>
    </Box>

   <Modal
      open={show}
      onClose={function() { save() }}
      aria-labelledby=""
      aria-describedby=""
      sx={{ width: "auto"}} >

       <Box  
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          // width: "330px",
          boxShadow: 24,
          padding: "45px 40px 40px 40px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: "column" }}>

          <Typography sx={{ padding: "10px 0", fontSize: "14px", fontWeight: 600, color: "555", textAlign: "center" }}>Order&nbsp;#{props.order.number}&nbsp;delivery</Typography>

          <Box sx={{marginTop: "7px", display: "flex", columnGap: 1}}>
          <MySelectLab 
              label="Vendor shipping company"
              width="180px"
              value={deliveryCompany}
              setValue={(value) => { setTransportCompany(value, 'vendor') }}
              values={transportCompanies.map(e => { return e.vendorName })} />
            <MyText label="Shipping No." value={deliveryNo} width={"100px"} onChange={value => { setDeliveryNo(value)}}></MyText>
          </Box>
          <MySelectLab 
              label="Stock"
              key="stock"
              width="180px"
              //disabled={!data.paid}
              value={stockId}
              setValue={setStockId}
              values={stocks.map(e => { return e.stockName})}
              keys={stocks.map(e => { return e.id})}
            />
          <Box sx={{marginTop: "8px", display: "flex", columnGap: 1}}>
          <MySelectLab 
              label="Customer delivery company"
              width="180px"
              value={clientDeliveryCompany}
              setValue={(value) => { setTransportCompany(value, 'client') }}
              values={transportCompanies.filter(e => e.id != props.data.vendorId).map(e => { return e.vendorName })} />
          <MyText label="Delivery No." value={clientDeliveryNo} width={"100px"} onChange={value => { setClientDeliveryNo(value)}}></MyText>
          </Box>
          <Box sx={{display: "flex", columnGap: 1, justifyContent: "center", marginTop: "10px"}}>
          <Button 
            onClick={(e)=>{ save() }} 
            //edge="end" 
            //disabled={!changes}
            sx={{
              backgroundColor: "#222",
              borderRadius: "3px",
              color: "#fff", 
              borderRadius: "2px", 
              padding: "6px 10px",
              textTransform: "none"}}>
                Save
          </Button>
          <Button 
            onClick={(e)=>{ setShow(false) }} 
            //edge="end" 
            //disabled={!changes}
            sx={{
              backgroundColor: "#222",
              borderRadius: "3px",
              color: "#fff", 
              borderRadius: "2px", 
              padding: "6px 10px",
              textTransform: "none"}}>
                Close
          </Button> 
          </Box>  

      </Box> 
    </Modal>
    </>
}
