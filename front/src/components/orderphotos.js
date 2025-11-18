import * as React from 'react';

import Box from '@mui/material/Box';

import config from "../config.json"
import zIndex from '@mui/material/styles/zIndex';

export default function OrderPhotos(props) {

var photos = props.photos
if (photos.length > 4) {
  photos.length = 4
}

const shift = 64 / photos.length

var shifts = photos.map((p,index) => index*shift)


console.log("props.photos:")
console.log(props.photos)

  return <Box sx={{position: "relative", overflow: "hidden", width: "64px", height: "60px"}}>
    { photos.map((path, index) => ( 
      <img 
         src={config.api + "/" + path}
          style={{ position: "absolute", top: "0px", left: shifts[index] }}
          width={64}
          height={54}
          alt={""}
      />
    )) }
  </Box>
         
}
