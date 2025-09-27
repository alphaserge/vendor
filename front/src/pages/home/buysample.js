import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux'

//import { useStyles } from '@mui/material/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button, FormControl, Typography } from "@mui/material";
import Select from '@mui/material/Select';
import StyledTextField from '../../components/styledtextfield';
import StyledButtonWhite from '../../components/styledbuttonwhite';
import StyledIconButton from '../../components/stylediconbutton';
import Checkbox from '@mui/material/Checkbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import FormControlLabel from '@mui/material/FormControlLabel';

import axios from 'axios'

import config from "../../config.json"

import MainSection from './mainsection';
import Footer from './footer';

import { addToCart, removeFromCart, updateQuantity, flushCart } from '../../store/cartSlice' 
import PropertyQuantity from "../../components/propertyquantity";
import ItemName from '../../components/itemname';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import Property from '../../components/property';
import StyledButton from '../../components/styledbutton';

import { fined } from "../../functions/helper"

const useStyles = makeStyles((theme) => ({
  noexpand: {
    flexGrow: "0!important",
    marginLeft: 0
  },
  expand: {
    flexGrow: 0,
    marginLeft: "4px"
  },
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }

const StyledSelect = withStyles({
  borderRadius: '0px',
    root: {
            borderRadius: '0px',
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: "#bbb",
            },
          }
  })(Select);


export default function BuySample(props) {

  const classes = useStyles()

  const cartCount = useSelector((state) => state.cart.items.length)
  const shopCart = useSelector((state) => state.cart.items)

  const navigate = useNavigate();
  const theme = useTheme();

  const [product, setProduct] = useState({colors: []})
  
  const shoppingCartRef = useRef()
  const [address, setAddress] = useState("")
  const [email, setEmail] = useState("")

  const [agree, setAgree] = useState(false)

  const handleAgree = (event) => {
    setAgree(event.target.checked);
  };


  const [domReady, setDomReady] = React.useState(false)

    const dispatch = useDispatch();

    /*
    const _addToCart = () => {
      dispatch(addToCart({ product, cartColor, cartQuantity, cartUnit }));
    };
  
    const setQuantity = (index, quantity) => {
      setCartQuantity(quantity)
    }

    const setIsRolls = (index, isRolls) => {
      setCartIsRolls(isRolls)
    }
  
    const setHelp = (index, help) => {
      setCartHelp(help)
    }
  
    const handleBuySample = (event) => {
      navigate("/buysample")
    };

    const handleAddToCart = (event) => {
      if (colorVarId ==- 1) 
      {
        return 
      }

      _addToCart();
      setCartQuantity(1)
      setCartIsRolls(false)
    };
  
    const handleOpenCart = (event) => {
      navigate("/shoppingcart")
    }

    const handleColorVarChange = (e, it) => {
      //setCartColorVar({colorNames: e.target.value.colorNames, colorVariantId: e.target.value.colorVariantId})
      setCartColor(e.target.value)
      setColorVarId(e.target.value.colorVariantId)
    }


    const loadProduct = async (e) => {

      axios.get(config.api + '/Products/Product?id=' + getFromUrl('id'))
      .then(function (result) {
          setProduct(result.data)
          //console.log('result.data:')
          //console.log(result.data)
      })
      .catch (error => {
        console.log(error)
      })
    }
*/
    /* link external script
       https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx */
    useEffect(() => {
      //setDomReady(true)
      const script = document.createElement('script');
      script.src = "https://unpkg.com/js-image-zoom@0.4.1/js-image-zoom.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      }
    }, []);

    React.useEffect(() => {
    setDomReady(true)
    }, [])


    useEffect(() => {
      //loadProduct()
    }, []);


  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }

  const pay = async (id, total) => {
      window.open("https://show.cloudpayments.ru/widget/");
      await axios.post(config.api + '/Payments/Pay', 
      { 
          what: "order", 
          whatId: id,
          amount: total,
          currency: "usd"
      })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      })    
    };
    

  const productInCart = shopCart ? shopCart.map((x) => { return x.product.id }).indexOf(product.id) >= 0 : false;

//new ImageZoom(document.getElementById("img-container"), options);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
      </Container>

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

     <Box className="center-content" sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "row", pt: 4 }}  >  {/* height: "calc(100vh - 330px)" */}

      <Box sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "column", pt: 4 }}>
      <StyledTextField margin="normal"
          required
          fullWidth
          id="email"
          label="Your email"
          name="email"
          value={email}
          onChange={ev => setEmail(ev.target.value)}
          autoComplete="email"
          style={itemStyle}
          autoFocus />
          
          
      <StyledTextField margin="normal"
          required
          fullWidth
          id="address"
          label="Your address"
          name="address"
          value={address}
          onChange={ev => setAddress(ev.target.value)}
          autoComplete="address"
          style={itemStyle}
          autoFocus />

     <Box sx={{display: "flex", alignContent: "center", mt: 4}} >
                       <StyledIconButton 
                         size="small" 
                         aria-label="pay" 
                         sx={{backgroundColor: "#222", color: "#fff", width: "80px"}} 
                         disabled={!agree}
                         onClick={(e)=> { pay() }} >
                         <AttachMoneyIcon sx={{color: "#fff"}} />
                         Pay
                       </StyledIconButton>
                       <FormControlLabel required control={<Checkbox checked={agree} onChange={handleAgree} />} label="I confirm that the order composition meets my requirements" sx={{pl: 2 }} />
             </Box>

     </Box>
     </Box>

    {/* ----- */}
<br/><br/><br/>
    {/* </Box> */}
<br/>
<br/>
    <Footer sx={{ mt: 2, mb: 2 }} />
 
    </ThemeProvider>
  );
}