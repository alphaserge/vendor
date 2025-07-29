import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import MyGridRow from './mygridrow';
import { formattedDate } from '../functions/helper';

export default function MyGrid(props) {

  const setDetails = (id, value) => {
    //..
  }

  useEffect(() => {  }, []);

console.log("props.data.items")
console.log(props.data.items)


  return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%",  display: "flex" } }} > 

  <Card sx={{ maxWidth: 1100, mt: 0, boxShadow: "none" }}>
  <CardContent sx={{ pb: 0 }}>

    { props.show.number && <Box sx={{ width: "auto", color: "#000", backgroundColor: "#a8ddff", padding: "4px 12px", borderRadius: "4px", fontSize: "15px", fontWeight: "400" }}>
       Order No.  {props.data.number + " / " + formattedDate(props.data.created)}
        &nbsp; { "  from " + props.data.client + " " + props.data.phone}
    </Box>}

    <table spacing={0} class="my-grid-table" >
    { props.data.items.map((item, index) => (
          <MyGridRow 
            st={{ padding: "6px 10px"}}
            show={props.show}
            edit={props.edit}
            button={props.button}
            item={item} 
            index={index}
            orderId={item.orderId} 
            setDetails={props.setDetails}
            handleAccept={props.handleAccept}
            sx={{ alignItems: "center" }}
            />
    ))}
    </table>
    </CardContent>

    {/* <CardActions sx={{ justifyContent: "right", mr: 3}} >
      {getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToVendor(props.data.vendorId) }}>Send to vendor</Button>}
      {props.user.vendorId!=1 && getFromUrl('vendor')!=1 && <Button size="medium" onClick={ (e) => { handleSendToGeneral(props.data.vendorId) }}>Send to general vendor</Button>}
      {getFromUrl('vendor')==1 && <Button size="medium" onClick={ (e) => { props.sendVendorQuantity(props.index) }}>Send to client</Button>}
    </CardActions> */}
  </Card>

  </FormControl>
);
}
