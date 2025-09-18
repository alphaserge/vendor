import * as React from 'react';
import Box from '@mui/material/Box';

import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PaidIcon from '@mui/icons-material/Paid';
import DoneIcon from '@mui/icons-material/Done';
import RecommendIcon from '@mui/icons-material/Recommend';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ViewInArIcon from '@mui/icons-material/ViewInAr';
import Tooltip from '@mui/material/Tooltip';

import {APPEARANCE as ap} from "../appearance"
import {toFixed2} from "../functions/helper"

const statusString = (item) => {
    
    if (!!item.delivered) return "delivered"
    if (!!item.deliveryNo && !!item.deliveryCompany) return "shipping"
    if (!!item.paid     ) return "paid"
    if (!!item.details  ) return "confirmed"
    //if (!!item.shippedToClient ) return "delivered"
    //if (!!item.inStock         ) return "in stock"
    return "processing"
}


export default function OrderItemStatus(props) {

  const statusText = statusString(props.item)

  let color = "#222";

  if (statusText=="waiting of vendor") {  color = "#d70c32ff"}
  if (statusText=="confirmed by vendor") {  color = "#3256f4ff"}
  if (statusText=="paid") {  color = "#01801aff"}
  if (statusText=="in stock") {  color = "#135ce4ff"}
  if (statusText=="shipping to client") {  color = "#00a2ffff"}
  if (statusText=="delivered to client") {  color = "#286d2cff"}

  return <div style={{display: "inline-block"}}>
          <span>Status:</span>&nbsp;<span className="my-val" style={{ color: color, backgroundColor: "#ddd", fontWeight: "400", minWidth: "20px", borderRadius: "3px", padding: "0px 7px" }}>{statusText}</span>&nbsp;&nbsp;&nbsp;
         </div>
      // Status:<span style={{ color : color}}>{statusText}</span>
      
    {/* <Tooltip title={<span style={{ color: "#fff", fontSize: "13px", fontWeight: "300", padding: 0 }}>{statusText}</span>} >
          <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px", marginTop: "10px"}} >
          { statusText=="waiting of vendor"    && <QueryBuilderIcon  sx={{ color: "#888", fontSize: 30 }} /> }
          { statusText=="confirmed by vendor"  && <HandshakeIcon     sx={{ color: "#393", fontSize: 30 }} /> }
          { statusText=="paid"       && <PaidIcon          sx={{ color: "#888", fontSize: 30 }} /> }
          { statusText=="in stock"   && <ViewInArIcon      sx={{ color: "#888", fontSize: 30 }} /> }
          { statusText=="shipping to client"   && <LocalShippingIcon sx={{ color: "#888", fontSize: 30 }} /> } 
          { statusText=="delivered to client"  && <RecommendIcon     sx={{ color: "#888", fontSize: 30 }} /> } 
          </Box>
        </Tooltip> */}
          {/* <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px"}} >{statusText}</Box> */}
          {/* <EmojiPeopleIcon sx={{ color: "#888", fontSize: 26 }} />
          <DoneIcon sx={{ color: "#888", fontSize: 26 }} />
          <ThumbUpOffAltIcon sx={{ color: "#888", fontSize: 26 }} />
          <SentimentSatisfiedAltIcon sx={{ color: "#888", fontSize: 26 }} /> */}

      {/* <span style={{ color: "#444"}}>Price: </span> from $ {toFixed2(props.price)} per meter */}
      
}
