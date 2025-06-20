import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux'

//import { useStyles } from '@mui/material/styles';
//import {  withStyles } from '@mui/styles';
import { makeStyles, withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import axios from 'axios'

import config from "../../config.json"

import ImageMagnifier from '../../components/imagemagnifier';
import MainSection from './mainsection';
import ShoppingCart from '../../components/shoppingcartmodal';

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../../store/cartSlice' 
import PropertyQuantity from "../../components/propertyquantity";
import PropertyItem from '../../components/propertyitem';
import Price from '../../components/price';
import ItemName from '../../components/itemname';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import Property from '../../components/property';
import {APPEARANCE as ap} from '../../appearance';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/*const useStyles = makeStyles({
  flexGrow: {
    flex: '1',
  },
  button: {
    backgroundColor: '#222',
    color: '#fff',
    '&:hover': {
      backgroundColor: '#fd8bb5',
      color: '#fff',
  },
}})*/

const StyledButton = withStyles({
  root: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: "18px",
    textTransform: "none!important",
    '&:hover': {
      backgroundColor: '#fd8bb5',
      color: '#fff',
  },
}})(Button);



const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

export default function Product(props) {

  const classes = useStyles()

  const cartCount = useSelector((state) => state.cart.items.length)
  const shopCart = useSelector((state) => state.cart.items)

  const navigate = useNavigate();
  const theme = useTheme();

  const [product, setProduct] = useState({colors: []})
  const [info, setInfo] = React.useState("");

  const [cartQuantity, setCartQuantity] = useState(1)
  const [cartUnit, setCartUnit] = useState(1)
  const [cartIsRolls, setCartIsRolls] = useState(false)
  const [cartHelp, setCartHelp] = useState(false)

  const [domReady, setDomReady] = React.useState(false)
  
  const shoppingCartRef = useRef()

  const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
  }

    const dispatch = useDispatch();

    const _addToCart = () => {
      dispatch(addToCart({ product, cartQuantity, cartIsRolls }));
    };
  
    const setQuantity = (index, quantity) => {
      setCartQuantity(quantity)
    }

    const setUnit = (u) => {
      setCartUnit(u)
    }
    
    const setIsRolls = (index, isRolls) => {
      setCartIsRolls(isRolls)
    }
  
    const setHelp = (index, help) => {
      setCartHelp(help)
    }
  
    const handleAddToCart = (event) => {
      _addToCart();
      setCartQuantity(1)
      setCartIsRolls(false)
    };
  
    const handleOpenCart = (event) => {
      //!!!
    }

    const loadProduct = async (e) => {

      axios.get(config.api + '/Products/Product?id=' + getFromUrl('id'))
      .then(function (result) {
          setProduct(result.data)
          console.log('result.data:')
          console.log(result.data)
      })
      .catch (error => {
        console.log(error)
      })
    }

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
      loadProduct()
    }, []);

    const productInCart = shopCart ? shopCart.map((x) => { return x.product.id }).indexOf(product.id) >= 0 : false;

    console.log(product)

//console.log('product.js shopCart:')
//console.log(product.shopCart)

