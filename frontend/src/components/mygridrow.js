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
    
        <tr style={{ alignItems: "center", padding: 0, cursor: "pointer" }} >
          { props.show.image && <td><img key={"grid-image-" + props.index} 
                src={config.api + "/" + props.item.imagePath} 
                style={{width: "50px", height: "50px", mr: 2}}
                alt={"photo"+(props.index + 1)} /></td> }

            { props.show.product && <td key={"grid-valuename-" + props.index} style={props.st} >
                {props.item.product}
            </td> }

            { props.show.spec && <td key={"grid-valuespec-" + props.index} style={props.st} >
                {props.item.spec}
            </td> }

            { props.show.owner && <td key={"grid-valueowner-" + props.index} style={props.st} >
                {props.item.owner}
            </td> }

            { props.show.colorNames && <td key={"grid-valuecolor-" + props.index} style={props.st} >
                {props.item.colorNo ? "color " + props.item.colorNo + " - " : ""}{props.item.colorNames}
            </td> }

            { props.show.price && <td key={"grid-valueprice-" + props.index} style={{...props.st, ...{textAlign: "right"}}} >
                {formattedPrice(props.item.price)}<span style={{marginLeft: "2px", fontSize: "small"}}>$</span>
            </td> }

            { props.show.quantity && <td key={"grid-valuequantity-" + props.index} style={{...props.st, ...{textAlign: "right"}}} >
                {props.item.quantity}&nbsp;{props.item.unit.replace('rolls','r.').replace('meters','m.')}
            </td> }

            { props.show.details && <td key={"grid-valuedetails-" + props.index} style={props.st} >
                {props.item.details}
            </td> }

            { props.show.status && <td key={"grid-valuestatus-" + props.index} style={props.st} >
                {props.item.status}
            </td> }

{/* <FormControl><InputLabel id={"label_details_"+props.index} size="small" sx={labelStyle1} >Details:</InputLabel>  */}
            { props.edit.details && <td key={"grid-valueeditdetails-" + props.index} style={props.st} > 
                <TextField labelId={"label_details_"+props.index}
                  disabled={props.item.confirmByVendor!=null}
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
                /></td> }
                {/* </FormControl> */}

            { props.button.confirm && <td key={"grid-valuedetails-" + props.index} sx={{ width: "60px", pl:1 }} >
                <Button 
                              variant="contained"
                              style={props.item.confirmByVendor!=null ? disableStyle : buttonStyle}
                              sx={props.item.confirmByVendor!=null ? disableStyle : buttonStyle}
                              disabled={props.item.confirmByVendor!=null}
                              onClick={(e) => { props.handleAccept(props.item.id) }} >
                                  Accept
                            </Button>
            </td> }

          </tr> 

)

}
