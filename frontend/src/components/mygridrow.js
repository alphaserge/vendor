import React, { useState, useEffect } from "react";

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';

import "swiper/css";
import { sendToVendor } from '../api/orders'

import config from "../config.json"
import { formattedPrice } from "../functions/helper"
import { InputLabel } from "@mui/material"

import { APPEARANCE } from '../appearance';

const labelStyle = { m: 0, ml: 0, mr: 4 }
const labelStyle1 = { m: 0, ml: 0, mr: 4 }
const buttonStyle = { height: 26, backgroundColor: "#222", color: APPEARANCE.WHITE, textTransform: "none" }
const disableStyle = { height: 26, backgroundColor: "#ccc", color: APPEARANCE.WHITE, textTransform: "none" }

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

    console.log('props.item.confirmByVendor')
    console.log(props.item.confirmByVendor)


//e.target.id === "valuequantity2-0"  nodeName: "INPUT"
    
    useEffect(() => {
    }, []);

  return (
    
      <Box>
      
        { extend!==true && <Box 
            sx={{ display: "flex", flexDirection: "row", alignItems: "center", padding: 0, cursor: "pointer" }}
            //onClick={(e)=>{ if (e.target.nodeName.toUpperCase() !== "INPUT") { /* setExtend(true)*/ }; }}
          >
          { props.show.image && <Box component={"img"} key={"grid-image-" + props.index} 
                src={config.api + "/" + props.item.imagePath} 
                sx={{width: "50px", height: "50px", mr: 2}}
                alt={"photo"+(props.index + 1)}  /> }

            { props.show.product && <Box component={"div"} key={"grid-valuename-" + props.index} sx={{ flexGrow: 1, padding: "5px" }} >
                {props.item.product}
            </Box> }

            { props.show.spec && <Box component={"div"} key={"grid-valuespec-" + props.index} sx={{ padding: "10px" }} >
                {props.item.spec}
            </Box> }

            { props.show.owner && <Box component={"div"} key={"grid-valueowner-" + props.index} sx={{ padding: "10px" }} >
                {props.item.owner}
            </Box> }

            { props.show.colorNames && <Box component={"div"} key={"grid-valuecolor-" + props.index} sx={{ padding: "10px" }} >
                {props.item.colorNo ? "color " + props.item.colorNo + " - " : ""}{props.item.colorNames}
            </Box> }

            { props.show.price && <Box component={"div"} key={"grid-valueprice-" + props.index} sx={{ width: "60px", padding: "5px", textAlign: "right" }} >
                {formattedPrice(props.item.price)}<span style={{marginLeft: "2px", fontSize: "small"}}>$</span>
            </Box> }

            { props.show.quantity && <Box component={"div"} key={"grid-valuequantity-" + props.index} sx={{ width: "100px", padding: "5px", textAlign: "right"  }} >
                {props.item.quantity} {props.item.unit.replace('rolls','r').replace('meters','m')}
            </Box> }

            { props.show.details && <Box component={"div"} key={"grid-valuedetails-" + props.index} sx={{ width: "80px", padding: "5px" }} >
                {props.item.details}
            </Box> }

            { props.show.status && <Box component={"div"} key={"grid-valuestatus-" + props.index} sx={{ width: "60px", padding: "5px" }} >
                {props.item.status}
            </Box> }

{/* <FormControl><InputLabel id={"label_details_"+props.index} size="small" sx={labelStyle1} >Details:</InputLabel>  */}
            { props.edit.details && <TextField labelId={"label_details_"+props.index}
                  margin="normal"
                  size="small" 
                  //label="details"
                  id={"valuedetails-" + props.index}
                  name={"valuedetails-" + props.index}
                  sx = {{ width: 120, mt: '-3px', ml: 2, mr: 0, mb: '-3px' }}
                  value={props.item.details}
                  onChange={ev => props.setDetails(props.orderId, props.item.id, ev.target.value)}
                  inputProps={{
                    style: {
                      height: "10px",
                    },
                  }}
                /> }
                {/* </FormControl> */}

            { props.button.confirm && <Box component={"div"} key={"grid-valuedetails-" + props.index} sx={{ width: "60px", pl:1 }} >
                <Button 
                              variant="contained"
                              style={props.item.confirmByVendor!=null ? disableStyle : buttonStyle}
                              sx={props.item.confirmByVendor!=null ? disableStyle : buttonStyle}
                              disabled={props.item.confirmByVendor!=null}
                              onClick={(e) => { props.handleAccept(props.item.id) }} >
                                  Accept
                            </Button>
            </Box> }

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
