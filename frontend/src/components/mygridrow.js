import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import "swiper/css";
import { sendToVendor } from '../api/orders'

import config from "../config.json"
import { formattedPrice } from "../functions/helper"

export default function MyGridRow(props) {

  const [extend, setExtend] = useState(false)

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

//e.target.id === "valuequantity2-0"  nodeName: "INPUT"
    
    useEffect(() => {
    }, []);

  return (
    
      <Box>
      
        { extend!==true && <Box 
            sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, cursor: "pointer" }}
            onClick={(e)=>{ if (e.target.nodeName.toUpperCase() !== "INPUT") { setExtend(true) }; console.log(e.target.id); console.log(e)}}
          >
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

            { props.show.owner && <Box component={"div"} key={"grid-valueowner-" + props.index} sx={{ width: "120px" }} >
                {props.item.owner}
            </Box> }

            { props.show.price && <Box component={"div"} key={"grid-valueprice-" + props.index} sx={{ width: "60px", pl:1, textAlign: "right" }} >
                {formattedPrice(props.item.price)}<span style={{marginLeft: "2px", fontSize: "small"}}>$</span>
            </Box> }

            { props.show.quantity && <Box component={"div"} key={"grid-valuequantity-" + props.index} sx={{ width: "45px", pl:1, textAlign: "right"  }} >
                {props.item.quantity}
            </Box> }

            { props.show.quantity2 && <Box component={"div"} key={"grid-valuequantity2-" + props.index} sx={{ width: "60px", pl:1 }} >
                {props.item.quantity2}
            </Box> }

            { props.edit.quantity2 && <TextField
                  margin="normal"
                  size="small" 
                  id={"valuequantity2-" + props.index}
                  name={"valuequantity2-" + props.index}
                  sx = {{ width: 60, mt: '-3px', ml: 2, mr: 0, mb: '-3px' }}
                  value={props.item.quantity2}
                  onChange={ev => props.setQuantity2(props.id, ev.target.value)}
                  inputProps={{
                    style: {
                      height: "10px",
                    },
                  }}
                /> }
          </Box> 
    }

{ extend===true && <Box sx={{ display: "flex", flexDirection: "row", height: 100, padding: 0, cursor: "pointer" }}>
  { props.show.image && <Box component={"img"} key={"grid-image-" + props.index} 
                src={config.api + "/" + props.item.imagePath} 
                sx={{width: "90px", height: "90px", mr: 2}}
                alt={"photo"+(props.index + 1)}  /> }
                
  <Box sx={{ flexGrow: 2, display: "flex", flexDirection: "column" }}>
    
    <Box sx={{ display: "flex", flexDirection: "row", pl: 2 }}>
      <Box sx={{pr: 2, width: 100}}>Item name:</Box>{props.item.product}
    </Box> 

    <Box sx={{ display: "flex", flexDirection: "row", pl: 2 }}>
      <Box sx={{pr: 2, width: 100}}>Composition:</Box>{props.item.spec}
    </Box> 

  </Box>

  <Box sx={{ display: "flex", flexDirection: "column", pr: 3 }}>

    <Box sx={{ display: "flex", flexDirection: "row", pl: 2 }}>
      <Box sx={{pr: 2, width: 70}}>Price:</Box>{formattedPrice(props.item.price)}<span style={{marginLeft: "2px", fontSize: "small"}}>$</span>
    </Box> 

    <Box sx={{ display: "flex", flexDirection: "row", pl: 2 }}>
      <Box sx={{pr: 2, width: 70}}>Quantity:</Box>{formattedPrice(props.item.quantity)}<span style={{marginLeft: "2px", fontSize: "small"}}>$</span>
    </Box>

  </Box>

  </Box>
  
  }

  </Box>
);
}
