import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import Header from './header';

//import randomUUID from 'crypto';

import Copyright from '../copyright';
import config from "../../config.json"

import Footer from './blog/Footer';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const buttonStyle = { width: 220, margin: "10px", display: "block" }

export default function HomeMenu(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const onAddButtonClick = (e) => {
      navigate("/addproduct")
    }

    const onListButtonClick = (e) => {
      navigate("/")
    }

    useEffect(() => {
    }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
      <Header title="Blog" />
        <main>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
             {props.lastAction}
          </Typography>

          <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid item xs={12} sx={{textAlign:"center"}} justifyContent={"center"} >
                <Button
                  variant="outlined"
                  style={buttonStyle}
                  onClick={onAddButtonClick}
                  >
                  Add next product
                </Button>

                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 auto"}}
                    onClick={onListButtonClick}
                    >
                      My products list
                    </Button>

          </Grid>
          </Box>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
