import { useState } from 'react';

const ImageMagnifier = ({
    src,
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
    const [[x, y], setXY] = useState([0, 0]);
    const [[kx, ky], setKXY] = useState([1, 1]);
    const [[bgx, bgy], setBGXY] = useState([0, 0]);

    const mouseEnter = (e) => {
        const el = e.currentTarget;

        const { width, height } = el.getBoundingClientRect();
        setSize([width, height]);
        setShowMagnifier(true);
    }

    const mouseLeave = (e) => {
        e.preventDefault();
        setShowMagnifier(false);
    }

    const mouseMove = (e) => {
        const el = e.currentTarget;
        const { top, left } = el.getBoundingClientRect();
        const { width, height } = el.getBoundingClientRect();

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

        /*if (bg_x < -width*zoomLevel) {
            bg_x = -width*zoomLevel
        }

        let magx = zoomLevel*width/magnifierWidth;
        let magy = zoomLevel*height/magnifierHeight;
        let mw = magnifierWidth;
        let mh = magnifierHeight;*/

        /*if (x < mw/magx) {
            x = mw/magx
        }
        if (x > width-mw/magx) {
            x = width-mw/magx
        }
        if (y < mh/magy) {
            y = mh/magy
        }
        if (y > height-mh/magy) {
            y = height-mh/magy
        }*/

        //let bg_x = mw/2 - x*magx;
        //let bg_y = mh/2 - y*magy;

        setBGXY([bg_x, bg_y]);

        console.log( 'x:' + x + '  x1:' + x1 + '  bgx:' + bg_x + '  bgy:' + bg_y)

        /*setXY([x, y]);
        let xx = x - magnifierWidth/(2*zoomLevel);
        let yy = y - magnifierHeight/(2*zoomLevel);
        if (xx < magnifierWidth/(2*zoomLevel)) {
            xx = magnifierWidth/(2*zoomLevel);
        }
        if (xx > width - magnifierWidth/(2*zoomLevel)) {
            xx = width - magnifierWidth/(2*zoomLevel);
        }
        if (yy < magnifierHeight/(2*zoomLevel)) {
            yy = magnifierHeight/(2*zoomLevel);
        }
        if (yy > height - magnifierHeight/(2*zoomLevel)) {
            yy = height - magnifierHeight/(2*zoomLevel);
        }
        let xxx = xx*zoomLevel; 
        let yyy = yy*zoomLevel;

        let xxxx = magnifierWidth/2 - xxx;
        let yyyy = magnifierHeight/2 - yyy;

        if (xxxx < -width*zoomLevel + magnifierWidth) {
            xxxx = -width*zoomLevel + magnifierWidth
        }

        setBGXY([xxxx, yyyy]);*/
        //setKXY([width/magnifierWidth, height/magnifierHeight])

        //console.log( 'width:' + width + ' magnifierWidth' + magnifierWidth + '   zoomLevel: ' +  zoomLevel +  ' xxxx yyyy: ' + xxxx + ' ' + yyyy)
    };

    return <div className="relative inline-block">
        <img
            src={src}
            className={className}
            // width={width}
            // height={height}
            style={{maxWidth: "200px"}}
            alt={alt}
            onMouseEnter={(e) => mouseEnter(e)}
            onMouseLeave={(e) => mouseLeave(e)}
            onMouseMove={(e) => mouseMove(e)}
        />
        <div
            style={{
                display: showMagnifier ? '' : 'none',
                position: 'relative',
                pointerEvents: 'none',
                height: `${magnifierHeight}px`,
                width: `${magnifierWidth}px`,
                //width:  "800px",
                //height: "600px",
                opacity: '1',
                border: '1px solid lightgrey',
                backgroundColor: 'white',
                borderRadius: '5px',
                backgroundImage: `url('${src}')`,
                backgroundRepeat: 'no-repeat',
                // top: `${y - magnifierHeight / 2}px`,
                // left: `${x - magnifierWidth / 2}px`,
                backgroundSize: `${imgWidth * zoomLevel}px ${imgHeight * zoomLevel}px`,
                backgroundPositionX: `${bgx}px`,
                backgroundPositionY: `${bgy}px`,
                //backgroundPositionX: `${-x * zoomLevel + magnifierWidth/2}px`,

                //backgroundPositionX: `${(1-zoomLevel)*x +kx*magnifierWidth}px`,
                //backgroundPositionY: `${(1-zoomLevel)*y +ky*magnifierHeight}px`,

                //backgroundPositionY: `${-y * zoomLevel + magnifierHeight/2}px`,
            }}
        />


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