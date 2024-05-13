import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'

import { v4 as uuid } from 'uuid'

import MySelect from '../../components/myselect';
import Copyright from '../copyright';
import config from "../../config.json"

import Header from './header';
import Footer from './blog/Footer';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 400, m: 2 }
const labelStyle = { m: 2 }
const buttonStyle = { width: 180, m: 2 }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function ColorVariant(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [color, setColor] = useState([])
    const [colorNo, setColorNo] = useState("")
    const [selectedFile, setSelectedFile] = useState(null)
  
  const onFileChange = (event) => {
      setSelectedFile(event.target.files[0])
  }
// #endregion

    useEffect(() => {
    }, []);

  return (
    <FormControl  error={ false } required > 
    <InputLabel 
        id={props.id + "-label"}
        size="small" 
        sx={props.labelStyle} >
        {props.title}
    </InputLabel>
    <Select
        labelId={props.id + "-label"}
        id={props.id}
        size="small" 
        label={props.title}
        //variant="outlined"
        multiple = {Array.isArray(props.valueVariable)}
        value={props.valueVariable}
        sx = {props.itemStyle}
        onChange={dataChange}
        input={<OutlinedInput label={props.title} />}
        MenuProps={props.MenuProps}
    >
    { data.map((elem) => (
        <MenuItem 
            key={elem.id} 
            value={elem.id}
            style={getStyles(elem.id, selectedValue, theme)}>  
               {props.rgbField != undefined &&
                 <Box component="span" className="color_select_item" sx={{ backgroundColor: "#" + elem[props.rgbField], border: "1px solid #bbb", height: "24px", width: "24px",  mr: 2 }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 </Box>}
                 {elem[props.valueName]} 
            </MenuItem>
    ))}
    </Select>
  </FormControl>
  );
}
