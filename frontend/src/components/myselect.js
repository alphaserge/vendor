import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'

import config from "../config.json"

function getStyles(name, values, theme) {
  /* let names = values;//.map(a => a[field]);
  console.log("names - name")
  console.log(names)
  console.log(name)
  console.log(names.indexOf(name))
  console.log("------------------")*/
  
return {
      fontWeight:
       values.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightBold,
          /*backgroundColor:
          names.indexOf(name) === -1
          ? "#F00"
          : "#F0F"*/
    };
  }

export default function MySelect(props) {

    const [selectedValue, setSelectedValue] = useState([])
    const [data, setData] = useState([])
    const theme = useTheme();

    const dataChange = (event) => {
        const { target: { value }, } = event;
        setSelectedValue( value );
        props.setValueFn( value );
      };
  
      const loadData = () => {
        axios.get(config.api + '/' + props.url)
        .then(function (res) {
            setData(res.data)
        })
        .catch (error => {
          console.log('MySelect(' + props.url + ') error:' )
          console.log(error)
        })
      }      
  
    useEffect(() => {
        loadData()
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
        multiple
        value={props.valueVariable}
        sx = {props.itemStyle}
        onChange={dataChange}
        input={<OutlinedInput label={props.title} />}
        MenuProps={props.MenuProps}
    >
    { data.map((elem) => (
        <MenuItem 
            key={elem.id} 
            value={elem[props.valueName]}
            style={getStyles(elem[props.valueName], selectedValue, theme)}>
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
