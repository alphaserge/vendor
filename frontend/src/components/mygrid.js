import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

import MyGridRow from './mygridrow';

export default function MyGrid(props) {

  const setQuantity2 = (id, value) => {
    //..
  }

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%", height: "40px", display: "flex" } }} > 

    <Grid container spacing={2} >
    { props.data.map((item, index) => (
        <Grid item xs={12} md={12} key={"itemprod-"+index} >
          <MyGridRow 
            showImage={props.showImage}
            showValue={props.showValue}
            showSpec ={props.showSpec}
            showOwner ={props.showOwner}
            showPrice={props.showPrice}
            showQuantity={props.showQuantity}
            showQuantity2={props.showQuantity2}
            item={item} 
            index={index} 
            setVendorQuantity={setQuantity2} />
        </Grid>
    ))}
    </Grid>

  </FormControl>
);
}
