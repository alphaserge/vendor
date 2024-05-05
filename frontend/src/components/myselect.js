import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'

import config from "../config.json"

function getStyles(name, personName, theme) {
    return {
      fontWeight:
        personName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }

export default function MySelect(props) {

    const [selectedValue, setSelectedValue] = useState([])
    const [data, setData] = useState([])
    const theme = useTheme();

    const dataChange = (event) => {
        const { target: { value }, } = event;
        setSelectedValue( typeof value === 'string' ? value.split(',') : value );// On autofill we get a stringified value.
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
        value={selectedValue}
        sx = {props.itemStyle}
        onChange={dataChange}
        input={<OutlinedInput label={props.title} />}
        MenuProps={props.MenuProps}
    >
    { data.map((data) => (
        <MenuItem 
            key={data.id} 
            value={data.id}
            style={getStyles(data[props.valueName], selectedValue, theme)}>
            {data[props.valueName]}
            </MenuItem>
    ))}
    </Select>
  </FormControl>
);
}
