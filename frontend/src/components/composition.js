import { colors } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import MySelect from '../components/myselect';
import Header from '../components/header';
import {APPEARANCE as ap} from '../appearance';
//import { getTextileTypes, postTextileType } from '../api/textiletypes'

const labelStyle = { m: 0, ml: 0, mr: 4 }
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const halfItemStyle = { width: "calc( 50% - 3px )", m: 0 }
const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

export default function Composition(props) {

  /*const [textileTypes, setTextileTypes] = useState([])
  
  useEffect(() => {
    getTextileTypes(setTextileTypes)
  }, [])*/

//console.log('comp.values')
//console.log(props.values)
console.log('props.value:')
console.log(props.value)
  
  return                 <Box 
                              sx={{ 
                                display: "grid",
                                gridTemplateColumns: "1fr 50px 32px",
                                columnGap: "5px",
                                rowGap: "10px",
                                color: "#222", 
                                fontFamily: ap.FONTFAMILY,
                                fontSize: ap.FONTSIZE
                                }}>
                                <div style={{gridColumn: "span 3"}}> <Typography align="center" sx={{ width: "100%", fontWeight: "bold", fontSize: "11pt", backgroundColor: "#ddd", padding: "20px 20px" }}>Composition</Typography></div>
                                { props.value.map((data, index) => (  
                                <React.Fragment>
                                   <MySelect 
                                      id={"comps-" + index}
                                      key={"compsk-" + props.value[index].id}
                                      url="TextileTypes"
                                      title="Textile type"
                                      //valueName="value"
                                      labelStyle={labelStyle}
                                      //itemStyle={halfItemStyle}
                                      MenuProps={MySelectProps}
                                      value={props.value[index].id}
                                      setValue={props.idChanged}
                                      values={props.values}
                                      keys={props.keys}
                                      option={index}
                                      //addNew={props.addNew}
                                    />
                                    <TextField
                                      margin="normal"
                                      size="small" 
                                      id={"compv-" + props.value[index].id}
                                      key={"compvk-" + props.value[index].id}
                                      label="%"
                                      name={"compv-" + index}
                                      value={props.value[index].value}
                                      sx = {{ m: 0, textAlign: "center" }}
                                      onChange={ev => props.valueChanged(ev.target.value, index)}
                                    />
                                    <IconButton aria-label="delete" >
                                    <DeleteIcon 
                                      sx={{ color: "#222", fontSize: 26, mt: "-3px" }}
                                      onClick={(e)=>{props.delete(index)}} 
                                      >
                                    </DeleteIcon>
                                  </IconButton> 
                                 </React.Fragment>  ))} 
                          </Box>
  
         
}
