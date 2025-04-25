import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import "swiper/css";
import { sendToVendor } from '../api/orders'

import config from "../../config.json"

const defaultTheme = createTheme()
const itemStyle = { width: 265 }
const itemStyle1 = { width: 80, mt: '-3px', ml: 0, mr: 0, mb: '-3px', height: 1 }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Input = styled('input')({
  display: 'none',
});


export default function MyGridRow(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [showInfo, setShowInfo] = React.useState(false);
    const [info, setInfo] = React.useState("");
    const [vendorQty, setVendorQty] = React.useState(null);

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
    
    <Card sx={{ maxWidth: 740, mt: 2 }}>
    <CardContent sx={{ pb: 0 }}>

      { props.data.items.map((item, index) => (
          <Card style={{ border: "none", boxShadow: "none" }}>
          <CardContent sx={{ display: "flex", flexDirection: "row" }}>
          { props.showImage && <Box component={"img"} key={"grid-image-"+index} 
                src={config.api + "/" + item.imagePath} 
                sx={{width: "65px", height: "65px"}}
                alt={"photo"+(index+1)}  /> }

            { props.show.name && <Box component={"div"} key={"grid-valuename-"+index} >
                {item.valueName}
            </Box> }

            { props.show.spec && <Box component={"div"} key={"grid-valuespec-"+index} >
                {item.valueSpec}
            </Box> }

            { props.show.owner && <Box component={"div"} key={"grid-valueowner-"+index} >
                {item.valueOwner}
            </Box> }

            { props.show.price && <Box component={"div"} key={"grid-valueprice-"+index} >
                {item.valuePrice}
            </Box> }

            { props.show.quantity && <Box component={"div"} key={"grid-valuequantity-"+index} >
                {item.valueQuantity}
            </Box> }

            { props.show.quantity2 && <Box component={"div"} key={"grid-valuequantity2-"+index} >
                {item.valueQuantity2}
            </Box> }

            { props.edit.quantity2 && <TextField
                  margin="normal"
                  size="small" 
                  id={"grid-valuequantity2-" + index}
                  name={"grid-valuequantity2-" + index}
                  sx = {itemStyle1}
                  value={item.valueQuantity2}
                  onChange={ev => props.setQuantity2(props.id, ev.target.value)}
                /> }

          </CardContent>
          </Card>
          )) }

        </CardContent>

    {/* <CardActions sx={{ justifyContent: "right", mr: 3}} >
      {getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToVendor(props.data.vendorId) }}>Send to vendor</Button>}
      {props.user.vendorId!=1 && getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToGeneral(props.data.vendorId) }}>Send to general vendor</Button>}
      {getFromUrl('vendor')==1 && <Button size="medium" onClick={ (e) => { props.sendVendorQuantity(props.index) }}>Send to client</Button>}
    </CardActions> */}
  </Card>
);
}
