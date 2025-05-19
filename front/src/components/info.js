import React, { useState, useEffect, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import { Button } from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

const Info = React.forwardRef((props, ref) => {

  //const [show, setShow] = React.useState(false);
  const textStyle = { m: 0, mb: 2 }

  const modalSx = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "800px",
      boxShadow: 24,
      padding: "20px 40px 40px 40px", 
      outline: "none",
      bgcolor: 'background.paper',
    }

  /*useImperativeHandle(ref, () => ({
    displayWindow(show) {
      displayWindow(show)
    }
  }))

  const displayWindow = (show) => {
    setShow(show);
  }*/

return <>
      {/* Show info modal */}
      <Modal
        open={true}
        // onClose={function() { setShow(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto", outline: "none" }} >

        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "330px",
          boxShadow: 24,
          padding: "45px 40px 40px 40px",
          outline: "none",
          bgcolor: 'background.paper',
           }}>
          
        {/* <Typography>Modal title</Typography> */}
        <Box sx={{ width: "100%", textAlign:"right", pr: 3, pb: 2 }} >
        <IconButton
           sx={{ position: "absolute", top: 6, mr: 0 }}
           onClick={() => { props.close(); /*setShow(false)*/ }}>
            <CloseIcon />
        </IconButton>
        </Box>
        <Typography sx={{fontSize: "16px", color: "#333" , textAlign: "center" }}>{props.message}</Typography>
        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "center", pt: 3}}>
        <Button
            variant="contained"
            onClick={(e) => { props.close(); /*setShow(false)*/ }} >
                Close
        </Button>
        </Box>
        </Box>
      </Modal>
</>
})

export default Info;
