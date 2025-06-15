import React from 'react';
import ImageMagnifier from './ImageMagnifier';

const App = () => {
    return (
        <div>
            <ImageMagnifier 
                src="../images/demo-img.jpg"
                width={200}
                height={200}
                magnifierHeight={400}
                magnifierWidth={800}
                zoomLevel={6}
                alt="Sample Image"
            />
        </div>
    );
};

export default App;