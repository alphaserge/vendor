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
import { quantityInfo, shortUnit } from "../functions/helper"

const styleLabel = {backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}

export default function OrderLogistic(props) {

  const [show, setShow] = useState(false)
  const [details, setDetails] = useState(props.data.details)
  const [deliveryCompany, setDeliveryCompany] = useState(props.data.deliveryCompany)
  const [deliveryNo, setDeliveryNo] = useState(props.data.deliveryNo)

  const handleClick = (e) => {
     setShow(true) 
  }
  
  const save = async () => {

     const data = {
        id: props.data.id,
        details: details,
     }

    await axios.post(config.api + '/ChangeDetails', JSON.stringify(data), {headers:{"Content-Type" : "application/json"}})
      .then(function (response) {
      })
      .catch(function (error) {
        console.log('error for ChangeDetails:')
        console.log(error)
      })

    if (props.refreshFn) {
      props.refreshFn(data)
    }
    setShow(false) 
  }

  useEffect(() => {}, []);      

  return <>
    <Box sx={{ display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1, cursor: "pointer" }} onClick={handleClick}>
                          <span style={styleLabel}>ordered:</span>
                          <span>{props.data.quantity + (!props.data.unit?"" : ' ' + shortUnit(props.data.unit))}</span>
                          <span style={styleLabel}>details:</span>
                          { !!props.data.details && <span>{props.data.details + " (total " + props.data.total + ")"}</span> }
                          { !props.data.details && <span style={{backgroundColor: "#ddd", width: "16px", textAlign: "center", fontSize: "11px", borderRadius: "3px"}}>?</span> }
      <div><span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>shipment by:</span>&nbsp;{!!props.data.deliveryCompany ? props.data.deliveryCompany : '-' }</div>
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

          <Typography sx={{ padding: "10px 0", fontSize: "14px", fontWeight: 600, color: "555", textAlign: "center" }}>Order&nbsp;#{props.order.number}&nbsp;amount&nbsp;details</Typography>

          <Box sx={{marginTop: "7px", display: "flex", columnGap: 1}}>
            <MyText label="Details" value={details} width={"100px"} onChange={setDetails}></MyText>
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
