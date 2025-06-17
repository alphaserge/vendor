import React, { useState, useEffect, useRef } from "react";

import Box from '@mui/material/Box';

export default function Amount(props) {

  const [value, setValue] =  useState(props.value)

  function buttonClick(incr) {
    //console.log(v);
    let value = props.value + incr
    if ( value < 1 ) { value = 1 }
    props.setValue(value)
  }

  return <Box sx={{display: "flex", flexDirection: "row"}}> 
            <input
              type="text"
              pattern="(?:0|[1-9]\d*)"
              width="10px"
              inputMode="decimal"
              autoComplete="off"
              value={props.value+""}
              style={{
                fontSize: "0.875rem",
                fontFamily: "inherit",
                fontWeight: "400",
                lineHeight: 1.375,
                color: "#333",
                border: "1px solid #ddd",
                boxShadow: "0 2px 4px rgba(0,0,0, 0.05)" ,
                borderRadius: "0px",
                margin: "0 8px",
                padding: "14px 12px",
                outline: 0,
                minWidth: 0,
                width: "4rem",
                textAlign: "center"
              }}
              /> 
            <Box sx={{display: "flex", flexDirection: "column", width: "32px", height: "16px", fontSize: "18px"}}> 
              {/* <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center", transform: "rotate(0.5turn)"}} >stat_minus_1</span>
              <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center" }} >stat_minus_1</span> */}
              <div class="material-symbols-outlined" onMouseDown={e => e.preventDefault()} onClick={(e) => { buttonClick(1 )}} style={{ padding: "2px 0", margin: "0 0 1px 0", fontSize: "18px", textAlign: "center", cursor: "pointer", transform: "rotate(0.5turn)"}}>stat_minus_1</div>
              <div class="material-symbols-outlined" onMouseDown={e => e.preventDefault()} onClick={(e) => { buttonClick(-1)}} style={{ padding: "2px 0", margin: "1px 0 0 0", fontSize: "18px", textAlign: "center",  cursor: "pointer"}}>stat_minus_1</div>
              {/* &#0708; &#8743; */}
            </Box>
        </Box>
  
  // <NumberInput aria-label="Quantity Input" min={1} max={100000} step={props.step} onChange={props.onChange} defaultValue={props.defaultValue} />;
}
