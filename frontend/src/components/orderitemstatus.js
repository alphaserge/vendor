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
    
    if (!!item.details  ) return "confirmed by vendor"
    if (!!item.delivered) return "delivered to client"
    if (!!item.shipped  ) return "shipping to client"
    //if (!!item.paidByClient    ) return "paid"
    //if (!!item.shippedToClient ) return "delivered"
    //if (!!item.inStock         ) return "in stock"
    return "waiting of vendor"
}

export default function OrderItemStatus(props) {

  const statusText = statusString(props.item)

  return <Box sx={{ ml: "2px",
    color: (props.color ? props : ap.PRICE.COLOR), 
    fontFamily: ap.PRICE.FONTFAMILY, 
    fontSize: ap.PRICE.FONTSIZE, 
    fontWeight: ap.PRICE.FONTWEIGHT }}>
      
    <Tooltip title={<span style={{ color: "#fff", fontSize: "13px", fontWeight: "300", padding: 0 }}>{statusText}</span>} >
          <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px", marginTop: "10px"}} >
          { statusText=="waiting of vendor"    && <QueryBuilderIcon  sx={{ color: "#888", fontSize: 30 }} /> } {/* waiting vendor */}
          { statusText=="confirmed by vendor"  && <HandshakeIcon     sx={{ color: "#393", fontSize: 30 }} /> } {/* vendor accepted  */}
          { statusText=="paid"       && <PaidIcon          sx={{ color: "#888", fontSize: 30 }} /> } {/* paid by client */}
          {/*{ statusText=="in stock"   && <ViewInArIcon      sx={{ color: "#888", fontSize: 30 }} /> }*/} {/* in stock */}
          { statusText=="shipping to client"   && <LocalShippingIcon sx={{ color: "#888", fontSize: 30 }} /> } {/* shipping */}
          { statusText=="delivered to client"  && <RecommendIcon     sx={{ color: "#888", fontSize: 30 }} /> } {/* waiting vendor */}
          </Box>
        </Tooltip>
          {/* <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px"}} >{statusText}</Box> */}
          {/* <EmojiPeopleIcon sx={{ color: "#888", fontSize: 26 }} />
          <DoneIcon sx={{ color: "#888", fontSize: 26 }} />
          <ThumbUpOffAltIcon sx={{ color: "#888", fontSize: 26 }} />
          <SentimentSatisfiedAltIcon sx={{ color: "#888", fontSize: 26 }} /> */}

      {/* <span style={{ color: "#444"}}>Price: </span> from $ {toFixed2(props.price)} per meter */}
      </Box>
}
