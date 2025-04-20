import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Collapse from '@mui/material/Collapse';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { APPEARANCE } from '../../appearance';
import { Link } from "@mui/material";
import { formattedDate, computePrice } from '../../functions/helper';
import { sendToVendor } from '../../api/orders'

import config from "../../config.json"
import { getFromUrl } from '../../functions/helper';

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


export default function VendorOrderRow(props) {

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

    <CardContent sx={{ pb: 0}}>

      { props.data.items.map((item, index) => (
          <Card style={{ border: "none", boxShadow: "none" }}>
          <CardContent sx={{display: "flex", flexDirection: "row"}}>
          <Box component={"img"} key={"product-swiper-"+index} 
                src={config.api + "/" + item.imagePath} 
                sx={{width: "100px", height: "100px"}}
                alt={"photo"+(index+1)}  />
            
            <table style={{width: "100%", marginLeft: "10px"}}>
              <tr>
                <td className="order-item-label">Art No:</td>
                <td className="order-item-value">{item.artNo}</td>
                <td className="order-caption" colspan={3}><div style={{width: "240px"}}>{item.itemName}</div></td>
                <td className="order-item-label">Quantity:</td>
                <td className="order-item-value">{item.quantity}&nbsp;m</td>
                </tr>
              <tr>
                <td className="order-item-label">Ref No:</td>
                <td>{item.refNo}</td>
                <td className="order-item-value" colspan={3}><div style={{width: "240px"}}>{item.composition}</div></td>
                { getFromUrl('vendor')!=1 && <td className="order-item-label">Price:</td> }
                { getFromUrl('vendor')!=1 && <td className="order-item-value">{item.price}&nbsp;$</td> }
                { getFromUrl('vendor')==1 && <td className="order-item-label">Available:</td> }
                { getFromUrl('vendor')==1 && item.vendorQuantity && <td className="order-item-value">{item.vendorQuantity}&nbsp;$</td> }
                { getFromUrl('vendor')==1 && !item.vendorQuantity && 
                <td className="order-item-value">
              <TextField
                margin="normal"
                size="small" 
                id="itemName"
                //label="Item name"
                name="itemName"
                sx = {itemStyle1}
                value={item.vendorQuantity}
                onChange={ev => props.setVendorQuantity(item.id, ev.target.value)}
              />

                </td> }
              </tr>
              <tr>
                <td className="order-item-label">Design:</td>
                <td className="order-item-value">{item.design}</td>
                <td className="order-item-label" colspan={2}>Vendor:&nbsp;<span className="order-caption">{item.vendorName}</span></td>
                <td></td>
                <td></td>
                <td className="order-item-label">Total:</td>
                <td className="order-item-value">{computePrice(item.price,item.quantity).toFixed(2)}&nbsp;$</td>
              </tr>
            </table>
          </CardContent>
          </Card>
          )) }

        </CardContent>

    <CardActions sx={{ justifyContent: "right", mr: 3}} >
      {getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToVendor(props.data.vendorId) }}>Send to vendor</Button>}
      {props.user.vendorId!=1 && getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToGeneral(props.data.vendorId) }}>Send to general vendor</Button>}
      {getFromUrl('vendor')==1 && <Button size="medium" onClick={ (e) => { props.sendVendorQuantity(props.index) }}>Send to client</Button>}
      
    </CardActions>
  </Card>

  /*
              {props.data.colors.map((cv, index) => {
              return <>
              <SwiperSlide key={"product-swiper"+index} sx={{ display: "flex", justifyContent: "center"}} >
                <Box className="product-img-holder-small" >
                  <Box component={"img"} 
                    key={index} 
                    src={config.api + "/" + cv.imagePath[0]} 
                    alt={"photo"+(index+1)} 
                    className="product-img" />
                  </Box>
              </SwiperSlide></>

  */

);
}
