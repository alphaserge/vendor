import React, { useState, useEffect } from "react";
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { Icon } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

import { APPEARANCE } from '../../appearance';
import { Height } from "@mui/icons-material";

const findBoxStyle = { width: "calc(100% - 80px)", border: "none" }
const findTextStyle = { width: "100%", borderRadius : "8px", border: "2px solid #18515e" }

function FabricIcon(props) {
  return (
  <Icon src="./pag">
  </Icon>
  );
  }

export default function MainSection(props) {

  const [search, setSearch] = useState("")

  const styles = theme => ({
    textField: {
        width: '90%',
        marginLeft: 'auto',
        marginRight: 'auto',            
        paddingBottom: 0,
        marginTop: 0,
        fontWeight: 500,
        borderRadius: '20px'
    },
    input: {
        color: 'white'
    }
  });

useEffect(() => {
    //console.log(props.title)
  }, []);

  const { classes } = props;
  return (
    // #eeede8  efa29a
    <Box className="main-section">
    <Box sx={{ backgroundColor: "#f78997", color: "#fff", alignContent: "center", height: "44px" }} >
      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p>Sign up for our newsletter for 15% off</p>
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
        <p>-</p>
      </Grid>
      </Grid>
    </Box>

    <Box sx={{ backgroundColor: "#fff", color: "#424242", alignContent: "center" }} style={{ height: "100px" }}  >
      <Grid container spacing={2} >
      <Grid item xs={12} md={3} key={"mainsect-left"} sx={{ justifyItems : "center" }} >
        <p>left</p>
      </Grid>
      <Grid item xs={12} md={6} key={"mainsect-center"} sx={{ justifyItems : "center" }}  >
        <p className="site-logo">Angelica fabric market</p>
      </Grid>
      <Grid item xs={12} md={3} key={"mainsect-right"} sx={{ justifyItems : "center" }} >
      <Box style={findBoxStyle}>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                label="Find products"
                name="search"
                value={search}
                className={styles.textField}
                onChange={ev => props.searchProducts(ev.target.value)}
                InputProps={{
                  className: styles.input,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
          </Box>
      </Grid>
      </Grid>
    </Box>
    </Box>
  );
}


