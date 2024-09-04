import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import DoneIcon from '@mui/icons-material/Done';
import InputAdornment from '@mui/material/InputAdornment';

import MySelect from '../../components/myselect';
import { APPEARANCE } from '../../appearance';

const itemStyle = { width: "197px" }
const labelStyle = {  }
const textStyle = { m: 0, mr: 1 }
const divStyle = { width: 360, mt: 0, ml: 0, mr: 0 }
const flexStyle = { display: "flex", justifyContent: "space-between", alignContent: "space-between", alignItems: "center", mr: 1 }

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
      cv.colorNo = parseInt(value)
      props.setColorItem(cv.id, cv)
    }

    const setQuantity = (value) => {
      let cv = props.cv;
      cv.quantity = parseInt(value)
      if (!cv.colorNo) {
        cv.colorNo = cv.no
      }
      props.setColorItem(cv.uuid, cv)
    }

    const setColorName = (value) => {
      let cv1 = props.cv;
      cv1.colorIds = value
      //props.cv.ColorNo = props.cv.ColorNo
      props.setColorItem(cv1.colorVariantId, cv1)
    }

    const setSelectedFile = (value) => {
      props.cv.selectedFile = value
      props.cv.colorNo = props.cv.colorNo
      props.setColorItem(props.cv.uuid, props.cv)
    }
    
    const onFileChange = (event) => {
      let cv = props.cv;
      setSelectedFile(event.target.files[0])
    }

    useEffect(() => {
      
    }, []);

    const existingStyle = (props.cv.colorVariantId != null ? {backgroundColor: "#eee"} : {})

  return (
    
      <FormControl sx={divStyle}> 

      <Box component="div" style={flexStyle}>
      <TextField
        margin="normal"
        size="small" 
        id="colorNo"
        name="colorNo"
        label="No."
        sx = {{...textStyle, ...{width: "85px"}, ...existingStyle}}
        value={props.cv.colorNo}
        onChange={ev => setColorNo(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        margin="normal"
        size="small" 
        id="colorQuantity"
        name="colorQuantity"
        label="Qty."
        sx = {{...textStyle, ...{width: "120px"}, ...existingStyle}}
        value={props.cv.quantity}
        onChange={ev => setQuantity(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        valueName="colorName"
        labelStyle={labelStyle}
        itemStyle={{...itemStyle, ...existingStyle}}
        MenuProps={MenuProps}
        valueVariable={props.cv.colorIds}
        setValueFn={setColorName}
        addNewFn={props.addNewFn}
        data={props.data}
      />

      <label htmlFor={"icon-button-file-" + props.cv.colorVariantId}>
      <Input accept="image/*" id={"icon-button-file-"+props.cv.colorVariantId} type="file" onChange={onFileChange} />
      <IconButton
        color="success"
        aria-label="upload picture"
        sx={{color: APPEARANCE.BLACK2}}
        component="span">
            {!props.cv.selectedFile && <AddAPhotoIcon />}
            { props.cv.selectedFile && <DoneIcon />}
      </IconButton>
      </label>      
      </Box>
       </FormControl>
  );
}
