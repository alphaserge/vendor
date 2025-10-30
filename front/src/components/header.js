import * as React from 'react';

import Typography from '@mui/material/Typography';

export default function Header(props) {
  return <Typography 
            component={"div"} 
            sx={{ 
              fontSize: "13px",
              fontWeight: 600,
              backgroundColor: "#ddd", 
              color: "#333", 
              borderBottom: "none", //"1px solid #aaa",
              //borderRadius: "6px", 
              margin: "0px", 
              padding: "12px 6px", 
              textAlign: "center"}}>
            {props.text}
          </Typography>
         
}
