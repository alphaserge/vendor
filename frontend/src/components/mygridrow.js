import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import "swiper/css";
import { sendToVendor } from '../api/orders'

import config from "../config.json"

export default function MyGridRow(props) {

    const handleSendToVendor = (vendorId) => {
      sendToVendor(vendorId)
      if (props.showInfo) {
        props.showInfo("Order successfully sent to vendor " + props.data.vendorName)
      }
    }
    
    const handleSendToGeneral = (vendorId) => {
      sendToVendor(vendorId)
    }

    const handleSendToClient = (vendorId) => {
      sendToVendor(vendorId)
      if (props.showInfo) {
        props.showInfo("Order successfully sent to vendor " + props.data.vendorName)
      }
    }
    
    useEffect(() => {
    }, []);

  return (
    
      <Box>
      
          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0 }}>
          { props.show.image && <Box component={"img"} key={"grid-image-" + props.index} 
                src={config.api + "/" + props.item.imagePath} 
                sx={{width: "40px", height: "30px", mr: 2}}
                alt={"photo"+(props.index + 1)}  /> }

            { props.show.product && <Box component={"div"} key={"grid-valuename-" + props.index} sx={{ flexGrow: 1 }} >
                {props.item.product}
            </Box> }

            { props.show.spec && <Box component={"div"} key={"grid-valuespec-" + props.index} >
                {props.item.spec}
            </Box> }

            { props.show.vendor && <Box component={"div"} key={"grid-valueowner-" + props.index} sx={{ width: "120px" }} >
                {props.item.vendor}
            </Box> }

            { props.show.price && <Box component={"div"} key={"grid-valueprice-" + props.index} sx={{ width: "60px", pl:1 }} >
                {props.item.price}
            </Box> }

            { props.show.quantity && <Box component={"div"} key={"grid-valuequantity-" + props.index} sx={{ width: "60px", pl:1 }} >
                {props.item.quantity}
            </Box> }

            { props.show.quantity2 && <Box component={"div"} key={"grid-valuequantity2-" + props.index} sx={{ width: "60px", pl:1 }} >
                {props.item.quantity2}
            </Box> }

            { props.edit.quantity2 && <TextField
                  margin="normal"
                  size="small" 
                  id={"grid-valuequantity2-" + props.index}
                  name={"grid-valuequantity2-" + props.index}
                  sx = {{ width: 80, mt: '-3px', ml: 0, mr: 0, mb: '-3px' }}
                  value={props.item.quantity2}
                  onChange={ev => props.setQuantity2(props.id, ev.target.value)}
                  inputProps={{
                    style: {
                      height: "10px",
                    },
                  }}
                /> }

          </Box>
  </Box>
);
}
