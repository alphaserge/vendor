import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'

//import randomUUID from 'crypto';


import Copyright from '../copyright';
import config from "../../config.json"

import Header from './header';
import Footer from './blog/Footer';
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
      <Container maxWidth="lg">
        <Header user={props.user} title={props.title} />
        <main>
          {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography> */}

          <Box component="form" noValidate sx={{ mt: 1 }}>
          <Grid item xs={12} md={6} sx={{textAlign:"center"}} justifyContent={"center"} >
            { products.map((data) => (
              <FormControl  sx={{ mb: 2, width: 440 }} > 
               <div style={{ marginBottom: "20px" }}>
                      <div class="product-img">
                      <img src={"https://localhost:3080/" + data.imagePath}  />
                      </div>
                     <Box 
                        key={data.id} 
                        value={data.id}
                        //sx = {itemStyle}
                        sx={{ float: "left"}}
                      >
                        <div class="product-item">{data.itemName}</div>
                        {/* <div class="product-item">{data.refNo}</div>*/}
                        <div class="product-item">{data.artNo}</div> 
                        <div class="product-item">{data.design}</div>
                        <div class="product-item price"><span>&nbsp;${data.price}&nbsp;</span></div>
                      </Box>
                      <div style={{ clear: "left" }} >
                      </div>
                      </div>
                      </FormControl>
                 ))}
          </Grid>
          </Box>
        </main>
        <Copyright sx={{ mt: 0, mb: 2 }} />
              </Container>
              
    </ThemeProvider>
  );
}
