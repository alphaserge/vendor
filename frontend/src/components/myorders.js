import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import MyGrid from './mygrid';

export default function MyOrders(props) {

  console.log('props.itemStyle')
  console.log(props.itemStyle)

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <FormControl error={ false } required sx={{ width: "100%" }}> {/* sx={{ ...props.itemStyle,  ...{width: "100%"  } }} */}

          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Box gutterBottom  mr={1} sx={{flexGrow: 1, fontWeight: "500", fontSize: "15px" }} >{props.title}</Box>
            {/* <InputLabel id="select-label" sx={{pr:2, position: "relative"}}>Show:</InputLabel> */}
            <Box sx={{pr: 1}}>Show:</Box>
            <Select
              id="entity-select"
              labelId="select-label"
              size="small"
              value={props.entity}
              onChange={props.changeEntity}>
                { props.entities.map((item, index) => (
                  <MenuItem value={item} key={"entity-"+index}>{item}</MenuItem> ))}
            </Select>
          </Box>

    { props.data.map((item, index) => (
         // <Grid item xs={12} md={12} key={"itemprod-"+index} > */}
          <MyGrid 
            key={"orders-grid-"+index}
            show={props.show}
            edit={props.edit}
            data={item} 
            index={index} 
            setQuantity2={props.setQuantity2} />
         // </Grid> */}
    ))}

  </FormControl>
);
}
