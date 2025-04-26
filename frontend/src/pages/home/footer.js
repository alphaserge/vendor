import React, { useState, useEffect } from "react";
import { useNavigate, redirect, Link } from "react-router-dom";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import ApiIcon from '@mui/icons-material/Api';
import { Icon } from '@mui/material';
import { APPEARANCE } from '../../appearance';

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
    //console.log(props.title)
  }, []);

  return (
    <AppBar position="relative" sx={{backgroundColor: APPEARANCE.BLACK}} >
      <Box sx={{ flexGrow: 0 }}>
      <Typography variant="body2" color="#fff" align="center" {...props} >
        {'Copyright © JSC Angelka Moscow - '}
        {/* <Link href="#" color="#fff">JSC Angelka Moscow</Link>{' '} */}
        {new Date().getFullYear()}
        {'.'}
      </Typography>
      </Box>
    </AppBar>
  );
}
//export default Header;
