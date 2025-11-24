import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import config from "../../config.json"
import { fined, computePrice, fromUrl } from "../../functions/helper"

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
    
    <Box 
      className="no-link" 
      sx={{ mb: 0, width: "230px" }} >
      {/* onClick={(e)=>{ navigate("/product?id=" + props.data.id) }} > */}
        <Link to={"/product?id=" + props.data.id} >

        <Box className="product-quickview" onClick={(e)=>{ props.quickView(e, props.data)}} >Quick view</Box>

          <Swiper className="swiper" >
            {!!props.data.colors && props.data.colors.map((cv, index) => {
              return <Box key={"product-box-"+index} >
              <SwiperSlide key={"product-swiper-"+index} sx={{ display: "flex", justifyContent: "center", width: "240px" }} >
                <Box className="product-img-holder" ><Box component={"img"} key={"product-swiper-"+index} 
                src={config.api + "/" + cv.imagePath[0]} 
                alt={"photo"+(index+1)} className="product-img" /></Box>
              </SwiperSlide>
              </Box>
          })}
          </Swiper>

      <Box sx={{ display: "grid", gridTemplateColumns: "55px 10px auto", marginLeft: "5px", marginTop: "5px", alignItems: "center", justifyContent: "flex-start"}}>   
          {/* <Box className="product-item" sx={{gridColumn: "1 / -1", fontWeight: "600"}}>{props.data.itemName}</Box>
          <Box className="product-item" sx={{gridColumn: "1 / -1"}}>Art. no&nbsp;:&nbsp;&nbsp;{props.data.artNo}</Box>
          <Box className="product-item" sx={{gridColumn: "1 / -1"}}>Design&nbsp;:&nbsp;&nbsp;{props.data.design}</Box>
          <Box className="product-item" sx={{gridColumn: "1 / -1"}}>Price&nbsp;from&nbsp;:&nbsp;&nbsp; {fined(computePrice(props.data, 1000, false))}$</Box> */}
          
          <Box className="product-item" sx={{gridColumn: "1 / -1", fontWeight: "600", marginBottom: "5px"}}>{props.data.itemName}</Box>
          {/* <Box className="product-item label" >Item name</Box>
          <Box className="product-item label" >:</Box>
          <Box className="product-item" sx={{fontWeight: "600", marginBottom: "5px"}}>{props.data.itemName}</Box> */}
          <Box className="product-item label" >Art. no</Box>
          <Box className="product-item label" >:</Box>
          <Box className="product-item" >{props.data.artNo}</Box>
          <Box className="product-item label" >Design</Box>
          <Box className="product-item label" >:</Box>
          <Box className="product-item" >{props.data.design}</Box> 
          <Box className="product-item label" sx={{textAlign: "left"}}>Price</Box>
          <Box className="product-item label" >:</Box>
          <Box><span class="product-item">from&nbsp;</span><span class="product-item price">{fined(computePrice(props.data, 1000, false))}$</span></Box>
      </Box>
      <div style={{ clear: "left" }} >
      </div>
      </Link>
    </Box>
);
}
