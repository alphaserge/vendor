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
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export default function OrderItemStatus(data) {

  const grey = "#777"
  const red = "#f77"
  const green = "#595"
  const size = 28
    
  if (!!data.delivered) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <VerifiedOutlinedIcon sx={{ color: green, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: green}}>
              <Typography fontSize="11px">Delivered!</Typography>
            </Box>
         </Box> }

  if (!!data.clientDeliveryNo && !!data.clientDeliveryCompany) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <LocalShippingIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <Typography fontSize="11px">delivering</Typography>
            </Box>
         </Box> }

  if (!!data.stockName) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <AddHomeOutlinedIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <Typography fontSize="11px">On stock</Typography>
            </Box>
         </Box> }

  if (!!data.deliveryNo && !!data.deliveryCompany) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <LocalShippingIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <Typography fontSize="11px">shipping</Typography>
              <Typography fontSize="11px" mt="-5px">to stock</Typography>
            </Box>
         </Box> }

  /* if (!!data.paid) {
    return <Tooltip title={<Typography fontSize="12px">Paid</Typography>}>
              <MonetizationOnOutlinedIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>
  }*/

  if (!!data.details) {
    return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <CheckCircleOutlineOutlinedIcon sx={{ color: grey, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: grey}}>
              <Typography fontSize="11px">confirmed</Typography>
              <Typography fontSize="11px" mt="-5px">by vendor</Typography>
            </Box>
         </Box> }

  return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}}>
            <AccessTimeOutlinedIcon sx={{ color: red, fontSize: size }} />
            <Box sx={{display: "flex", flexDirection: "column", alignItems: "flex-start", ml: "3px", color: red}}>
            <Typography fontSize="11px">waiting</Typography>
            <Typography fontSize="11px" mt="-5px">vendor</Typography>
            </Box>
         </Box>
      
}
