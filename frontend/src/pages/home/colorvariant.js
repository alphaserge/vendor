import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CameraswitchOutlinedIcon from '@mui/icons-material/CameraswitchOutlined';

import MySelect from '../../components/myselect';
import { APPEARANCE } from '../../appearance';

const itemStyle = { width: 245 }
const labelStyle = { mb: 3, ml: 0 }
const textStyle = { width: 45, m: 0, ml: 0 }
const divStyle = { width: 340, mt: 3, ml: 4, mr: 4 }
const flexStyle = { display: "flex", justifyContent: "space-between", alignContent: "space-between", alignItems: "center", mr: 22 }

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

export default function ColorVariant(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const setColorNo = (value) => {
      let cv = props.cv;
      cv.ColorNo = parseInt(value)
      props.setColorItem(cv.Id, cv)
    }

    const setColorName = (value) => {
      let cv1 = props.cv;
      cv1.ColorIds = value
      props.cv.ColorNo = props.cv.No
      props.setColorItem(cv1.Id, cv1)
    }

    const setSelectedFile = (value) => {
      props.cv.SelectedFile = value
      props.cv.ColorNo = props.cv.No
      props.setColorItem(props.cv.Id, props.cv)
    }
    
    const onFileChange = (event) => {
      let cv = props.cv;
      setSelectedFile(event.target.files[0])
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
        name="colorNo"
        sx = {textStyle}
        value={props.cv.ColorNo}
        onChange={ev => setColorNo(ev.target.value) }
      />
      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        valueName="colorName"
        labelStyle={labelStyle}
        itemStyle={itemStyle}
        MenuProps={MenuProps}
        valueVariable={props.cv.ColorIds}
        setValueFn={setColorName}
        addNewFn={props.addNewFn}
        data={props.data}
      />

      <label htmlFor={"icon-button-file-"+props.cv.Id}>
      <Input accept="image/*" id={"icon-button-file-"+props.cv.Id} type="file" onChange={onFileChange} />
      <IconButton
        color="success"
        aria-label="upload picture"
        sx={{color: APPEARANCE.BLACK2}}
        component="span">
            {!props.cv.SelectedFile && <AddAPhotoIcon />}
            { props.cv.SelectedFile && <CameraswitchOutlinedIcon />}
      </IconButton>
      </label>      
      </div>
       </FormControl>
  );
}
