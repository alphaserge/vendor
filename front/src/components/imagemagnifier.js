import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import { propsToClassKey } from '@mui/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import IconButton from '@mui/material/IconButton';

import React from 'react';
import InnerImageZoom from 'react-inner-image-zoom';
import '../css/InnerImageZoom/styles.css'; // Import the styles

import { Magnifier,
  GlassMagnifier,
  SideBySideMagnifier,
  PictureInPictureMagnifier,
  MOUSE_ACTIVATION,
  TOUCH_ACTIVATION } from 'react-image-magnifiers';

  const buttonSx = { 
    display: "block",
    zIndex: 13,
    width: "26px",
    height: "26px",
    position: "absolute",
    backgroundColor: "#ddd",
    color: "#222",
    fontSize: "14px",
    fontWeight: "600",
    left: "22px",
    cursor: "pointer",
    padding: 0,
    '&:hover': { backgroundColor: '#eee' }}

const fixUrl = (s) => {
    return s.replace(/\\/g, '/')
}

const ImageMagnifier = ({
    //src,
    images,
    labels,
    imageSelect,
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
    const [upDownVisible, setUpDownVisible] = useState(false)
    const [startImageIndex, setStartImageIndex] = useState(0)
    
    //const [colVarId, setColVarId] = useState(colorVarId)

    const thumbImageClick = (item, index) => {
        setImgSrc(fixUrl(item))
        if (!!imageSelect) {
            imageSelect(index);
        }
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

    const imagesUp = () => {
        if (startImageIndex > 0) {
            setStartImageIndex(startImageIndex-1)
        }
    }

    const imagesDown = () => {
        
        if (imags.length > startImageIndex + 5) {
            setStartImageIndex(startImageIndex+1)
        }
    }

    var fi = imags.map((item, index) => { return fixUrl(item.src) })

    if (colorVarId != -1 ) {
        fi = imags.filter((i)=> {return i.colorVar.colorVariantId==colorVarId}).map((item, index) => { return fixUrl(item.src) })
    }

    if (fi.length > 0 && !fi.includes(imgSrc)) {
        setImgSrc(fi[0])
    }

    const labs = []
    fi.forEach((e,i) => {
        if (!!labels && labels.length >= i+1) { labs.push(labels[i]) } 
        else { labs.push("")}
    });

    return <Box sx={{ width: width+100, height: height, display: "grid", gridTemplateColumns: "auto 90px", columnGap: "12px", overflowY: "hidden" }}>

    <GlassMagnifier
      imageSrc={imgSrc}
      largeImageSrc={imgSrc}
      magnifierSize={200}
      square={false} />

        <Box 
            className="animated-image-slider" sx={{display: "block", overflow: "hidden", flexDirection: "column", marginTop: (-80*(startImageIndex))+"px", position: "relative" }} 
            onMouseOver={()=> setUpDownVisible(true)} onMouseOut={()=> setUpDownVisible(false)} >
                    
             {/* <div style={{ marginBottom: "10px", position: "relative", width: "70px", height: "70px" }}> */}
                        {/* <div style={{display: "block", zIndex: 122, width: "26px", height: "26px", lineHeight: "26px", position: "absolute", backgroundColor: "#fff", color: "#222",
                            fontSize: "14px", fontWeight: "600", borderRadius: "16px",  top: "22px", left: "22px", textAlign: "center", cursor: "pointer" }}
                            onClick={(e) => {}}>^</div>     */}
                <IconButton aria-label="delete" size="small" onClick={imagesUp} sx={{ ...buttonSx, ...{ top: (startImageIndex*80+22)+"px", display: upDownVisible? "block":"none" } }}>
                    <KeyboardArrowUpIcon sx={{fontSize: 24}} />
                </IconButton>

                            {/* </div> */}

                 { fi.map((src, index) => { return <React.Fragment>
                    <div style={{ marginBottom: "10px", position: "relative", width: "70px", height: "70px", top: "0" }}>
                        <img
                            src={src}
                            style={{ display: "block", zIndex: 1, width: "100%", height: "100%", borderRadius: "0px", position: "absolute", top: "0", left: "0",
                                cursor: "pointer", backgroundColor: "#ccc", padding: "0px", borderRadius: "0px" }}
                            onClick={(e) => thumbImageClick(src, index)}
                        />
                        { !!labs[index] && <div style={{display: "block", zIndex: 12, width: "26px", height: "26px", lineHeight: "26px", position: "absolute", backgroundColor: "#fff", color: "#222",
                            fontSize: "14px", fontWeight: "600", borderRadius: "16px",  top: "22px", left: "22px", textAlign: "center", cursor: "pointer", opacity: 0.6 }}
                            onClick={(e) => thumbImageClick(src, index)}> {labs[index]} </div> }

                        { src==imgSrc && <div 
                                style={{display: "block", zIndex: 12, width: "10px", height: "10px", position: "absolute", backgroundColor: "#444", borderRadius: "5px", border: "2px solid #fff",  top: "4px", left: "4px", cursor: "pointer" }}
                                onClick={(e) => thumbImageClick(src, index)}>&nbsp;</div> }

                    </div>
                    </React.Fragment>
                } )  
            }
                <IconButton aria-label="delete" size="small" onClick={imagesDown} sx={{ ...buttonSx, ...{ top: (startImageIndex*80+height-58)+"px"}, display: upDownVisible? "block":"none"  }} >
                    <KeyboardArrowUpIcon sx={{fontSize: 24, transform: "rotate(180deg)"  }} />
                </IconButton>

        </Box>
        
    </Box>


};

export default ImageMagnifier;