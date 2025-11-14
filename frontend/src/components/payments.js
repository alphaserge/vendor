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
      currencyAmount: parseFloat(paySumm), 
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
  
  const hasPayments = order.payments && order.payments.length != 0

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
          padding: "25px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: "column"
           }}>
          { !addingState && hasPayments && <>
          <Typography sx={{ padding: "10px", fontSize: "15px", fontWeight: 600, textAlign: "center" }}>Order&nbsp;{order.number}&nbsp;payments</Typography>
          <table style={{marginLeft: "5px"}}>
               {  order.payments.map((data, index) => (
                <tr>
                <td style={{fontSize: "15px", padding: "3px 10px"}}>{formattedDate(data.date)}</td>
                <td style={{fontSize: "15px", padding: "3px 0px", textAlign: "center"}}>:</td> 
                <td style={{fontSize: "15px", padding: "3px 10px", textAlign: "right"}}>{ safeFixed(data.amount,2) }</td>
                <td style={{fontSize: "15px", padding: "3px 10px", textAlign: "center"}}>{data.currency}</td>
                </tr> ))}
          </table>
          <Typography sx={{ padding: "15px 10px", fontSize: "15px", fontWeight: 600, textAlign: "right" }}> Total&nbsp;paid:&nbsp;{safeFixed(order.paySumm, 2)}$&nbsp;</Typography>
          </> }

          { !addingState && !hasPayments && 
          <Box display={"flex"} justifyContent={"center"}>
          <Typography sx={{ padding: "10px", fontWeight: 500 }}> Order&nbsp;no.{order.number}&nbsp;has not been paid</Typography>
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
              backgroundColor: false ? "#ccc" : "#627eb5",
              borderRadius: "3px",
              color: "#fff", 
              fontSize: "14px", 
              textTransform: "none"}}>
                Add
          </Button>
          <Button 
            onClick={(e)=>{ setAddingState(false) }} //edge="end" 
            sx={{
              backgroundColor: false ? "#ccc" : "#627eb5",
              borderRadius: "3px",
              color: "#fff", 
              fontSize: "14px", 
              textTransform: "none"}}>
                Cancel
          </Button>
          </Box>
          </Box>
          }

          { !addingState && <Box display={"flex"} justifyContent={"center"} marginTop={"5px"} columnGap={1}>
          <Button 
            onClick={(e)=>{ setAddingState(true) }} //edge="end" 
            sx={{ 
              backgroundColor: false ? "#ccc" : "#627eb5",
              borderRadius: "3px",
              color: "#fff", 
              fontSize: "14px",
              textTransform: "none"}}>
                Add a payment
          </Button>
          <Button 
            onClick={(e)=>{ setShow(false) }} //edge="end" 
            sx={{
              backgroundColor: "#fff",
              border: "1px solid #888",
              borderRadius: "3px",
              color: "#222", 
              fontSize: "14px", 
              textTransform: "none"}}>
                Close
          </Button>

          
          </Box>}

      </Box>
    </Modal>

  </>
  
  
         
}
