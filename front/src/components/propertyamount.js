import * as React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { isNumber } from '../functions/helper';

export default function PropertyAmount(props) {

  //const [help, setHelp] = React.useState("")
  const [amount, setAmount] = React.useState(props.amount)
  const [isRolls, setIsRolls] = React.useState(props.isRolls)

  /*const makeHelp = () => {

    setHelp("")
    if (!isNumber(amount) || !isNumber(props.product.rollLength) ) {
      if (isRolls === true ) {
        setHelp("? m")
      } else {
        setHelp("? roll")
      }
    } else {
      if (isRolls === true ) {
        setHelp((amount * props.product.rollLength).toFixed(2) + " m")
      } else {
        setHelp((amount / props.product.rollLength).toFixed(2) + " rolls")
      }
    } 
  
    //if (props.setHelp) {
    //  props.setHelp(props.product.id, help)
    //}
  } */

  
  const handleChange = (event) => {
    let value = event.target.value
    // if (value.length > 0 && value[value.length-1] == '.' ) {
    //   value = value.slice(0,-1) + ','
    // }
    //var xStr = str.substring(0, str.length - 1);

    if (isNaN(value)) { 
      return 
    }

    let amn = value // parseFloat(value)
    setAmount(amn)
    props.setAmount(props.product.id, amn)
    //props.setAmount(props.product.id, value)
    //makeHelp(isRolls)
  }

  const selectChange = (event, i) => {
    let r = event.target.value == "roll"
    setIsRolls(r)
    props.setRolls(props.product.id, r)
    //makeHelp(r)
  }

  /* let help = ""
  if (!isNumber(amount) || !isNumber(props.product.rollLength) ) {
    if (isRolls === true ) {
      help = "? m"
    } else {
      help = "? roll"
    }
  } else {
    if (isRolls === true ) {
      help = (amount * props.product.rollLength).toFixed(2) + " m"
    } else {
      help = (amount / props.product.rollLength).toFixed(2) + " rolls"
    }
  } */

    //makeHelp()

    let help = ""
    if (!isNumber(amount) || !isNumber(props.product.rollLength) ) {
      if (isRolls === true ) {
        help ="= ? m"
      } else {
        help ="= ? roll"
      }
    } else {
      if (isRolls === true ) {
        help = "= " + (amount * props.product.rollLength).toFixed(2) + " m"
      } else {
        help = "= " + (amount / props.product.rollLength).toFixed(2) + " rolls"
      }
    } 

  //console.log('PropertyAmount props.isRolls:' + props.product.id)
  //console.log(props.isRolls)

  return <>
  <tr>
            <td><span class="item-label">{props.label}:</span></td>
            <td>
                <TextField
                  // type="number"
                  margin="normal"
                  size="small" 
                  sx = {{ 
                    width: 68, 
                    mt: '0px', 
                    ml: 0, 
                    mr: 0, 
                    mb: '-3px',
                    // "& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button": { display: "none" },
                    // "& input[type=number]": { MozAppearance: "textfield" },
                  }}
                  value={amount}
                  onChange={handleChange}
                  inputProps={{
                    style: {
                      height: "5px",
                    },
                  }}
                />
                <Select
                  value={isRolls===true? "roll":"m" }
                  label="Unit"
                  onChange={selectChange}
                  sx={{ height: "23px", ml: 1, mt: '0px'  }} >
                  <MenuItem value={'m'}>m</MenuItem>
                  <MenuItem value={'roll'}>roll</MenuItem>
                </Select>
                {/* &nbsp;-&nbsp;{help} */}
            </td>
         </tr>
         <tr><td><span class="item-label">&nbsp;</span></td><td><span class="item-label">{help}</span></td></tr>
         </>
}