//new ImageZoom(document.getElementById("img-container"), options);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      {/* Shopping cart modal */}
        <ShoppingCart 
          ref={shoppingCartRef}
          closeDialog={(text) => { 
            setInfo(text);
          }} /> 

      <Container sx={{padding: 0 }} className="header-container" >
      </Container>

        <MainSection
          user={props.user}
          title={props.title}
          searchProducts={null}
          textileTypes={[]}
          designTypes={[]}
          seasons={[]}
          colors={[]}
          printTypes={[]}
          productTypes={[]}
          cart={shopCart}
          openShoppingCart={handleShowShoppingCart}
          setSeason       = {(v)=>{ }}
          setTextileType  = {(v)=>{ }}
          setDesignType   = {(v)=>{ }}
          setColor        = {(v)=>{ }}
          setProductType    = {(v)=>{ }}
          setPrintType    = {(v)=>{ }}
          setOverworkType = {(v)=>{ }}
          />

    {/* <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" > */}

    {/* ----- */}
    {( product && domReady == true &&

    <Box sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "column" }} className="center-content" >
     <Box sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "row" }}  >  {/* height: "calc(100vh - 330px)" */}
     <Grid container sx={{ marginTop: "20px" }}>
      <Grid item xs={12} md={6} sx={{display: "flex", minWidth: "400px"}} justifyContent={{ md: "end", xs: "space-around" }} >
            {( product.colors && product.colors.length>0 && 
              <ImageMagnifier 
                src={config.api + "/" + product.colors[0].imagePath[0]}
                sx={{padding: "0 10px"}}
                images={product.colors.map((it, ix) => { return {label: "Picture "+ix, src: config.api + "/" + it.imagePath[0]} })}
                width={330}
                height={330}
                magnifierHeight={500}
                magnifierWidth={600}
                zoomLevel={6}
                alt="Sample Image"
            /> )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ minWidth: "400px" }}>
            <Box sx={{paddingLeft: 10, display: "block", float: "left"}}>
              <div style={{paddingLeft: "20px"}} >
        <ItemName label="Item name" value={product.itemName} />
        <Price label="Price per meter :" price={product.price} />
       </div>

          <Box sx={{
            pl: "20px",
            pr: "20px" }}>
              {(productInCart!==true && 
              <> 
                <Box sx={{ display: "flex", marginTop: "20px", width: "930px" }} >
                  <Amount value={cartQuantity} setValue={(e)=>{setQuantity(0,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
                  <Selector list={["meters","rolls"]} setValue={setUnit} /> 
                </Box>

                <Box sx={{ display: "flex", marginTop: "14px" }}>
                  <Property fontSize={ap.FONTSIZE} color={ap.COLOR} value={product.rollLength + " meters in roll"} />
                </Box>

                <StyledButton
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  onClick={handleAddToCart}
                  //className={classes.button}
                  sx={{ 
                    mt: 4, 
                    p: "12px", 
                    width: "160px", 
                    fontSize: ap.FONTSIZE,
                    backgroundColor: "#222", 
                    color: "#fff", 
                    borderRadius: 0 }}>Add to cart</StyledButton>
              </>)}

              {(productInCart===true && 
              <Box sx={{ width: "930px" }}> 
                {(productInCart===true && <StyledButton
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  //className="button"
                  onClick={handleOpenCart}
                  sx={{
                    mt: 3, 
                    p: "12px", 
                    width: "160px", 
                    fontSize: ap.FONTSIZE,// "18px",
                    backgroundColor: "#222", 
                    color: "#fff",  
                    borderRadius: 0 }}>In cart</StyledButton> )}
              </Box>)}
          </Box>

        <Box sx={{ justifyContent: "flex-start", display: "flex", alignItems: "flex-start", flexDirection: "row", margin: "25px 20px 20px 20px" }}  >  {/* height: "calc(100vh - 330px)" */}
          <Accordion defaultExpanded={false} disableGutters sx={{ boxShadow: "none", backgroundColor: "transparent" }} >

          <AccordionSummary 
            classes={{ content: classes.noexpand, expanded: classes.noexpand }} 
            expandIcon={<ExpandMoreIcon sx={{marginLeft: "0"}} />} 
            sx={{ maxWidth: "744px", padding: "0 3px", flexGrow: 0, justifyContent: "flex-start" }} >
          
            <Typography sx={{ margin: 0, fontFamily: ap.FONTFAMILY, fontSize: ap.FONTSIZE, fontWeight: "600", flexGrow: 0, paddingRight: "4px" }} className="subtitle-2" >More information</Typography>
          </AccordionSummary>

          <AccordionDetails sx={{ maxWidth: "744px", margin: "0 auto", padding: "0 0px", overflowX: "hidden", overflowY: "auto"  }}>
        <PropertyItem label="Article No :" value={fined(product.artNo)} />
        <PropertyItem label="Ref No :" value={fined(product.refNo)} />
        <PropertyItem label="Design :" value={fined(product.design)} />
        <PropertyItem label="Composition :" value={fined(product.composition)} />
        
        <PropertyItem label="Product type :" value={fined(product.productType)} />
        <PropertyItem label="Product style :" value={fined(product.productStyle)} />
        <PropertyItem label="Print style :" value={fined(product.printType)} />
        </AccordionDetails>
        </Accordion>
        </Box>

        </Box>
        </Grid>
        </Grid>
        </Box>
        
        
        </Box>
    )}
    {/* ----- */}

    {/* </Box> */}

    {/* <Footer sx={{ mt: 2, mb: 2 }} /> */}

    </ThemeProvider>
  );
}