import React, { useState, useEffect } from "react";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Typography from '@mui/material/Typography';

import {APPEARANCE as ap} from '../appearance';

export default function CheckboxList(props) {
  const value = props.value ? props.value : [];
  const [checked, setChecked] = React.useState(value);
  const [selectedValue, setSelectedValue] = useState([])

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
    props.setValueFn(newChecked);
  };

   useEffect(() => {
      const value = props.value ? props.value : [];
      setChecked(value)
  }, [props.value]);

  /*const dataChange = (event) => {
    const { target: { value } } = event;

    setSelectedValue(value);
    props.setValueFn(value);
  };*/

  return (
    <Box className="underline" sx={{ width: "100%", paddingBottom: "10px", backgroundColor: "transparent", fontFamily: ap.FONTFAMILY }} >
    <Accordion className="header-menu" defaultExpanded={props.expanded? props.expanded : false} disableGutters sx={{ boxShadow: "none", backgroundColor: "transparent" }} >

    <AccordionSummary expandIcon={<ExpandMoreIcon sx={{margin: 0}} />} sx={{ maxWidth: "744px", margin: "0 auto !important", padding: "0 3px", flexDirection: "row-reverse" }} >
      <Typography sx={{ width: "100%", margin: 0, fontFamily: ap.FONTFAMILY, fontWeight: "600" }} className="subtitle-2" > &nbsp;&nbsp;{props.title}</Typography>
    </AccordionSummary>

    <AccordionDetails sx={{ maxWidth: "744px", margin: "0 auto", padding: "0 0px", overflowX: "hidden", overflowY: "auto"  }}>
    <List sx={{ width: '100%', maxWidth: 360, height: "auto" }}>  {/* height: props.height? props.height : 210  */}
      {props.list.map((item) => {
        const labelId = `checkbox-list-label-${item.key}`;

        return (
          <ListItem
            key={item.key}
            disablePadding
          >
            <ListItemButton role={undefined} onClick={handleToggle(item.key)} sx={{ padding: 0, margin: 0 }}>
              <ListItemIcon sx={{ padding: 0, margin: 0 }}>
                <Checkbox
                  edge="start"
                  checked={checked.includes(item.key)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ 'aria-labelledby': labelId }}
                  sx={{ padding: 0, margin: 0 }}
                  //onChange={dataChange}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={item.name} 
                className="list-item" 
                sx={{ padding: "2px 0px", margin: 0, fontFamily: ap.FONTFAMILY }}
                primaryTypographyProps={{fontFamily: ap.FONTFAMILY}} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
    </AccordionDetails>
    </Accordion>
    </Box>
  );
}