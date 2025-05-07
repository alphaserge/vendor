import * as React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { isNumber } from '../functions/helper';

export default function PropertyAmount(props) {

  //const [help, setHelp] = React.useState("")
  const [amount, setAmount] = React.useState(props.amount)
  const [isRolls, setIsRolls] = React.useState(props.isRolls)

  const makeHelp = (is_rolls) => {

    let help = ""
    if (!isNumber(amount) || !isNumber(props.product.rollLength) ) {
      if (is_rolls === true ) {
        help = "? m"
      } else {
        help = "? roll"
      }
    } else {
      if (is_rolls === true ) {
        help = (amount * props.product.rollLength).toFixed(2) + " m"
      } else {
        help = (amount / props.product.rollLength).toFixed(2) + " rolls"
      }
    } 
  
    if (props.setHelp) {
      props.setHelp(props.product.id, help)
    }
  }

  const handleChange = (event) => {
    let amn = parseInt(event.target.value)
    setAmount(amn)
    props.setAmount(props.product.id, amn)
    makeHelp(isRolls)
  }

  const selectChange = (event, i) => {
    let r = event.target.value == "roll"
    setIsRolls(r)
    props.setRolls(props.product.id, r)
    makeHelp(r)
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

  //console.log('PropertyAmount props.isRolls:' + props.product.id)
  //console.log(props.isRolls)

  return <tr>
            <td><span class="item-label">{props.label}:</span></td>
            <td>
                <TextField
                  margin="normal"
                  size="small" 
                  sx = {{ width: 60, mt: '0px', ml: 0, mr: 0, mb: '-3px' }}
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
}
