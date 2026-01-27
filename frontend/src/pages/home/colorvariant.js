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

const itemStyle = { width: "185px" }
const labelStyle = {  }
const textStyle = { m: 0, mr: 1 }
const divStyle = { width: 365, mt: 0, ml: 0, mr: 0 }
const flexStyle = { display: "flex", justifyContent: "space-between", alignContent: "space-between", alignItems: "center" }

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
      if (value && !cv.colorNo && props.fireChange) {
        props.fireChange(props.last)
      }
      cv.colorNo = parseInt(value)
      props.setColorItem(cv.id, cv)
    }

    const setQuantity = (value) => {
      let cv = props.cv;
      if (value && !cv.quantity && props.fireChange) {
        props.fireChange(props.last)
      }
      cv.quantity = parseInt(value)
      if (!cv.colorNo) {
        cv.colorNo = cv.no
      }
      props.setColorItem(cv.uuid, cv)
    }

    const setPrice = (value) => {
      let cv = props.cv;
      if (value && !cv.price && props.fireChange) {
        props.fireChange(props.last)
      }
      //cv.price = parseFloat(value)
      cv.price = value
      //??props.setColorItem(cv.id, cv)
      props.setColorItem(cv.uuid, cv)
    }

    const setColorIds = (value) => {
      let cv1 = props.cv;
      cv1.colorIds = value
      //props.cv.ColorNo = props.cv.ColorNo
      //props.setColorItem(cv1.colorVariantId, cv1)
      props.setColorItem(cv1.uuid, cv1)
    }

    const setSelectedFile = (value) => {
      let cv1 = props.cv;
      cv1.SelectedFile = value
      cv1.colorNo = props.cv.colorNo
      props.setColorItem(cv1.uuid, cv1)
    }
    
    const onFileChange = (event) => {
      let cv = props.cv;
      let file = event.target.files[0]
      setSelectedFile(file)
      if (props.fileChange) {
        props.fileChange(file)
      }
    }

    useEffect(() => {
      
    }, []);

   const existingStyle = (props.cv.colorVariantId != null ? {backgroundColor: "#eee"} : {})

  return (
    
      <FormControl sx={divStyle}> 

      <Box component="div" style={{display: "flex", flexDirection: "column"}}>
      <Box component="div" style={{...flexStyle, ...{marginBottom: "25px", marginRight: "38px" }}}>
      <TextField
        margin="normal"
        size="small" 
        id="colorNo"
        key="colorNo"
        name="colorNo"
        label="Col. No"
        sx = {{...textStyle, ...{width: "125px"}, ...existingStyle}}
        value={props.cv.colorNo ? props.cv.colorNo : ""}
        onChange={ev => setColorNo(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        margin="normal"
        size="small" 
        id="colorQuantity"
        key="colorQuantity"
        name="colorQuantity"
        label="Quantity"
        sx = {{...textStyle, ...{width: "140px"}, ...existingStyle}}
        value={props.cv.quantity ? props.cv.quantity : ""}
        onChange={ev => setQuantity(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        margin="normal"
        size="small" 
        id="colorPrice"
        key="colorPrice"
        name="colorPrice"
        label="Price"
        sx = {{...textStyle, ...{width: "140px"}, ...existingStyle}}
        value={props.cv.price ? props.cv.price : ""}
        onChange={ev => setPrice(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      </Box>
      <Box style={{...flexStyle}}>
      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        labelStyle={labelStyle}
        itemStyle={{...itemStyle, ...existingStyle }}
        MenuProps={MenuProps}
        value={props.cv.colorIds}
        setValue={setColorIds}
        addNew={props.addNew}
        values={props.values}
        keys={props.keys}
      />
      <label htmlFor={"icon-button-file-" + props.cv.uuid}>
      <Input accept="image/*" id={"icon-button-file-"+props.cv.uuid} type="file" onChange={onFileChange} value={""}  />
      <IconButton
        color="success"
        aria-label="upload picture"
        sx={{color: APPEARANCE.BLACK2, ml: 1}}
        component="span">
            {!props.cv.SelectedFile && <AddAPhotoIcon />}
            { props.cv.SelectedFile && <DoneIcon />}
      </IconButton>
      </label>

      </Box>
        {/* values={props.values.map(e => { return e.value})}
        keys={props.values.map(e => { return e.id})} */}

      </Box>
       </FormControl>
  );
}
