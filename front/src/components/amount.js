import React, { useState, useEffect, useRef } from "react";

import Box from '@mui/material/Box';

export default function Amount(props) {

  const [value, setValue] =  useState(props.value)
  const inputPadding = props.size && props.size=="small" ? "4px 6px" : "14px 12px";
  const arrowFontSize = props.size && props.size=="small" ? "14px" : "14px";
  const margin1 = props.size && props.size=="small" ? "3px 0 1px 0" : "0 0 1px 0"; 

  function inputChange(e) {
    //console.log(v);
    let value = parseInt(e.target.value)
    if ( value < 1 ) { value = 1 }
    props.setValue(value)
  }
  function buttonClick(incr) {
    //console.log(v);
    let value = props.value + incr
    if ( value < 1 ) { value = 1 }
    props.setValue(value)
  }

  return <Box sx={{display: "flex", flexDirection: "row", alignItems: "center", margin: "0 14px 0 0 ", padding: 0 }}> 
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
              value={props.value+""}
              onChange={inputChange}
              style={{
                fontFamily: "inherit",
                fontWeight: "400",
                lineHeight: 1.075,
                color: "#333",
                border: "1px solid #bbb",
                boxShadow: "0 2px 4px rgba(0,0,0, 0.05)" ,
                borderRadius: "0px",
                margin: "0 8px 0 2px",
                padding: (props.size && props.size=="small" ? "4px 6px" : "10px 12px"),
                outline: 0,
                minWidth: 0,
                width: "80px",
                textAlign: "center"
              }}
              /> 
            <Box sx={{display: "flex", flexDirection: "column", width: "32px", height: "38px", fontSize: "18px"}}> 
              {/* <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center", transform: "rotate(0.5turn)"}} >stat_minus_1</span>
              <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center" }} >stat_minus_1</span> */}
              <div 
                className="material-symbols-outlined" 
                onMouseDown={e => e.preventDefault()} 
                onClick={(e) => { buttonClick(1 )}} 
                style={{ 
                  padding: "2px 0", 
                  margin: margin1, 
                  fontSize: arrowFontSize, 
                  textAlign: "center", 
                  cursor: "pointer", 
                  transform: "rotate(0.5turn)"}}>stat_minus_1</div>
              <div 
                className="material-symbols-outlined" 
                onMouseDown={e => e.preventDefault()} 
                onClick={(e) => { buttonClick(-1)}} 
                style={{ 
                  padding: "2px 0", 
                  margin: "1px 0 0 0", 
                  fontSize: arrowFontSize, 
                  textAlign: "center", 
                  cursor: "pointer"}}>stat_minus_1</div>
              {/* &#0708; &#8743; */}
            </Box>
        </Box>
  
  // <NumberInput aria-label="Quantity Input" min={1} max={100000} step={props.step} onChange={props.onChange} defaultValue={props.defaultValue} />;
}
