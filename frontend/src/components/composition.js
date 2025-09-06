import { colors } from '@mui/material';
import * as React from 'react';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

import MySelect from '../components/myselect';
import Header from '../components/header';
import {APPEARANCE as ap} from '../appearance';
import { getTextileTypes, postTextileType } from '../api/textiletypes'

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

  const [textileTypes, setTextileTypes] = useState([])
  const [textileTypeIds, setTextileTypeIds] = useState([])
  const [values, setValues] = useState([
    { id: null, value: null},
    { id: null, value: null},
    { id: null, value: null},
    { id: null, value: null},
    { id: null, value: null},
  ])

  const selectChanged = (value, index) => {
    let vals = [...values]
    //vals[index].value = value
    vals[index].id = value
    setValues(vals)
    if (props.setComposition) {
      props.setComposition(vals)
    }
  }

  const textChanged = (value, index) => {
    let vals = [...values]
    vals[index].value = value
    //vals[option].id = value
    setValues(vals)
    if (props.setComposition) {
      props.setComposition(vals)
    }
    //let s = e
  }

  useEffect(() => {
    
    if (!!props.composition) {
      let vals = []
      for(let i=0; i<5; i++) {
        vals.push( i < props.composition.length ?
             { id: props.composition[i].textileTypeId, value: props.composition[i].value } 
           : { id: null, value: null} )
      }
      setValues(vals)
    }

    getTextileTypes(setTextileTypes)
  }, [])
  
  return <Box 
            sx={{ 
              display: "grid",
              gridTemplateColumns: "1fr 90px",
              columnGap: "5px",
              rowGap: "5px",
              color: "#222", 
              fontFamily: ap.FONTFAMILY,
              fontSize: ap.FONTSIZE
              }}>
              <div style={{gridColumn: "span 2"}}><Header text="Composition" /></div>
              { values.map((data, index) => (  
              <React.Fragment>
                 <MySelect 
                    id={"comps-" + index}
                    url="TextileTypes"
                    title="Textile type"
                    valueName="value"
                    labelStyle={labelStyle}
                    //itemStyle={halfItemStyle}
                    MenuProps={MySelectProps}
                    valueVariable={values[index].id}
                    setValueFn={selectChanged}
                    data={textileTypes}
                    option={index}
                    //addNewFn={props.addNewFn}
                  />
                  <TextField
                    margin="normal"
                    size="small" 
                    id={"compv-" + index}
                    label="%"
                    name={"compv-" + index}
                    value={values[index].value}
                    sx = {{ m: 0 }}
                    onChange={ev => textChanged(ev.target.value, index)}
                  />
               </React.Fragment>  ))} 
        </Box>
         
}
