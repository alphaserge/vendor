import * as React from 'react';

import Box from '@mui/material/Box';

import config from "../config.json"

export default function OrderPhotos(props) {

var photos = props.photos
if (photos.length > 3) {
  photos.length = 3
}

const shift = 64 / photos.length

var shifts = photos.map((p,index) => index*shift)


console.log("props.photos:")
console.log(props.photos)

  return <Box sx={{display: "flex"}}>
    { photos.map((path, index) => ( 
      <img 
          src={config.api + "/" + path}
          sx={{padding: "0 10px"}}
          marginLeft={shifts[index]+ "px"}
          width={64}
          height={54}
          alt={""}
      />
    )) }
  </Box>
         
}
