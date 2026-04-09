import React, { useState, useEffect } from "react";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';
import Modal from '@mui/material/Modal';
import { IconButton } from "@mui/material";
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';

const itemStyle1 = { width: "calc( 100% - 0px )", mt: "0 !important", ml: 0, mr: 0, mb: "0 !important" }
const buttonStyle = { mt: "auto", ml: "3px", mr: 0, mb: "auto", pt: 0, pl: 0, pr: 0, pb: 0, height: "26px", width: "36px", color: "#fff", backgroundColor: "#242a35", border: "solid 1px #e8e8e82d", borderRadius: "4px" }

export default function MySelect(props) {

    const [newValue, setNewValue] = useState(null)
    const [openNew, setOpenNew] = useState(false)
    const theme = useTheme();

    const dataChange = (event, i) => {
        const { target: { id, value } } = event;

        // processing of 'ALL' (-1) item (select all items)
        if (Array.isArray(value) && value.indexOf(-1) != -1) {
          let all = props.data.map(x => x.id).filter(x => x > -1)
          props.setValue(all)
          return
        }

        if (Array.isArray(value) && value && value.indexOf(-2) != -1) {
          setOpenNew(true)
          return
        }

        if (!Array.isArray(value) && value == -2) {
          setOpenNew(true)
          return
        }

        props.setValue(value);
      };

    useEffect(() => {
      var a = 0;
    }, []);
  
return (
  <>
  <Modal
    open={openNew}
    onClose={function() { setOpenNew(false) }}
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
        padding: "25px",
        outline: "none",
        bgcolor: 'background.paper',
        display: "flex",
        flexDirection: "column"
        }}>
        <Typography sx={{ fontSize: "13px", fontWeight: "400" }}>New value:</Typography>
        <Box sx={{ display: "flex" }}>
        <TextField
            margin="normal"
            size="small" 
            id="addnewvalue"
            name="addnewvalue"
            sx = {{ my: 2 }}
            value={newValue}
            onChange={ev => setNewValue(ev.target.value)}
        />
        <IconButton sx={ buttonStyle } onClick={ () => { 
            if (props.addNewValue) {
                props.addNewValue(newValue)
            }
            setOpenNew(false) }} 
          >
          <DoneIcon />
        </IconButton>
        <IconButton sx={ buttonStyle } onClick={ () => { setOpenNew(false) }} >
          <CloseIcon />
        </IconButton>
        </Box>
    </Box>
  </Modal>

  <FormControl error={ false } required sx={{ ...props.itemStyle,  ...{width: "100%", display: "flex" } }} > 
    {!props.hideLabel && <InputLabel 
        id={props.id + "-label"}
        size="small" 
        sx={props.labelStyle} >
        {props.title}
    </InputLabel>}
    <Select
        labelId={props.id + "-label"}
        id={props.id}
        size="small" 
        label={props.title}
        multiple = {Array.isArray(props.value)}
        disabled={props.disabled ? props.disabled : false}
        value={ !!props.value ? props.value : "" }
        sx = {{ height: "37px", padding: "0", margin: "0" }}
        onChange={dataChange}
        MenuProps={props.MenuProps} >

    { props.values && props.values.map((value, index) => (
        <MenuItem sx = {!!props.keys && props.keys[index] == -2 ? { fontWeight: 600 } : {}}
            key={!!props.key ? props.key+'_'+index : "key_"+index} 
            value={!!props.keys ? props.keys[index] : value} > 
                 {value}
        </MenuItem>
    ))}
    </Select>
    
  </FormControl>
  </>
);
}
