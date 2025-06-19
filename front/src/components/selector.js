import React, { useState, useEffect, useRef } from "react";

import Box from '@mui/material/Box';

import { APPEARANCE as ap } from "../appearance"

export default function Selector(props) {

  const [index, setIndex] =  useState(0)

  function buttonClick(incr) {
    let ix = index + incr
    if ( ix < 0 ) { ix = props.list.length-1 }
    if ( ix > props.list.length-1 ) { ix = 0 }
    setIndex(ix)
    if (props.setValue) {
      props.setValue(props.list[ix])
    }
  }

  return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", fontFamily: ap.FONTFAMILY, fontSize: ap.FONTSIZE, margin: "0 14px 0 0 ", padding: 0 }}> 
  {(props.label && <Box style={{
                fontSize: "inherit",
                fontFamily: "inherit",
                fontWeight: "400",
                lineHeight: 1.375,
                color: "#333",
                margin: "0 8px 0 0",
                padding: "0px 0px",
                outline: 0,
                minWidth: 0,
                width: props.labelWidth ? props.labelWidth : "4rem",
                textAlign: "center"
              }}>{props.label}:</Box>)}
            <input
              type="text"
              pattern="(?:0|[1-9]\d*)"
              inputMode="decimal"
              autoComplete="off"
              value={props.list[index]}
              readOnly={true}              
              style={{
                fontSize: ap.FONTSIZE,
                fontFamily: "inherit",
                fontWeight: "400",
                lineHeight: 1.075,
                color: "#333",
                border: "1px solid #bbb",
                boxShadow: "0 2px 4px rgba(0,0,0, 0.05)" ,
                borderRadius: "0px",
                margin: "0 8px",
                padding: "14px 12px",
                outline: 0,
                minWidth: 0,
                width: "80px",
                textAlign: "center"
              }}
              /> 
            <Box sx={{display: "flex", flexDirection: "column", width: "32px", height: "46px", fontSize: "18px"}}> 
              {/* <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center", transform: "rotate(0.5turn)"}} >stat_minus_1</span>
              <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center" }} >stat_minus_1</span> */}
              <div class="material-symbols-outlined" onMouseDown={e => e.preventDefault()} onClick={(e) => { buttonClick(1 )}} style={{ padding: "2px 0", margin: "0 0 1px 0", fontSize: "18px", textAlign: "center", cursor: "pointer", transform: "rotate(0.5turn)"}}>stat_minus_1</div>
              <div class="material-symbols-outlined" onMouseDown={e => e.preventDefault()} onClick={(e) => { buttonClick(-1)}} style={{ padding: "2px 0", margin: "1px 0 0 0", fontSize: "18px", textAlign: "center",  cursor: "pointer"}}>stat_minus_1</div>
              {/* &#0708; &#8743; */}
            </Box>
        </Box>
  
  // <NumberInput aria-label="Quantity Input" min={1} max={100000} step={props.step} onChange={props.onChange} defaultValue={props.defaultValue} />;
}
