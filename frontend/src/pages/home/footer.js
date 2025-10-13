import React, { useState, useEffect } from "react";
import { useNavigate, redirect, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Icon } from '@mui/material';
import Grid from '@mui/material/Grid';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import TelegramIcon from '@mui/icons-material/Telegram';

import config from "../../config.json"

const pages = ['My Products', 'Add Product', 'Contacts' ];
const settings = ['Profile', 'Account', 'Dashboard', 'Login', 'Logout', 'Register'];

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function Footer(props) {
  
useEffect(() => {
  }, []);

  return (
    <AppBar position="static" sx={{backgroundColor: "#481c4d", mt: 6, pb: 2, pt: 6, boxShadow: "none"}} >
    <Box className="center-content">
    <Box className="main-section" sx={{ 
      fontSize: "15px",
      fontWeight: "200",
      display: "grid", 
      gridTemplateColumns: "1fr 1fr",
      columnGap: "10px",
      rowGap: "20px",
      alignItems: "flex-start" }}>

      <Grid item sx={{textAlign: "left"}}>
        <Box sx={{ minWidth: "200px" }} >
        <span style={{fontWeight: "400"}}>Contacts of JSC Textile Company Angelika</span><br/><br/>
        <span style={{fontWeight: "400"}}>Showroom address:</span><br/>
        <Box sx={{margin: "5px 0 0 10px"}}>Yaroslavskoe shosse, possession 1 building 1, Mytishchi, Moscow region, Russia<br/>
        Postal code: 141009<br/><br/></Box>
        <span style={{fontWeight: "400"}}>Phones:</span>
        <Box sx={{padding: "5px 0 0 10px"}}>+7 (926) 018-01-25, +7(916) 876-20-08</Box>
        <Box sx={{padding: "5px 0 0 10px"}}>
        <WhatsAppIcon sx={{color:"#fff"}}/> +7(926) 018-01-25<TelegramIcon sx={{color:"#fff", ml: 2}}/> +7(916) 876-20-08<br/><br/>
        </Box>
        <span style={{fontWeight: "400"}}>Headquarters:</span><br/>
        <Box sx={{padding: "5px 0 0 10px"}}>
        Bolshaya Gruzinskaya, 20, 3A/P Moscow, Russia<br/>
        Postal code: 123242</Box>
        </Box>
      </Grid>

      
      <Grid item sx={{textAlign: "left"}}>
    <span style={{fontWeight: "400"}}>About of Textile Company Angelika</span><br/><br/>
    JSC Textile Company Angelika is a company in Russia, with its main office in Moscow. It operates in the industry of wholesale trade in clothing, textiles and related products. The company was founded on January 13, 2003.
      <br/><br/>Being part of the light industrial complex, the company in its activities is primarily focused on satisfying the current needs of the end consumer. In order to saturate the market with its products, the organization cooperates with a number of large and small retail outlets in Moscow and other regions.
      </Grid>
    </Box>

          <Box sx={{ flexGrow: 0 }}>
      <Typography color="#fff" align="center"  fontSize={"15px"} fontWeight={"300"} {...props} >
        {'Copyright © JSC Textile Company Angelika, Moscow - '}
        {/* <Link href="#" color="#fff">JSC Angelka Moscow</Link>{' '} */}
        {new Date().getFullYear()}
        {/* {'.'} */}
      </Typography>
      </Box>

    </Box>
    </AppBar>
  );
}
//export default Header;
