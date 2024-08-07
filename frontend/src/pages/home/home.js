import React from "react"
import { Link, Router, useNavigate } from "react-router-dom";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import Login from '../auth/login';
import Header from './header';
import Footer from './footer';
import { Height } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Home(props) {

    const navigate = useNavigate();
    
    const login = () => {
      navigate("/auth/login")
    }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header user={props.user} title={props.title} />
        <main>
          <Box sx={{ height: "600px", alignItems: "center", alignContent: "center" }} >
          <Button href="login" variant="text" sx={{ color: "#000", backgroundColor: "#eee", p: 2}} > Please log in</Button> 

          </Box>
        </main>
        <Footer sx={{ mt: 2, mb: 2 }} />
      </Container>
      
    </ThemeProvider>
  );
}
