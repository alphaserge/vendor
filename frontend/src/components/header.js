import * as React from 'react';

import Typography from '@mui/material/Typography';

import {APPEARANCE as ap} from '../appearance';

export default function Header(props) {
  return <Typography 
            component={"div"} 
            sx={{ 
              fontSize: "14px",
              fontFamily: ap.FONTFAMILY,
              fontWeight: "400",
              backgroundColor: props.transparent ? "none": "#8da0c7ff", 
              color: "#fff", 
              //borderRight: props.last?"1px dotted #aaa":"none", //"1px solid #aaa",
              //border: "1px dotted #aaa",
              borderRadius: "6px", 
              margin: "0px", 
              padding: "8px 8px", 
              textAlign: "center"}}>
            {props.text}
          </Typography>
         
}
