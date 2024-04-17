import React from 'react';
import { CircularProgress, Backdrop  } from '@mui/material';
import { theme } from '../theme';



const CustomCircularPogress = () => {

    return (
        <div>
            {/* Your main content goes here */}

            {/* Blurred background */}
            <Backdrop open={true}>
                {/* Circular Progress */}
                <CircularProgress color="inherit" />
            </Backdrop>
        </div>
    );
};

export default CustomCircularPogress;
