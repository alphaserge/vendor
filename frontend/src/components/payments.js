import React, { useState, useEffect } from "react";

import { colors, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'

import axios from 'axios'

import config from "../config.json"
import { toFixed2, formattedDate, percent, safeFixed } from "../functions/helper"

export default function Payments(props) {

  const [show, setShow] = useState(false)
  const [order, setOrder] = useState(false)

  const handleClick = (e) => {
    setShow(true)
  }

  const loadOrder = async (e) => {

    console.log("Payments.loadOrder")
    console.log(props.orderId)

      axios.get(config.api + '/OrderPayments?orderId=' + props.orderId 
        //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
      ).then(function (res) {
          setOrder(res.data)
          //const courseRur = getCourse(setCourseRur,'rur')
          })       
      .catch (error => {
        console.log(error)
      })
  }


  useEffect(() => {
    
    loadOrder()

  },[])

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
            <Typography sx={{ padding: "10px", fontSize: "15px", fontWeight: 500 }}> Order&nbsp;no.{order.number}&nbsp;payments:</Typography>
          <table style={{marginLeft: "5px"}}>
              {order.payments && order.payments.map((data, index) => (
                <tr>
                <td className="my-val-1">{formattedDate(data.date)}</td>
                <td style={{textAlign: "center"}}>-</td>
                <td className="my-val-1" style={{textAlign: "right"}}>{ safeFixed(data.amount,2) }</td>
                <td style={{textAlign: "center"}}>{data.currency}</td>
                </tr>
              ))}
      </table>
        <Typography sx={{ padding: "10px", fontSize: "15px", fontWeight: 500 }}> Total&nbsp;paid:&nbsp;{safeFixed(order.paySumm, 2)}$&nbsp;</Typography>
      </Box>
    </Modal>

  </>
  
  
         
}
