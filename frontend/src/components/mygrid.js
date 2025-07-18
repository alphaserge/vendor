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

  return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%",  display: "flex" } }} > 

  <Card sx={{ maxWidth: 740, mt: 4, boxShadow: "none", borderTop: "1px solid #bbb", borderRadius: 0 }}>
  <CardContent sx={{ pb: 0 }}>

    <Box sx={{ display: "flex", color: "#000", fontSize: "13px", fontWeight: "400", pt: 1, pb: 2 }}>
      {/* <Typography gutterBottom variant="h7" component="div" mr={10} className="order-header"> */}
      { props.show.number && ( props.data.number + " / " + formattedDate(props.data.created))}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {/* </Typography>
      <Typography gutterBottom variant="h7" component="div" className="order-header"> */}
      { props.show.client && (props.data.client + " " + props.data.phone)}
      {/* </Typography> */}
    </Box>

    <table spacing={0} sx={{ padding: "10px 0" }} >
    { props.data.items.map((item, index) => (
          <MyGridRow 
            st={{ padding: "0 10px"}}
            show={props.show}
            edit={props.edit}
            button={props.button}
            item={item} 
            index={index}
            orderId={props.orderId} 
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
