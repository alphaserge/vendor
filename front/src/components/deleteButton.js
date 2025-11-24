import * as React from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export default function DeleteButton(props) {
  return    !props.onDelete ? <></> : <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}} >
            
            <IconButton aria-label="delete" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "0", padding: "0" }} onClick={props.onDelete}>
              <DeleteOutlineIcon
                sx={{ color: "#888", fontSize: 26}} >
              </DeleteOutlineIcon>
            </IconButton>
            </Box>
  
         
}
