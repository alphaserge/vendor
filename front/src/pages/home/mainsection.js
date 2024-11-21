import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Icon } from '@mui/material';
import { APPEARANCE } from '../../appearance';
import { Height } from "@mui/icons-material";

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function MainSection(props) {
  
useEffect(() => {
    //console.log(props.title)
  }, []);

  return (
    <Box sx={{ backgroundColor: "#00fefb" }} >
      <Box style={{ backgroundColor: "00fefb", height: "100px" }} >

      <p>111111111</p>
      {/*<Grid container spacing={2} >
        <Grid item xs={12} md={6} key={"itemprod-"+index} >
          <ItemProduct data={data} index={index} />
        </Grid>
      </Grid> */}

      </Box>
      </Box>
  );
}


