import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import { APPEARANCE } from '../../appearance';
import { Link } from "@mui/material";

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

export default function ItemProductRow(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    useEffect(() => {
    }, []);

  return (
    
    <FormControl sx={{ mt: 0, width: 740 }} > 
      <Box sx={{ display: "flex", flexDirection: 'row', ml: 0, alignItems: "center" }}>
      <Link href={"/updateproduct?id=" + props.data.id} sx={{ maxWidth: "125px"}} >
          <Swiper className="mySwiper" >
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
            })}
            </Swiper>
            </Link>

          <Box sx={{ display: "flex", flexDirection: 'column', alignItems: "left", ml: 3}}>
                <Box className="product-item"><Box component={"span"} className="label width90">Item name: </Box>{props.data.itemName} </Box>
              {/* <div class="product-item">{props.data.refNo}</div>*/}
              <Box className="product-item">
                <Box component={"span"} className="label width90">Ref.</Box>{props.data.refNo} 
                <Box component={"span"} className="label marginleft30 marginright10">Art.</Box> {props.data.artNo}
                <Box component={"span"} className="label marginleft30 marginright10">Design: </Box>{props.data.design} 
              </Box> 
              <Box className="product-item"><Box component={"span"} className="label width90">Composition: </Box>{props.data.composition} </Box>
              
            </Box>
            {/* <Box display="flex" alignItems={"center"} justifyContent={"left"} >
               <Box className="product-item price" sx={{color: APPEARANCE.LIGHT_GREEN1}} >&nbsp;${props.data.price}&nbsp;</Box>
               <IconButton
                sx={{backgroundColor: APPEARANCE.LIGHT_GREEN1, color: "#fff", width: 48, height: 48, mt: 1, ml:1 }}
                aria-label="Add to cart"
                 >
              { true  && <AddShoppingCartIcon  />}
              { false && <AddShoppingCartIcon />}
              </IconButton>
            </Box> */}
           <div style={{ clear: "left" }} >
           </div>
           {/* </div> */}
           </Box>
           
           </FormControl>
);
}
