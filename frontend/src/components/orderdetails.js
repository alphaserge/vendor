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

export default function OrderDetails(props) {

  const [show, setShow] = useState(false)
  const [details, setDetails] = useState(props.data.details)

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
    <Box display="flex" flexDirection="column" >
      <div>{quantityInfo(data)}</div>
      <div style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>details:&nbsp;{!!data.details ? data.details : "?"}</div>
      <div style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>total:&nbsp;{!!data.total?data.total + ' m' : '0 m' }</div>
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
