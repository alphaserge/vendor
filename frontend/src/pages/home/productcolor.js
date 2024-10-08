import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DoneIcon from '@mui/icons-material/Done';

import MySelect from '../../components/myselect';
import { APPEARANCE } from '../../appearance';
import { green } from "@mui/material/colors";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 245 }
const labelStyle = { mb: 3, ml: 0 }
const buttonStyle = { width: 180, height: 32, m: 2 }
const textStyle = { width:340, m: 0, ml: 0 }
const divStyle = { width: 360, mt: 0, ml: 0, mr: 0 }
const flexStyle = { display: "flex", justifyContent: "space-between", alignContent: "space-between", alignItems: "center", mr: 22 }
//display: "flex", alignItems: "center", justifyContent: "space-between", alignContent: "space-between", marginRight: "22px"

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

const Input = styled('input')({
  display: 'none',
});

export default function ProductColor(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const setSelectedFile = (value) => {
      props.cv.SelectedFile = value
      props.setColorItem(props.cv.Id, props.cv)
    }
    
    const onFileChange = (event) => {
      let cv = props.cv;
      setSelectedFile(event.target.files[0])
      if (props.uploadFile) {
        props.uploadFile(event.target.files[0])
      }
    }

    useEffect(() => {
    }, []);

  return (
    
      <FormControl sx={divStyle}> 

      <div style={flexStyle}>
      <TextField
        margin="normal"
        size="small" 
        id="colorNo"
        //label="No"
        name="colorNo"
        sx = {[textStyle, (props.cv.SelectedFile ? { backgroundColor: "#ccc" }:{ backgroundColor: "#fff" })]}
        inputProps={{ readOnly: true }}
        value={props.cv.SelectedFile ? "PHOTO SELECTED" : ("PRODUCT PHOTO")} />

        <label htmlFor={"icon-button-file-prod"+props.cv.Id}>
        <Input accept="image/*" id={"icon-button-file-prod"+props.cv.Id} type="file" onChange={onFileChange} />
        <IconButton
          color="success"
          aria-label="upload picture"
          sx={{color: APPEARANCE.BLACK2}}
          component="span">
              {!props.cv.SelectedFile && <AddAPhotoIcon />}
              { props.cv.SelectedFile && <DoneIcon />}
        </IconButton>
      </label>      
      
      </div>
       </FormControl>
  );
}
