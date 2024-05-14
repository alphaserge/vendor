import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import FormControl from '@mui/material/FormControl';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';


import MySelect from '../../components/myselect';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 350, mb: 3, ml: 2 }
const labelStyle = { mb: 3, ml: 2 }
const buttonStyle = { width: 160, height: 32, m: 2 }
const textStyle = { width: 76, m: 2 }
const divStyle = { width: 370, mb: 3, ml: 2, mr: 2, backgroundColor: "#eee" }
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
export default function ColorVariant(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [color, setColor] = useState([])
    const [colorNo, setColorNo] = useState(props.cv.colorNo)
    const [selectedFile, setSelectedFile] = useState(null)
  
  const onFileChange = (event) => {
      setSelectedFile(event.target.files[0])
  }
// #endregion

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
        value={colorNo}
        onChange={ev => setColorNo(ev.target.value)}
      />
        <Button
          variant="outlined"
          component="label"
          style={buttonStyle}
          >
          { selectedFile ?  "Photo is selected" : "Select Photo"}
          <input
            type="file"
            onChange={onFileChange}
            hidden
          />
        </Button>
      </div>
      

      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        valueName="colorName"
        labelStyle={labelStyle}
        itemStyle={itemStyle}
        MenuProps={MenuProps}
        valueVariable={color}
        setValueFn={setColor}
        rgbField="rgb"
      />
       
       </FormControl>
  );
}
