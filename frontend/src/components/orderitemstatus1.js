import * as React from 'react';
import Box from '@mui/material/Box';

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

export default function OrderItemStatus(data) {

  const grey = "#777"
  const red = "#f77"
  const green = "#595"
  const size = 28

  const handleClientDelivery = (e) => {

  }

  return <Box sx={{display: "grid", gridTemplateColumns: "auto auto" , alignItems: "center", columnGap: 1}}>
            <span style={{backgroundColor: "#ff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>shipment:</span>
            { data.clientDeliveryCompany && <span onClick={handleClientDelivery}>{data.deliveryCompany}&nbsp;-&nbsp;{data.deliveryNo}</span> }
            <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", margin: "2px 0", fontWeight: "500", color: "#777"}}>on stock:</span>
            <span>{data.stockName}</span>
            <span style={{backgroundColor: "#fff", borderRadius: "3px", padding: "0px 4px", fontSize: "12px", fontWeight: "500", color: "#777"}}>delivery:</span>
            { data.clientDeliveryCompany && <span onClick={handleClientDelivery}>{data.clientDeliveryCompany}&nbsp;-&nbsp;{data.clientDeliveryNo}</span>}
         </Box>
    
  /*if (!!data.delivered) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <VerifiedOutlinedIcon sx={{ color: green, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: green}}>
              <span fontSize="11px">Delivered!</span>
            </Box>
         </Box> }

  if (!!data.clientDeliveryNo && !!data.clientDeliveryCompany) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <LocalShippingIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <span fontSize="11px">delivering</span>
            </Box>
         </Box> }

  if (!!data.stockName) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <AddHomeOutlinedIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <span fontSize="11px">On stock</span>
            </Box>
         </Box> }

  if (!!data.deliveryNo && !!data.deliveryCompany) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <LocalShippingIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <span fontSize="11px">shipping</span>
              <span fontSize="11px" mt="-5px">to stock</span>
            </Box>
         </Box> }*/

  /* if (!!data.paid) {
    return <Tooltip title={<span fontSize="12px">Paid</span>}>
              <MonetizationOnOutlinedIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>
  }*/

  /*if (!!data.details) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <CheckCircleOutlineOutlinedIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <span fontSize="11px">confirmed</span>
              <span fontSize="11px" mt="-5px">by vendor</span>
            </Box>
         </Box> }

  return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <AccessTimeOutlinedIcon sx={{ color: red, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: red}}>
            <span fontSize="11px">waiting</span>
            <span fontSize="11px" mt="-5px">vendor</span>
            </Box>
         </Box>*/
      
}
