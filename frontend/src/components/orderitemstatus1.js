import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal'
import { Typography } from '@mui/material';

import MySelectLab from "../components/myselectlab";
import MyText from '../components/mytext';
import { getTransportCompanies } from '../api/vendors'
import { getStocks } from '../api/stocks'

export default function OrderItemStatus1(props) {

  const [show, setShow] = useState(false)
  const [deliveryCompany, setDeliveryCompany] = useState(props.data.deliveryCompany)
  const [deliveryNo, setDeliveryNo] = useState(props.data.deliveryNo)
  const [clientDeliveryCompany, setClientDeliveryCompany] = useState(props.data.deliveryCompany)
  const [clientDeliveryNo, setClientDeliveryNo] = useState(props.data.deliveryNo)
  const [stockId, setStockId] = useState(props.data.stockId)
  const [stockName, setStockName] = useState(props.data.stockName)
  const [transportCompanies, setTransportCompanies] = useState([])
  const [stocks, setStocks] = useState([])
  const [changes, setChanges] = useState(false)
  
  //const stockName = !!props.data.stockName ? props.data.stockName : "-";
  //const deliveryCompany = !!props.data.deliveryCompany ? props.data.deliveryCompany : "-";
  //const clientDeliveryCompany = !!props.data.clientDeliveryCompany ? props.data.clientDeliveryCompany : "-";

  const handleClick = (e) => {
     setShow(true) 
  }
  const setStock = (value) => {
  }
  const save = (e) => {
     let d1 = deliveryCompany
     let d2 = clientDeliveryCompany
  }

  useEffect(() => {
    // todo: make with Redux state
    getTransportCompanies(props.data.vendorId, setTransportCompanies)
    getStocks(setStocks)
  }, []);      

  const transportCompanies1 = transportCompanies.filter(e => e.id != props.data.vendorId)
  console.log(transportCompanies1)

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

          <Typography sx={{ padding: "10px 0", fontSize: "14px", fontWeight: 600, color: "555", textAlign: "center" }}>Order&nbsp;#{props.order.number}&nbsp;delivery</Typography>

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
              valueName="stockName"
              width="180px"
              //disabled={!data.paid}
              valueVariable={stockName}
              setValueFn={(value) => { setStockId(value) }}
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
          <Button 
            onClick={(e)=>{ save() }} 
            edge="end" 
            //disabled={!changes}
            sx={{
              // visibility: !data.details ? "hidden":"visible", 
              //backgroundColor: !changes ? "#ccc" : "#222",
              backgroundColor: "#222",
              //border: !data.changes ? "none" : "1px solid #aaa",
              borderRadius: "3px",
              //color: !changes ? "#fff" : "#fff", 
              color: "#fff", 
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
    </Modal>
    </>
}
