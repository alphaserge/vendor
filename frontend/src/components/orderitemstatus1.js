import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
//import span from '@mui/material/span';
import Tooltip from '@mui/material/Tooltip';

export default function OrderItemStatus1(props) {

  const [show, setShow] = useState(false)
  //const [order, setOrder] = useState(false)

  const stockName = !!props.data.stockName ? props.data.stockName : "-";
  const deliveryCompany = !!props.data.deliveryCompany ? props.data.deliveryCompany : "-";
  const clientDeliveryCompany = !!props.data.clientDeliveryCompany ? props.data.clientDeliveryCompany : "-";

  const handleClientDelivery = (e) => {

  }

  return <>
    <Box  sx={{display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1}}>
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

       <Box onClick={handleClientDelivery} 
        sx={{
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
          flexDirection: "column" }}>
      </Box> 
    </Modal>
    </>
}
