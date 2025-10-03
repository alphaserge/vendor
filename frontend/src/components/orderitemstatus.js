import * as React from 'react';
import Box from '@mui/material/Box';

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ChecklistOutlinedIcon from '@mui/icons-material/ChecklistOutlined';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import WarehouseIcon from '@mui/icons-material/Warehouse';
import AddHomeOutlinedIcon from '@mui/icons-material/AddHomeOutlined';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';
import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import HourglassBottomOutlinedIcon from '@mui/icons-material/HourglassBottomOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import BackHandOutlinedIcon from '@mui/icons-material/BackHandOutlined';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';

export default function OrderItemStatus(data) {

  const grey = "#777"
  const red = "#f77"
  const green = "#5c5"
  const size = 26
    
  if (!!data.delivered) {
    return <Tooltip title={<Typography fontSize="12px">Delivered!</Typography>}>
              <VerifiedOutlinedIcon sx={{ color: green, fontSize: size }} />
            </Tooltip>
  }

  if (!!data.clientDeliveryNo && !!data.clientDeliveryCompany) {
    return <Tooltip title={<Typography fontSize="12px">Shipping to client</Typography>}>
              <LocalShippingIcon sx={{ color: green, fontSize: size }} />
            </Tooltip>
  }

  if (!!data.stockName) {
    return <Tooltip title={<Typography fontSize="12px">On stock</Typography>}>
              <AddHomeOutlinedIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>
  }

  if (!!data.deliveryNo && !!data.deliveryCompany) {
    return <Tooltip title={<Typography fontSize="12px">Shipping to stock</Typography>}>
              <LocalShippingIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>
  }

  if (!!data.paid) {
    return <Tooltip title={<Typography fontSize="12px">Paid</Typography>}>
              <MonetizationOnOutlinedIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>

  }

  if (!!data.details) {
    return <Tooltip title={<Typography fontSize="12px">Confirmed by vendor</Typography>}>
              <BackHandOutlinedIcon sx={{ color: grey, fontSize: size }} />
            </Tooltip>
  }

  return <Tooltip title={<Typography fontSize="12px">Waiting of vendor</Typography>}>
              <AccessTimeOutlinedIcon sx={{ color: red, fontSize: size }} />
            </Tooltip>
      
}
