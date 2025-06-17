import * as React from 'react';

import Box from '@mui/material/Box';

export default function Amount(props) {
  return <Box sx={{display: "flex", flexDirection: "row"}}> 
            <input
              type="text"
              pattern="(?:0|[1-9]\d*)"
              width="10px"
              inputMode="decimal"
              autoComplete="off"
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
                padding: "10px 12px",
                outline: 0,
                minWidth: 0,
                width: "4rem",
                textAlign: "center"
              }}
              /> 
            <Box sx={{display: "flex", flexDirection: "column", width: "32px", height: "16px", fontSize: "18px"}}> 
              {/* <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center", transform: "rotate(0.5turn)"}} >stat_minus_1</span>
              <span class="material-symbols-outlined" style={{fontSize: "18px", textAlign: "center" }} >stat_minus_1</span> */}
              <div class="material-symbols-outlined" style={{ backgroundColor: "#eee", margin: "3px", fontSize: "18px", textAlign: "center", transform: "rotate(0.5turn)"}}>stat_minus_1</div>
              <div class="material-symbols-outlined" style={{ backgroundColor: "#eee", margin: "3px", fontSize: "18px", textAlign: "center"}}>stat_minus_1</div>
              {/* &#0708; &#8743; */}
            </Box>
        </Box>
  
  // <NumberInput aria-label="Quantity Input" min={1} max={100000} step={props.step} onChange={props.onChange} defaultValue={props.defaultValue} />;
}
