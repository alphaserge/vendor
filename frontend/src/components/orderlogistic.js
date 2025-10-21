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
import { getDeliveryNo } from '../api/orders'
import { shortUnit } from "../functions/helper"
import {APPEARANCE as ap} from '../appearance';

const styleLabel = {backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}

export default function OrderLogistic(props) {

  const [show, setShow] = useState(false)
  const [details, setDetails] = useState(props.data.details)
  const [deliveryCompany, setDeliveryCompany] = useState(props.data.deliveryCompany)
  const [deliveryNo, setDeliveryNo] = useState(props.data.deliveryNo)
  const [transportCompanies, setTransportCompanies] = useState([])

  const handleClick = (e) => {
     setShow(true) 
  }
  
  const save = async () => {

     const data = {
        id: props.data.id,
        details: details,
        deliveryCompany: deliveryCompany,
        deliveryNo: deliveryNo
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

  const setTransportCompany = async (value, option) => {
      
      setDeliveryCompany(value)
      if (value === 'Angelika Moscow' && !deliveryNo) { //todo!!
        const no = await getDeliveryNo(value)
        setDeliveryNo(no.toString().padStart(4, '0'))
      }
    }
  

  useEffect(() => {
    getTransportCompanies(props.user.vendorId, props.data.vendorId, setTransportCompanies)
  }, [props.user.vendorId, props.data.vendorId]);      

  const orderedAmount = props.data.quantity + (!props.data.unit?"" : ' ' + shortUnit(props.data.unit))

  return <>
  <Box width="100%" sx={{display:"flex"}}>
    <Box  sx={{ display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1, cursor: "pointer" }} onClick={handleClick}>
          <span style={styleLabel}>ordered:</span>
          <div><span>{orderedAmount}</span>
          </div>

          <span style={styleLabel}>details:</span>
          { !!props.data.details && <span>{props.data.details + (!props.data.total ? "" : " (total " + props.data.total + ")")}</span> }
          { !props.data.details && <span style={{backgroundColor: "#ddd", width: "16px", textAlign: "center", fontSize: "11px", borderRadius: "3px"}}>?</span> }
          
          <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>shipment by:</span>
          <span>{(!!props.data.deliveryCompany ? props.data.deliveryCompany : '-') + (!!props.data.deliveryNo ? (' / ' + props.data.deliveryNo) : '') }</span>
          <span></span>
    </Box>
    <Box style={{marginLeft:"auto"}} justifyContent="flex-end" >
    <Button style={{border: "1px solid #aaa",
    backgroundColor: "#eee",
              color: "#555", 
              maxWidth: "24px",
              minWidth: "24px",
              maxHeight: "20px",
              minHeight: "20px",
              borderRadius: "1px", 
              padding: "0px",
              marginLeft: "10px",
              textTransform: "none"}}
              onClick={handleClick} >
                  ...
              </Button>
    </Box>
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

          <Typography sx={{ padding: "10px 0", fontSize: "14px", fontWeight: 600, color: "555", textAlign: "center" }}>Order logistic</Typography>

          <Box sx={{display: "flex", flexDirection: "column"}}>
            <MyText label="Ordered:" value={orderedAmount} readOnly={true} width={"200px"} ></MyText>

            <MyText label="Details:" value={details} marginTop={"10px"} width={"200px"} onChange={setDetails}></MyText>

          <MySelectLab 
              label="Shipping company"
              width="200px"
              value={deliveryCompany}
              setValue={(value) => { setTransportCompany(value, 'vendor') }}
              values={transportCompanies.map(e => { return e.vendorName })} />
            <MyText label="Shipping No." value={deliveryNo} width={"200px"} onChange={value => { setDeliveryNo(value)}}></MyText>

          </Box>
          <Box sx={{display: "flex", columnGap: 1, justifyContent: "center", marginTop: "15px"}}>
          <Button 
            onClick={(e)=>{ save() }} 
            //edge="end" 
            //disabled={!changes}
            sx={{
              backgroundColor: "#222",
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
