import * as React from 'react';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


export default function Detail(props) {

  const [quantity, setQuantity] = React.useState(props.quantity)

  return
  <>
    <TextField
        margin="normal"
        size="small" 
        value={props.value}
        onChange={props.handleChange}
        inputProps={{
        style: {
            height: "14px",
        },
        }}
    />
    <IconButton aria-label="delete" sx={{backgroundColor: "#ddd", borderRadius: "8px", margin: "6px" }}>
          <DeleteIcon 
            sx={{ color: "#3d694a", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(index)}} >
          </DeleteIcon>
        </IconButton> 
    </>
}
