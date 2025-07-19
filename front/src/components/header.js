import * as React from 'react';

import Typography from '@mui/material/Typography';

import {APPEARANCE as ap} from '../appearance';

export default function Header(props) {
  return <Typography 
            component={"div"} 
            sx={{ 
              fontSize: "14px",
              fontFamily: ap.FONTFAMILY,
              backgroundColor: "#eee", 
              color: "#555", 
              borderBottom: "none", //"1px solid #aaa",
              //borderRadius: "6px", 
              margin: "0px", 
              padding: "8px 6px", 
              textAlign: "center"}}>
            {props.text}
          </Typography>
         
}
