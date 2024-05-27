import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
//import AddPhoto from '@mui/icons-material/AddAPhotoOutlined';

import MySelect from '../../components/myselect';
import { AddAPhoto, PhotoCameraBackOutlined, PhotoCameraOutlined } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { mb: 3, ml: 0 }
const labelStyle = { mb: 3, ml: 0 }
const buttonStyle = { width: 180, height: 32, m: 2 }
const textStyle = { width: 76, m: 2, ml: 0 }
const divStyle = { width: 370, mt: 3, ml: 2, mr: 2 }
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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Input = styled('input')({
  display: 'none',
});

export default function ColorVariant(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    //const [selectedFile, setSelectedFile] = useState(props.cv.selectedFile)

    const setColorNo = (value) => {
      let cv = props.cv;
      cv.colorNo = parseInt(value)
      props.setColorItem(cv)
    }

    const setColorName = (value) => {
      let cv = props.cv;
      cv.colorName = value
      props.setColorItem(cv)
    }

    const setSelectedFile = (value) => {
      let cv = props.cv;
      cv.selectedFile = value
      props.setColorItem(cv)
    }
    
    const onFileChange = (event) => {
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
        label="Color No"
        name="colorNo"
        sx = {textStyle}
        value={props.cv.colorNo}
        onChange={ev => setColorNo(ev.target.value) }
      />

        <label htmlFor="icon-button-file">
        <Input accept="image/*" id="icon-button-file" type="file" onChange={onFileChange} />
        <IconButton
          color="primary"
          aria-label="upload picture"
          component="span"
        >
              {!props.cv.selectedFile && <AddAPhoto />}
              { props.cv.selectedFile && <PhotoCameraOutlined />}
        </IconButton>
      </label>      
      {/* <input
            type="file"
            onChange={onFileChange}
            hidden
          /> 
            <input type="file" ref={(fileUpload) => {
                    this.fileUpload = fileUpload;
                  }}
  style={{ visibility: 'hidden'}} onChange={onFileChange} />
            <IconButton
              onClick={() => this.fileUpload.click()}
              variant={selectedFile ? "outlined" : "contained"} 
              type="file">
              {!selectedFile && <AddAPhoto />}
              {selectedFile && <PhotoCameraOutlined />}
              
            </IconButton>*/}

        {/* <Button
          variant={selectedFile ? "outlined" : "contained"}
          component="label"
          style={buttonStyle}
          >
          { selectedFile ?  "Photo is selected" : "Select Photo"}
          <input
            type="file"
            onChange={onFileChange}
            hidden
          />
        </Button> */}
      </div>
      

      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        valueName="colorName"
        labelStyle={labelStyle}
        itemStyle={itemStyle}
        MenuProps={MenuProps}
        valueVariable={props.cv.colorName}
        setValueFn={setColorName}
        rgbField="rgb"
      />
       
       </FormControl>
  );
}
