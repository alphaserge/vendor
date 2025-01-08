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

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { APPEARANCE } from '../../appearance';
import { Link } from "@mui/material";
import { formattedDate, computePrice } from '../../functions/helper';

import config from "../../config.json"

const defaultTheme = createTheme()
const itemStyle = { width: 265 }

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

export default function ItemOrderRow(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
    }, []);

console.log(props.data)

  return (
    
    <Card sx={{ maxWidth: 740, mt: 2 }}>

    <CardContent sx={{ pb: 0}}>
      <Box sx={{ display: "flex", flexDirection: "row" }}>
      <Typography gutterBottom variant="h7" component="div" mr={10} className="order-header">
      <b>Order No. {props.data.number} from {formattedDate(props.data.created)}</b>
      </Typography>
      <Typography gutterBottom variant="h7" component="div" className="order-header">
      Client name: <b>{props.data.clientName}</b>  {props.data.clientPhone}
      </Typography>
      </Box>
      {/* <Typography variant="body2" sx={{ color: 'text.secondary' }}>
      </Typography> */}

      { props.data.items.map((item, index) => (
          <Card style={{ border: "none", boxShadow: "none" }}>
          {/* <CardMedia
            sx={{ height: 80 }}
            //image="/static/images/cards/contemplative-reptile.jpg"
            src={config.api + "/" + item.imagePath}
            title={item.itemName}
          />
           */}
           
          <CardContent sx={{display: "flex", flexDirection: "row"}}>
          <Box component={"img"} key={"product-swiper-"+index} 
                src={config.api + "/" + item.imagePath} 
                sx={{width: "80px", height: "80px"}}
                alt={"photo"+(index+1)}  />
            
            <table style={{width: "100%", marginLeft: "10px"}}>
              <tr>
                <td className="order-item-label">Art No:</td>
                <td className="order-item-value">{item.artNo}</td>
                <td className="order-caption" colspan={3}>{item.itemName}</td>
                <td className="order-item-label">Quantity:</td>
                <td>{item.quantity}&nbsp;m</td>
                </tr>
              <tr>
                <td className="order-item-label">Ref No:</td>
                <td>{item.refNo}</td>
                <td className="order-item-value" colspan={3}>{item.composition}</td>
                <td className="order-item-label">Price:</td>
                <td>{item.price}&nbsp;$</td>
              </tr>
              <tr>
                <td className="order-item-label">Design:</td>
                <td className="order-item-value">{item.design}</td>
                <td className="order-item-label">Vendor:&nbsp;<span className="order-caption">{item.vendorName}</span></td>
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
      <Button size="medium">Share</Button>
      <Button size="medium">Print</Button>
      <Button size="medium">Send to vendor</Button>
      <Button size="medium">Make delivery</Button>
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
