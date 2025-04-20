import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';


export default function MySelect(props) {

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%", height: "40px", display: "flex" } }} > 

    <Grid container spacing={2} >
    { orders.map((data, index) => (
        <Grid item xs={12} md={12} key={"itemprod-"+index} >
        <VendorOrderRow data={data} index={index} showForVendor={true} user={props.user} setVendorQuantity={setVendorQuantity} sendVendorQuantity={sendVendorQuantity} />
        </Grid>
    ))}
    </Grid>

  </FormControl>
);
}
