import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'
import config from "../config.json"

function getStyles(name, values, theme) {
  try 
  {
    if (Array.isArray(values)) {
      return {
        fontWeight:
        values.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightBold,
            /*backgroundColor: names.indexOf(name) === -1 ? "#F00" : "#F0F"*/
      }
    } else {
      return {}
    }
  }
  catch(exc)
  {
    let a = exc
  }
}

export default function MySelect(props) {

    let multiple = props.multiple;
    const [selectedValue, setSelectedValue] = useState([])
    const theme = useTheme();

    const dataChange = (event) => {
        const { target: { value } } = event;

        // processing of 'ALL' (-1) item (select all items)
        if (Array.isArray(value) && value.indexOf(-1) != -1) {
          let all = props.data.map(x => x.id).filter(x => x > -1)
          setSelectedValue(all)
          props.setValueFn(all)
          return
        }

        if (Array.isArray(value) && value && value.indexOf(-2) != -1) {
          props.addNewFn()
          return
        }

        if (!Array.isArray(value) && value == -2) {
          props.addNewFn()
        }

        setSelectedValue(value);
        props.setValueFn(value, props.option);
      };

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%", height: "40px", display: "flex" } }} > 
    {!props.hideLabel && <InputLabel 
        id={props.id + "-label"}
        size="small" 
        sx={props.labelStyle} >
        {props.title}
    </InputLabel>}
    <Select
        labelId={props.id + "-label"}
        id={props.id}
        size="small" 
        label={props.title}
        multiple = {Array.isArray(props.valueVariable)}
        disabled={props.disabled ? props.disabled : false}
        value={props.valueVariable ? props.valueVariable : ""}
        sx = {props.itemStyle}
        onChange={dataChange}
        input={<OutlinedInput label={props.title} />}
        MenuProps={props.MenuProps}
    >
    { props.data && props.data.map((elem) => (
        <MenuItem 
            key={elem.id} 
            value={elem.id}
            style={getStyles(elem.id, selectedValue, theme)}>  
               {elem.id != -2 && elem.rgb &&
                 <Box component="span" className="color_select_item" sx={{ backgroundColor: "#" + elem.rgb, border: "1px solid #bbb", height: "24px", width: "24px",  mr: 2 }}>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                 </Box>} 
                 {elem.id == -2 && <AddIcon sx={{ mr: 2 }} />} 
                 { elem.value } 
        </MenuItem>
    ))}
    </Select>
    
  </FormControl>
);
}
