import React, { useState, useEffect } from "react";

import { colors, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button';

import axios from 'axios'

import MyText from "../components/mytext";
import MySelectLab from "../components/myselectlab";
import { postPayment } from '../api/payments'

import config from "../config.json"
import { toFixed2, formattedDate, percent, safeFixed } from "../functions/helper"
import { getCurrencies, getCourse } from '../api/currencies'
import { APPEARANCE as ap } from '../appearance'

export default function Payments(props) {

  const [show, setShow] = useState(false)
  const [order, setOrder] = useState(false)
  const [addingState, setAddingState] = useState(false)
  const [paySumm, setPaySumm] = useState("")
  const [currencyId, setCurrencyId] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [courseRur, setCourseRur] = useState(0)
  const [reload, setReload] = useState(false)
  
  const handleClick = (e) => {
    setShow(true)
  }

  const savePayment = (e) => {
    postPayment({ 
      currencyAmount: parseFloat(paySumm.replace(/\s+/g, "")), 
      currencyId: currencyId, 
      orderId: props.orderId, 
      date: new Date() ,
      id: 0,
      amount: 0,
      exchangeRate: 0,
      currency: currencies.find((e) => e.id == currencyId).shortName //"string"
    })
    
    setAddingState(false)
    setTimeout( () => { loadOrder() }, 300 )
  }

  const loadOrder = async (e) => {

    console.log("Payments.loadOrder")
    console.log(props.orderId)

      axios.get(config.api + '/OrderPayments?orderId=' + props.orderId) //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
        .then(function (res) {
          setOrder(res.data)
          //const courseRur = getCourse(setCourseRur,'rur')
          })       
        .catch (error => {
          console.log(error)
        })
  }

  useEffect(() => {
    
    getCurrencies(setCurrencies)
    setCourseRur(getCourse(setCourseRur,'rur'))
    loadOrder()

  },[])
  
  const hasPayments = !!order && !!order.items && order.items.length != 0

  return <>
  
    <Box onClick={handleClick} style={{ cursor: 'pointer', display: "flex", justifyContent: "flex-end" }}>
      <Box sx={{width: "auto"}}>Paid&nbsp;{percent(order.paySumm, order.total)}&nbsp;%:&nbsp;&nbsp;{toFixed2(order.paySumm)}&nbsp;/&nbsp;{toFixed2(order.total)}&nbsp;$ </Box>
      <Box  justifyContent="flex-end" >
    <Button style={{border: "1px solid #aaa",
    backgroundColor: "#none",
    border: "none",
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
      onClose={function() { setShow(false) }}
      aria-labelledby=""
      aria-describedby=""
      sx={{ width: "auto"}} >

      <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: 24,
          padding: "5px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: "column",
          fontFamily: ap.FONTFAMILY
           }}>
          <Box sx={{cursor: "pointer", padding: "5px"}} onClick={(e)=>{ setShow(false) }}>
            <Box sx={{display: "fixed", fontSize: "16px", top: "10px", float: "right", width: "20px", textAlign: "right", fontFamily: ap.FONTFAMILY, color: "#555" }}>x</Box>
            </Box>
          <Box sx={{padding: "20px 50px", marginBottom: "20px"}}>
          { !addingState && hasPayments && <>
          <Typography sx={{ padding: "0 0 0 3px", fontSize: "14px", fontWeight: 500, fontFamily: ap.FONTFAMILY }}>Order total paid: {toFixed2(order.paySumm, 2)}&nbsp;usd</Typography>
          <Typography sx={{ padding: "10px 0 5px 3px", fontSize: "14px", fontWeight: 500, fontFamily: ap.FONTFAMILY }}>Details:</Typography>
          <table style={{marginLeft: "0px", marginBottom: "20px"}}>
               {  order.items.map((data, index) => (
                <tr>
                <td style={{fontSize: "14px", fontFamily: ap.FONTFAMILY, padding: "3px 10px 3px 0"}}>{formattedDate(data.date)}</td>
                <td style={{fontSize: "14px", fontFamily: ap.FONTFAMILY, padding: "3px 0px", textAlign: "center"}}>:</td> 
                <td style={{fontSize: "14px", fontFamily: ap.FONTFAMILY, padding: "3px 10px", textAlign: "right"}}>{ toFixed2(data.currencyAmount,2) + " " + data.currency}</td>
                </tr> ))}
          </table></> }

          { !addingState && !hasPayments && 
          <Box display={"flex"} justifyContent={"center"}>
          <Typography sx={{ padding: "5px", fontFamily: ap.FONTFAMILY, fontWeight: 500 }}> Order&nbsp;no.{order.number}&nbsp;has not been paid</Typography>
          </Box>
          }

          { addingState && <Box display={"flex"} flexDirection={"column"} >
            <Box display={"flex"} flexDirection={"column"} columnGap={1} justifyContent={"center"} > 
              <MyText 
                label="Pay summ" 
                value={paySumm}
                width="160px"
                onChange={value => { setPaySumm(value)}}></MyText>

              <MySelectLab 
                label="Currency"
                width="160px"
                disabled={false}
                value={currencyId}
                setValue={setCurrencyId}
                values={currencies.map((e)=>{return e.shortName})}
                keys={currencies.map((e)=>{return e.id})}
                 /> 
          </Box>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} columnGap={1} marginTop={"24px"}>
          <Button 
            onClick={(e)=>{ savePayment() }} //edge="end" 
            sx={{
              backgroundColor: "#222",
              borderRadius: "1px",
              color: "#fff", 
              fontSize: "13px",
              padding: "4px 12px",
              textTransform: "none"}}>
                Add
          </Button>
          <Button 
            onClick={(e)=>{ setAddingState(false) }} //edge="end" 
            sx={{
              backgroundColor: "#222",
              borderRadius: "1px",
              color: "#fff", 
              fontSize: "13px",
              padding: "4px 12px",
              textTransform: "none"}}>
                Cancel
          </Button>
          </Box>
          </Box>
          }

          { !addingState && <Box display={"flex"} justifyContent={"center"} marginTop={"15px"} columnGap={1}>
          <Button 
            onClick={(e)=>{ setAddingState(true) }} //edge="end" 
            sx={{ 
              backgroundColor: "#222",
              borderRadius: "1px",
              color: "#fff", 
              fontSize: "13px",
              padding: "4px 12px",
              textTransform: "none"}}>
                Add a payment
          </Button>
          {/* <Button 
            onClick={(e)=>{ setShow(false) }} //edge="end" 
            sx={{
              backgroundColor: "#222",
              borderRadius: "1px",
              color: "#fff", 
              fontSize: "13px", 
              padding: "4px",
              textTransform: "none"}}>
                Close
          </Button> */}
          </Box>}

      </Box>
      </Box>
    </Modal>

  </>
  
  
         
}
