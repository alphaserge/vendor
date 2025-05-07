import * as React from 'react';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { isFloat } from '../functions/helper';

export default function PropertyAmount(props) {

  //const [help, setHelp] = React.useState("")
  const [amount, setAmount] = React.useState(props.amount)

  const handleChange = (event) => {
    let amn = parseInt(event.target.value)
    setAmount(amn)
    props.setAmount(props.product.id, amn)
  }

  const selectChange = (event, i) => {
    props.setRolls(props.product.id, event.target.value == "roll")
  }

  let help = ""
  if (!isFloat(props.amount) || !isFloat(props.product.rollLength) ) {
    if (props.rolls === true ) {
      help = "? m"
    } else {
      help = "? roll"
    }
  } else {
    if (props.rolls === true ) {
      help = props.amount * props.product.rollLength + " m"
    } else {
      help = props.amount / props.product.rollLength + " roll"
    }
  } 

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
                  value={props.isRolls===true? "roll":"m" }
                  label="Unit"
                  onChange={selectChange}
                  sx={{ height: "23px", ml: 1, mt: '0px'  }} >
                  <MenuItem value={'m'}>m</MenuItem>
                  <MenuItem value={'roll'}>roll</MenuItem>
                </Select>
                {help}
            </td>
         </tr>
}
