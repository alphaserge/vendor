import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import { Typography } from '@mui/material';
import axios from 'axios'

import MySelectLab from "../components/myselectlab";
import MyText from '../components/mytext';
import { getTransportCompanies } from '../api/vendors'
import { getStocks } from '../api/stocks'
import config from "../config.json"

export default function OrderItemStatus1(props) {

  const [show, setShow] = useState(false)
  const [deliveryCompany, setDeliveryCompany] = useState(props.data.deliveryCompany)
  const [deliveryNo, setDeliveryNo] = useState(props.data.deliveryNo)
  const [clientDeliveryCompany, setClientDeliveryCompany] = useState(props.data.clientDeliveryCompany)
  const [clientDeliveryNo, setClientDeliveryNo] = useState(props.data.clientDeliveryNo)
  const [stock, setStock] = useState(props.data.stockName)
  //const [stockName, setStockName] = useState(props.data.stockName)
  const [transportCompanies, setTransportCompanies] = useState([])
  const [stocks, setStocks] = useState([])
  const [changes, setChanges] = useState(false)
  const [error, setError] = useState("")
  
  //const stockName = !!props.data.stockName ? props.data.stockName : "-";
  //const deliveryCompany = !!props.data.deliveryCompany ? props.data.deliveryCompany : "-";
  //const clientDeliveryCompany = !!props.data.clientDeliveryCompany ? props.data.clientDeliveryCompany : "-";

  const handleClick = (e) => {
     setShow(true) 
  }
  
  const setStock1 = (value) => {

  }


  const save = async (e) => {

    let company1 = transportCompanies.find(it => it.id == deliveryCompany)
    let company2 = transportCompanies.find(it => it.id == clientDeliveryCompany)
    const st = stocks.find(it => it.value == stock)
    const stockId = !!st ? st._id : null

    let data = JSON.stringify({
        id: props.data.id,
        deliveryCompany: !!company1 ? company1.value : null,
        deliveryNo: deliveryNo,
        clientDeliveryCompany: !!company2 ? company2.value : null,
        clientDeliveryNo: clientDeliveryNo,
        stockId: stockId,
      })

    await axios.post(config.api + '/DeliveryInfo', data, {headers:{"Content-Type" : "application/json"}})
      .then(function (response) {
        console.log('response for DeliveryInfo:');
        console.log(response);
        setShow(false)
      })
      .catch(function (error) {
        console.log(error)
        setError(error)
        return false;
      })
  }

  useEffect(() => {
    // todo: make with Redux state
    getTransportCompanies(props.data.vendorId, setTransportCompanies)
    getStocks(setStocks)
  }, []);      

  const st = stocks.find(it => it.value == stock)
  const stockName = !!st ? st.stockName : "-"
  const transportCompanies1 = transportCompanies.filter(e => e.id != props.data.vendorId)
  //console.log(transportCompanies1)
  console.log(stockName)

  return <>
    <Box sx={{ display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1, cursor: "pointer" }} onClick={handleClick}>
      <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>shipment:</span>
      <span>{deliveryCompany}</span>
      <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", margin: "2px 0", fontWeight: "500", color: "#777"}}>on stock:</span>
      <span>{stockName}</span>
      <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>delivery:</span>
      <span>{clientDeliveryCompany}</span>
    </Box>

   <Modal
      open={show}
      onClose={function() { setShow(false) }}
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

          <Typography sx={{ padding: "10px 0", fontSize: "14px", fontWeight: 500, color: "555", textAlign: "center" }}>Order&nbsp;#{props.order.number}&nbsp;delivery information</Typography>

          <Box sx={{marginTop: "7px", display: "flex", columnGap: 1}}>
          <MySelectLab 
              label="Vendor shipping company"
              valueName="deliveryCompany"
              width="180px"
              //disabled={!data.paid}
              valueVariable={deliveryCompany}
              setValueFn={(value) => { setDeliveryCompany(value) }}
              data={transportCompanies} />
            <MyText label="Shipping No." value={deliveryNo} width={"100px"} onChange={value => { setDeliveryNo(value)}}></MyText>
          </Box>
          <MySelectLab 
              label="Stock"
              valueName="stock"
              width="180px"
              //disabled={!data.paid}
              valueVariable={stock}
              setValueFn={(value) => { setStock(value) }}
              data={stocks}
            />
          <Box sx={{marginTop: "8px", display: "flex", columnGap: 1}}>
          <MySelectLab 
              label="Customer delivery company"
              valueName="clientDeliveryCompany"
              width="180px"
              //disabled={!data.paid}
              valueVariable={clientDeliveryCompany}
              setValueFn={(value) => { setClientDeliveryCompany(value) }}
              data={transportCompanies1}
            />
            <MyText label="Delivery No." value={clientDeliveryNo} width={"100px"} onChange={value => { setClientDeliveryNo(value)}}></MyText>
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
              <Typography display={!!error} color={"red"}>{error.message}</Typography>
              <Box display="flex" marginTop="15px" columnGap={1} justifyContent={"center"}>
                <Button onClick={(e)=>{ save() }} 
                  sx={{
                    backgroundColor: "#222",
                    color: "#fff", 
                    borderRadius: "2px", 
                    textTransform: "none"}}>Save</Button>
                <Button onClick={(e)=>{ setShow(false) }} 
                  sx={{
                    backgroundColor: "#222",
                    color: "#fff", 
                    borderRadius: "2px", 
                    textTransform: "none"}}>Close</Button>
              </Box>
      </Box> 
    </Modal>
    </>
}
