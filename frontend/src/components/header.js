import * as React from 'react';

import Typography from '@mui/material/Typography';

import {APPEARANCE as ap} from '../appearance';

export default function Header(props) {
  return <Typography 
            component={"div"} 
            sx={{ 
              fontSize: "14px",
              fontFamily: ap.FONTFAMILY,
              fontWeight: 500,
              backgroundColor: "#e8e8e8", 
              color: "#333", 
              borderBottom: "none", //"1px solid #aaa",
              //borderRadius: "6px", 
              margin: "0px", 
              padding: "9px 8px", 
              textAlign: "left"}}>
            {props.text}
          </Typography>
         
}
