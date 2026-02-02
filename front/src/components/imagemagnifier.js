import { useState, useEffect, forwardRef, useRef, useImperativeHandle } from 'react';
import Box from '@mui/material/Box';
import { propsToClassKey } from '@mui/styles';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpward from '@mui/icons-material/ArrowUpward';

import IconButton from '@mui/material/IconButton';
import CardMedia from '@mui/material/CardMedia';

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
    backgroundColor: "#fff",
    color: "#777",
    fontSize: "14px",
    fontWeight: "600",
    left: "22px",
    cursor: "pointer",
    padding: 0,
    '&:hover': { backgroundColor: '#eee' }}

const fixUrl = (s) => {
    return s.replace(/\\/g, '/')
}

const ImageMagnifier = forwardRef(({
    images = [],
    imageSelect = null,
    width = 400,
    height = 400,
    zoomLevel = 3,
    highlightColor = ""
}, ref) => {
    const [showMagnifier, setShowMagnifier] = useState(false);
    const [[imgWidth, imgHeight], setSize] = useState([0, 0]);
    const [[bgPosX, bgPosY], setBgPos] = useState([0, 0]);
    const [magnifierTop, setMagnifierTop] = useState(0);
    const [magnifierLeft, setMagnifierLeft] = useState(0);
    const [imgSrc, setImgSrc] = useState(fixUrl(images[0].src));
    const [imags, setImags] = useState(images)
    const [video, setVideo] = useState(false)
    const [upDownVisible, setUpDownVisible] = useState(false)
    const [startImageIndex, setStartImageIndex] = useState(0)
    
    //const [colVarId, setColVarId] = useState(colorVarId)

    useImperativeHandle(ref, () => ({
        
        getAlert(colorNo) {
            const img = imags.find(e => e.colorVar.colorNo==colorNo)
            if (!!img) {
                setImgSrc(fixUrl(img.src))
                //alert(img.src)
            }
        }
    }));

    const thumbImageClick = (item, index) => {
        setVideo(item.isVideo)
        setImgSrc(fixUrl(item.src))
        if (!!imageSelect) {
            //const item1 = { ...item, imagePath: item.src }
            imageSelect(item, index);
        }
    }

    const imagesUp = () => {
        if (startImageIndex > 0) {
            setStartImageIndex(startImageIndex-1)
        }
    }

    const imagesDown = () => {
        
        if (imags.length > startImageIndex + 6) {
            setStartImageIndex(startImageIndex+1)
        }
    }

    var fi = imags.map((item, index) => { return {...item, src: fixUrl(item.src) }})

    if (fi.length > 0 && !fi.map(e => e.src).includes(imgSrc)) {
        setImgSrc(fi[0].src)
    }

    const labs = []
    fi.forEach((e,i) => {

        if (!!imags && imags.length >= i+1) { labs.push(imags[i].label) } 
        else { labs.push("")}
    });

    console.log('fi:')
    console.log(fi)

    return <Box sx={{ width: width+120, height: height, display: "grid", gridTemplateColumns: "auto 115px", columnGap: "12px", overflowY: "hidden" }} key="kk1">

    { !video && <GlassMagnifier
      imageSrc={imgSrc}
      largeImageSrc={imgSrc}
      magnifierSize={200}
      square={false} /> }

      { video && <CardMedia 
        component={"video"}
        autoPlay={"autoplay"}
        muted
        key={"card-video"} 
        src={imgSrc} 
        alt={"Product video"} 
        sx={{ display: "block", width: "100%", height: "100%", cursor: "pointer" }} /> }

        <Box className="animated-image-slider" sx={{display: "block", overflow: "hidden", flexDirection: "column", marginTop: (-80*(startImageIndex))+"px", position: "relative" }} 
            onMouseOver={()=> setUpDownVisible(true)} onMouseOut={()=> setUpDownVisible(false)} >
                    
            {/* <div style={{ marginBottom: "10px", position: "relative", width: "70px", height: "70px" }}> */}
                        {/* <div style={{display: "block", zIndex: 122, width: "26px", height: "26px", lineHeight: "26px", position: "absolute", backgroundColor: "#fff", color: "#222",
                            fontSize: "14px", fontWeight: "600", borderRadius: "16px",  top: "22px", left: "22px", textAlign: "center", cursor: "pointer" }}
                            onClick={(e) => {}}>^</div>     */}
                <IconButton aria-label="delete" size="small" onClick={imagesUp} sx={{ ...buttonSx, ...{ left: "17px", top: (startImageIndex*80+18)+"px", display: upDownVisible? "block":"none", width: "36px",  height: "36px"} }} >
                    <ArrowUpward sx={{fontSize: 24}} />
                </IconButton>

                            {/* </div> */}

                 { fi.map((it, index) => { return <React.Fragment key = {"kfi"+index}>
                    <div style={{ marginBottom: "8px", position: "relative", width: "132px", height: "71px", top: "0", display: "flex" }} onClick={(e) => thumbImageClick(it, index)} >

                            { it.isVideo && <CardMedia 
                            component={"video"}
                            autoPlay={"autoplay"}
                            muted
                            key={"card-video"} 
                            src={it.src} 
                            alt={"Product video"} 
                            sx={{ display: "block", width: "70px", height: "100%", cursor: "pointer" }}
                            /> }

                        
                        { !it.isVideo && <img 
                            src={it.src}
                            style={{ display: "block", width: "70px", height: "100%", cursor: "pointer" }}
                        /> }

                        { true && !!labs[index] && <div style={{width: "28px", height: "28px",  backgroundColor: imgSrc==it.src?"#444":"#ccc", color: "#fff", 
                            border: "2px solid #ccc",  marginTop: "22px", marginLeft: "8px", border: "none", lineHeight: "26px",
                            fontSize: "14px", fontWeight: "400", borderRadius: "14px", textAlign: "center", cursor: "pointer"}}
                            > {labs[index]} </div> }

                        { false && labs[index] && <div style={{width: "28px", height: "28px",  color:imgSrc==it.src?"#fff": "#222", backgroundColor: imgSrc==it.src?"#444":"#fff",
                            border: "none", border: imgSrc==it.src? "2px solid #555":"1px solid #555", marginTop: "19px", marginLeft: "11px", lineHeight: imgSrc==it.src?"22px": "24px",
                            fontSize: "14px", fontWeight: "400", borderRadius: "16px", textAlign: "center", cursor: "pointer"}}
                            > {labs[index]} </div> }    

                        {/* { src==imgSrc && <div 
                                style={{display: "block", zIndex: 12, width: "10px", height: "10px", position: "absolute", backgroundColor: "#222", borderRadius: "5px", border: "3px solid #fff",  top: "4px", left: "56px", cursor: "pointer" }}
                                onClick={(e) => thumbImageClick(src, index)}>&nbsp;</div> } */}

                    </div>
                    </React.Fragment>
                } )  
            }
                <IconButton aria-label="delete" size="small" onClick={imagesDown} sx={{ ...buttonSx, ...{ left: "17px", top: (startImageIndex*80+height-55)+"px"}, display: upDownVisible? "block":"none", width: "36px",  height: "36px" }} >
                    <ArrowUpward sx={{fontSize: 24, transform: "rotate(180deg)"  }} />
                </IconButton>

        </Box>
        
    </Box>


});

export default ImageMagnifier;