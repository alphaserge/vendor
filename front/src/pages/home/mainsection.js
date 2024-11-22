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
    // #eeede8  efa29a
    <Box className="main-section">
    <Box sx={{ backgroundColor: "#f78997", color: "#fff", alignContent: "center", height: "44px" }} >
      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p>Sign up for our newsletter for 15% off</p>
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      </Grid>
    </Box>

    <Box sx={{ backgroundColor: "#fff", color: "#424242", alignContent: "center" }} style={{ height: "100px" }}  >
      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>left</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p className="site-logo">Angelica fabric market</p>
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>right</p>
      </Grid>
      </Grid>
    </Box>
    </Box>
  );
}


