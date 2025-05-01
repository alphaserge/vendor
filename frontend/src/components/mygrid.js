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

  const setQuantity2 = (id, value) => {
    //..
  }

  useEffect(() => {  }, []);

  return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%",  display: "flex" } }} > 

  <Card sx={{ maxWidth: 740, mt: 2, boxShadow: "none", backgroundColor: "#eee", borderRadius: "8px" }}>
  <CardContent sx={{ pb: 0 }}>

    <Box sx={{ display: "inline", padding: "3px 5px", flexDirection: "row", backgroundColor: "none", color: "#4f4fc2", fontSize: "normal" }}>
      {/* <Typography gutterBottom variant="h7" component="div" mr={10} className="order-header"> */}
      Order No. {props.data.number} from {formattedDate(props.data.created)}
      &nbsp;&nbsp;&nbsp;&nbsp;
      {/* </Typography>
      <Typography gutterBottom variant="h7" component="div" className="order-header"> */}
      Client name: {props.data.client}  {props.data.phone}
      {/* </Typography> */}
    </Box>

    <Grid container spacing={0} sx={{ padding: "10px 0" }} >
    { props.data.items.map((item, index) => (
        <Grid item 
          xs={12} 
          md={12} 
          key={"itemprod-"+index} 
          sx={{ padding: "8px 6px", backgroundColor: (index %2 ? "transparent" : "#f8f8f8"), alignItems: "center" }} >
          <MyGridRow 
            show={props.show}
            edit={props.edit}
            item={item} 
            index={index} 
            setQuantity2={setQuantity2}
            sx={{ alignItems: "center" }}
            />
        </Grid>
    ))}
    </Grid>
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
