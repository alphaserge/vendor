import React, { useState, useEffect } from "react";
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';

import MyGrid from './mygrid';

export default function MyOrders(props) {

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%"  } }} > 

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
