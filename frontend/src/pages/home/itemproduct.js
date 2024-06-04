import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';


import { Swiper, SwiperSlide } from "swiper/react";

import CustomSlider from "../../components/custom.slider";

import "swiper/css";

// TODO remove, this demo shouldn't need to reset the theme.
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
    
    <FormControl  sx={{ mb: 2, width: 440 }} > 
    {/* <div style={{ marginBottom: "20px" }} className="product-img" > */}
           {/* <div class="product-img">
           <img src={"https://localhost:3080/" + props.data.imagePaths[0]}  />
           </div> */}
          {/* <CustomSlider>
            {props.data.imagePaths.map((image, index) => {
              return <div className="product-img-holder" ><img key={index} src={"https://localhost:3080/"+image} alt={"photo"+(index+1)} className="product-img" /></div>;
            })}
          </CustomSlider> */}
          <>
          <Swiper className="mySwiper">
            {props.data.imagePaths.map((image, index) => {
              return <>
              <SwiperSlide key={"product-swiper"+index}>
                <Box className="product-img-holder" ><Box component={"img"} key={index} src={"https://localhost:3080/"+image} alt={"photo"+(index+1)} className="product-img" /></Box>
              </SwiperSlide></>
            })}
            </Swiper>
            </>

          <Box 
             key={props.data.id}
             value={props.data.id}
             sx={{ float: "left"}}
           >
             <div className="product-item">{props.data.itemName}</div>
             {/* <div class="product-item">{props.data.refNo}</div>*/}
             <div className="product-item">{props.data.artNo}</div> 
             <div className="product-item">{props.data.design}</div>
             <div className="product-item price"><span>&nbsp;${props.data.price}&nbsp;</span></div>
           </Box>
           <div style={{ clear: "left" }} >
           </div>
           {/* </div> */}
           </FormControl>
);
}
