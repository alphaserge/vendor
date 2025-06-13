import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';

const fixUrl = (s) => {
    return s.replace(/\\/g, '/')
}

const ImageMagnifier = ({
    src,
    images,
    className,
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
    const [imgSrc, setImgSrc] = useState(fixUrl(src));

    const thumbImageClick = (e) => {
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
        /*console.log('imgSrc:')
        console.log(imgSrc)
        console.log(src)
        setImgSrc(src.replace(/\\/g, '/'))
        console.log(imgSrc)
        console.log('----')*/
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


    // useEffect(() => {
    //   setImgSrc(src)
    // }, [src]);


    return <div className="relative inline-block">
        <img
            src={imgSrc}
            className={className}
            // width={width}
            // height={height}
            style={{maxWidth: "360px"}}
            alt={alt}
            onMouseEnter={(e) => mouseEnter(e)}
            onMouseLeave={(e) => mouseLeave(e)}
            onMouseMove={(e) => mouseMove(e)}
        />
        <div
            style={{
                display: showMagnifier ? '' : 'none',
                position: 'absolute',
                left: `${magnifierLeft}px`,
                top: `${magnifierTop}px`,
                pointerEvents: 'none',
                height: `${magnifierHeight}px`,
                width: `${magnifierWidth}px`,
                //width:  "800px",
                //height: "600px",
                opacity: '1',
                border: '1px solid lightgrey',
                backgroundColor: 'white',
                borderRadius: '5px',
                backgroundImage: `url('${imgSrc}')`,
                backgroundRepeat: 'no-repeat',
                // top: `${y - magnifierHeight / 2}px`,
                // left: `${x - magnifierWidth / 2}px`,
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${bgPosX}px`,
                backgroundPositionY: `${bgPosY}px`,
                //backgroundPositionX: `${-x * zoomLevel + magnifierWidth/2}px`,

                //backgroundPositionX: `${(1-zoomLevel)*x +kx*magnifierWidth}px`,
                //backgroundPositionY: `${(1-zoomLevel)*y +ky*magnifierHeight}px`,

                //backgroundPositionY: `${-y * zoomLevel + magnifierHeight/2}px`,
            }}
        />
        <Box sx={{display: "flex", marginTop: "10px"}}>
            { 
                images.map((item, index) => { return (
                <img
                    src={item.src}
                    style={{width: "50px", height: "50px", marginRight: "10px", borderRadius: "6px", cursor: "pointer"}}
                    //alt={alt}
                    onClick={(e) => thumbImageClick(e)}
                    />) } ) 
            }
        </Box>



{/* <div
            style={{
                display: showMagnifier ? '' : 'none',
                position: 'absolute',
                pointerEvents: 'none',
                height: `${magnifierHeight}px`,
                width: `${magnifierWidth}px`,
                opacity: '1',
                border: '1px solid lightgrey',
                backgroundColor: 'white',
                borderRadius: '5px',
                backgroundImage: `url('${src}')`,
                backgroundRepeat: 'no-repeat',
                top: `${y - magnifierHeight / 2}px`,
                left: `${x - magnifierWidth / 2}px`,
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${-x * zoomLevel + magnifierWidth / 2}px`,
                backgroundPositionY: `${-y * zoomLevel + magnifierHeight / 2}px`,
            }}
        /> */}

    </div>



};

export default ImageMagnifier;