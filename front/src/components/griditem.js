import { Link } from "react-router-dom";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import * as React from 'react';

import DeleteButton from "../components/deleteButton"

export default function GridItem(props) {

  var textAlign = "left"
  if (props.center) { textAlign = "center" }
  if (props.right ) { textAlign = "right"  }
  
  //var src = config.api + "/public/noimage.jpg"
  //if (props.src ) { src = config.api + "/" + props.imagePath }

  const linkStyle = { textDecoration: 'none', height: "100%", display: "contents", fontSize: "16px"}

  if (props.img) {
    if (props.link) {
      return <React.Fragment>
        <Link to={props.link} style={linkStyle}>
          <Grid item sx={{textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center"}} >
            <img 
              src={props.src}
              sx={{padding: "5px 5px 0 5px"}}
              width={60}
              height={55} /> 
          <DeleteButton onDelete={props.onDelete}/>
          </Grid>
        </Link>
      </React.Fragment>    
    } else {
      return <React.Fragment>
          <Grid item sx={{textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center"}} >
            <img 
              src={props.src}
              sx={{padding: "5px 5px 0 5px"}}
              width={60}
              height={55} /> 
          <DeleteButton onDelete={props.onDelete}/>
          </Grid>
      </React.Fragment>    
    }
  }

  return <React.Fragment>
    {(!!props.link && <Link to={props.link} style={linkStyle} > 
      <Grid item sx={{textAlign: textAlign, verticalAlign:"middle", display: "table-cell"}} > <Box>{props.text}</Box><Box sx={{marginLeft: "20px"}}><DeleteButton onDelete={props.onDelete}/></Box></Grid>
    </Link>)}
    {(!props.link && 
      <Grid item sx={{verticalAlign:"middle", display: "flex", justifyContent: "flex-end"}} ><Box>{props.text}</Box><Box sx={{marginLeft: "20px"}}><DeleteButton onDelete={props.onDelete}/></Box></Grid>
    )}
    </React.Fragment>
}
