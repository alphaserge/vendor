import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { propsToClassKey } from '@mui/styles';

import React from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import '../css/InnerImageZoom/styles.css'; // Import the styles

import { Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION } from 'react-image-magnifiers';



const fixUrl = (s) => {
    return s.replace(/\\/g, '/')
}

const ImageMagnifier = ({
    //src,
    images,
    className,
    colorVarId,
    width,
    height,
    alt,
    magnifierHeight = 100,
    magnifierWidth = 100,
    zoomLevel = 3
}) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [[bgPosX, bgPosY], setBgPos] = useState([0, 0]);
    const [magnifierTop, setMagnifierTop] = useState(0);
    const [magnifierLeft, setMagnifierLeft] = useState(0);
    const [imgSrc, setImgSrc] = useState(fixUrl(images[0].src));
    const [imags, setImags] = useState(images)
    //const [colVarId, setColVarId] = useState(colorVarId)

    const thumbImageClick = (e, item) => {
        const el = e.currentTarget;
        setImgSrc(fixUrl(el.src))
    }

    const mouseEnter = (e) => {
        const el = e.currentTarget;
        const { top, left } = el.getBoundingClientRect();
        const { width, height } = el.getBoundingClientRect();
        
        setSize([width, height]);
        setShowMagnifier(true);
        setMagnifierTop(top)
        setMagnifierLeft(left + width + 10)
    }

    const mouseLeave = (e) => {
        e.preventDefault();
        setShowMagnifier(false);
    }

    const mouseMove = (e) => {
        const el = e.currentTarget;
        const { top, left } = el.getBoundingClientRect();
        const { width, height } = el.getBoundingClientRect();

        /* local cursor coordinates in img */
        let x = e.pageX - left - window.scrollX;
        let y = e.pageY - top - window.scrollY;

        let x1 = x - magnifierWidth/(2*zoomLevel);
        let bg_x = -x1*zoomLevel > 0 ? 0 : -x1*zoomLevel;
        if (bg_x < -width*zoomLevel + magnifierWidth) {
            bg_x = -width*zoomLevel + magnifierWidth;
        }
        let y1 = y - magnifierHeight/(2*zoomLevel);
        let bg_y = -y1*zoomLevel > 0 ? 0 : -y1*zoomLevel;
        if (bg_y < -height*zoomLevel + magnifierHeight) {
            bg_y = -height*zoomLevel + magnifierHeight;
        }
 
        setBgPos([bg_x, bg_y]);
  };

    var fi = imags.map((item, index) => { return fixUrl(item.src) })
    if (colorVarId != -1 ) {
        fi = imags.filter((i)=> {return i.colorVar.colorVariantId==colorVarId}).map((item, index) => { return fixUrl(item.src) })
    }

    if (fi.length > 0 && !fi.includes(imgSrc)) {
        setImgSrc(fi[0])
    }
     /*useEffect(() => {
       const f = images;// images.filter((i)=>{return i.colorVariantId == colVarId})
       setImags(f)
       setImgSrc(f.length ? f[0].src : "-1-")
     }, [colVarId]);*/

    return <Box sx={{ width: width, height: height+80, display: "flex", flexDirection: "row" }}>
        <Box sx={{display: "flex", flexDirection: "column", float: "left" }}>

<GlassMagnifier
      imageSrc={imgSrc}
      largeImageSrc={imgSrc} // Optional
      magnifierSize={200}
      square={false} // Creates a circular magnifier
      //mouseActivation={MOUSE_ACTIVATION.DOUBLE_CLICK} // Optional
      //touchActivation={TOUCH_ACTIVATION.DOUBLE_TAP} // Optional
    />

    {/* <InnerImageZoom
      src={imgSrc}
      width={width}
      height={height}
      zoomSrc={imgSrc} // Optional: A higher resolution image for the zoom
      zoomScale={2.0} // Optional: Magnification level
    /> */}
        <Box sx={{display: "flex", flexDirection: "row", marginTop: "10px", marginLeft: "15px" }}>
            { 
                fi.map((item, index) => { return (
                <img
                    src={item}
                    style={{width: "50px", height: "50px", marginRight: "9px", borderRadius: "0px", cursor: "pointer", backgroundColor: "#ccc", padding: "1px"}}
                    //alt={alt}
                    onClick={(e) => thumbImageClick(e,item)}
                    />) } ) 
            }
        </Box>
        </Box>
    </Box>


};

export default ImageMagnifier;