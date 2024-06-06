import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import ItemProduct from './itemproduct';

import axios from 'axios'

//import randomUUID from 'crypto';


import Copyright from '../copyright';
import config from "../../config.json"

import Header from './header';
import Footer from './footer';
import { clear } from "@testing-library/user-event/dist/clear";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 400, m: 2 }
const labelStyle = { m: 2 }
const buttonStyle = { width: 180, m: 2 }

export default function ListProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    
    const loadProducts = () => {
      axios.get(config.api + '/Products')
      .then(function (res) {
          var result = res.data;
          setProducts(result)
      })
      .catch (error => {
        console.log(error)
      })
    }      

    useEffect(() => {
      loadProducts()
      console.log('load products')
      console.log(props.user)
    }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container sx={{maxWidth: "100%", padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        <div>
          {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography> */}

          <Box component="form" noValidate sx={{ mt: 1 }}  >
          <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto"}} justifyContent={"center"} className="header-menu"  >
            { products.map((data) => (
              <ItemProduct data={data} />
                 ))}
          </Grid>
          </Box>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
