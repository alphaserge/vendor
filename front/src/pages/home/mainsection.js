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
    <Box sx={{ backgroundColor: "#eeede8", alignContent: "center" }} style={{ height: "100px" }}  >
      {/* <Box style={{ height: "100px" }} > */}

      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>left</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }} className="site-logo" >
        {/* <p>Angelica fabric market</p> */}
        <Box
            component="img"
            sx={{ width: 160, display: { xs: 'none', sm: 'block' } }}
            image="/afm.png"
            alt={""}
          />
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>right</p>
      </Grid>
      </Grid>
      {/*<Grid container spacing={2} >
        <Grid item xs={12} md={6} key={"itemprod-"+index} >
          <ItemProduct data={data} index={index} />
        </Grid>
      </Grid> */}

      {/* </Box> */}
      </Box>
  );
}


