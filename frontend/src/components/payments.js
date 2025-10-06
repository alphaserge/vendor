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
  const [currency, setCurrency] = useState(false)
  const [currencies, setCurrencies] = useState([])
  const [courseRur, setCourseRur] = useState(0)
  const [reload, setReload] = useState(false)
  
  const handleClick = (e) => {
    setShow(true)
  }

  const savePayment = (e) => {
    postPayment({ 
      currencyAmount: parseFloat(paySumm), 
      currencyId: currency, 
      orderId: props.orderId, 
      date: new Date() 
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
  
    <Typography onClick={handleClick} style={{ cursor: 'pointer' }}>
      Paid&nbsp;{percent(order.paySumm, order.total)}&nbsp;%:&nbsp;&nbsp;{toFixed2(order.paySumm)}&nbsp;/&nbsp;{toFixed2(order.total)}&nbsp;$ 
    </Typography>
    
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
          width: "330px",
          boxShadow: 24,
          padding: "45px 40px 40px 40px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: "column"
           }}>
          { !addingState && hasPayments && <>
          <Typography sx={{ padding: "10px", fontSize: "15px", fontWeight: 500 }}>Order&nbsp;no.{order.number}&nbsp;payments:</Typography>
          <table style={{marginLeft: "5px"}}>
               {  order.payments.map((data, index) => (
                <tr>
                <td className="my-val-1">{formattedDate(data.date)}</td>
                <td style={{textAlign: "center"}}>-</td>
                <td className="my-val-1" style={{textAlign: "right"}}>{ safeFixed(data.amount,2) }</td>
                <td style={{textAlign: "center"}}>{data.currency}</td>
                </tr> ))}
          </table>
          <Typography sx={{ padding: "10px", fontSize: "15px", fontWeight: 500 }}> Total&nbsp;paid:&nbsp;{safeFixed(order.paySumm, 2)}$&nbsp;</Typography>
          </> }

          { !addingState && !hasPayments && 
          <Box display={"flex"} justifyContent={"center"}>
          <Typography sx={{ padding: "10px", fontWeight: 500 }}> Order&nbsp;no.{order.number}&nbsp;has not been paid</Typography>
          </Box>
          }

          { addingState && <Box display={"flex"} flexDirection={"column"} >
            <Box display={"flex"} flexDirection={"row"} columnGap={1} justifyContent={"center"} > 
              <MyText 
                label="Pay summ" 
                value={paySumm}
                width="120px"
                onChange={value => { setPaySumm(value)}}></MyText>

              <MySelectLab 
                label="Currency"
                valueName="shortName"
                width="90px"
                disabled={false}
                valueVariable={currency}
                setValueFn={(value) => { setCurrency(value) }}
                data={currencies} /> 
          </Box>
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"} columnGap={1} marginTop={"10px"}>
          <Button 
            onClick={(e)=>{ savePayment() }} //edge="end" 
            sx={{
              backgroundColor: false ? "#ccc" : "#627eb5",
              borderRadius: "3px",
              color: "#fff", 
              fontSize: "14px", 
              textTransform: "none"}}>
                Save
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

          { !addingState && <Box display={"flex"} justifyContent={"center"} marginTop={"10px"} columnGap={1}>
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
