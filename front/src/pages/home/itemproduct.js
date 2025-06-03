import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import config from "../../config.json"
import { toFixed2 } from "../../functions/helper"


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

export default function ItemProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
    }, []);

  return (
    
          <Box className="no-link" sx={{ mb: 0, width: "240px" }} >
          <Box className="product-quickview" onClick={(e)=>{ props.quickView(e, props.data)}} >Quick view</Box>
          <Swiper className="swiper" >
            {props.data.colors.map((cv, index) => {
              return <Box key={"product-box-"+index} >
              <SwiperSlide key={"product-swiper-"+index} sx={{ display: "flex", justifyContent: "center", width: "240px" }} >
                <Box className="product-img-holder" ><Box component={"img"} key={"product-swiper-"+index} 
                src={config.api + "/" + cv.imagePath[0]} 
                alt={"photo"+(index+1)} className="product-img" /></Box>
              </SwiperSlide></Box>
            })}
          
          </Swiper>
            
          <Box sx={{ display: "flex", flexDirection: "column", marginLeft: "5px", marginTop: "10px"}}> 
            <Box className="product-item">{props.data.itemName}</Box>
            <Box className="product-item price">From ${toFixed2(props.data.price)} per meter</Box>
          </Box> 
          
          <div style={{ clear: "left" }} >
          </div>
          </Box>
);
}
