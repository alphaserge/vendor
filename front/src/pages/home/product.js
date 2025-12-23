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
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShopIcon from '@mui/icons-material/Shop';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormGroup from '@mui/material/FormGroup';
import styled from 'styled-components'

import axios from 'axios'

import config from "../../config.json"

import ImageMagnifier from '../../components/imagemagnifier';
import MainSection from './mainsection';
import Footer from './footer';

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../../store/cartSlice' 
import PropertyItem from '../../components/propertyitem';
import ItemName from '../../components/itemname';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import StyledButton from '../../components/styledbutton';
import StyledTextField from '../../components/styledtextfield';

import { fined, round2, computePrice } from "../../functions/helper"
import Styledtextfield from "../../components/styledtextfield";

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

/* 
const StyledButton = styled(Button)`
  border-radius: 0,
  background-color: '#222',
    color: '#fff',
    font-size: "18px",
    text-transform: "none!important",
  &:hover {
    background: #f33;
  }
`
const StyledButton = withStyles({
  root: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: "18px",
    textTransform: "none!important",
    '&:hover': {
      backgroundColor: '#fd8bb5',
      color: '#fff',
  }
}})(Button);*/

const StyledSelect = withStyles({
  borderRadius: '0px',
    root: {
            borderRadius: '0px',
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: "#bbb",
            },
          }
  })(Select);


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
  const [colors, setColors] = useState([])
  const [seasons, setSeasons] = useState([])
  const [designTypes, setDesignTypes] = useState([])
  const [textileTypes, setTextileTypes] = useState([])
  const [overworkTypes, setOverworkTypes] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [printTypes, setPrintTypes] = useState([])
  const [productStyles, setProductStyles] = useState([])

  const [info, setInfo] = React.useState("");

  const [cartQuantity, setCartQuantity] = useState(1)
  const [cartUnit, setCartUnit] = useState("meters")
  const [cartColor, setCartColor] = useState({colorNames: "custom color", colorVariantId: -1})
  const [manualColor, setManualColor] = useState("")
  const [colorVar, setColorVar] = useState(null)
  const [price, setPrice] = useState(0)
  const [onStock, setOnStock] = useState(0)

  const [cartIsRolls, setCartIsRolls] = useState(false)
  const [cartHelp, setCartHelp] = useState(false)
  const [filteredImages, setFilteredImages] = useState(null)
  const [selectedColorNo, setSelectedColorNo] = useState(null)

  const [domReady, setDomReady] = React.useState(false)
  
  const dispatch = useDispatch();

    const _addToCart = (is_sample) => {
      if (!cartColor.colorNo && !!manualColor) {
        cartColor.colorNo = parseInt(manualColor)
      }
      let qty = is_sample ? -1 : cartQuantity
      dispatch(addToCart({ product, cartColor, cartQuantity: qty, cartUnit }));
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
      _addToCart(true);
      //navigate("/buysample")
    };

    const handleAddToCart = (event) => {
      /*if (colorVarId ==- 1 && !manualColor) { return } */
      _addToCart(false);
      setCartQuantity(1)
      setCartIsRolls(false)
    };
  
    const handleOpenCart = (what) => {
      navigate("/shoppingcart?what=" + what)
    }

    var selectColors = product.colors.filter((it,ix) => { return it.colorNames != "PRODUCT"})

     //!! I'm change :
    selectColors =  product.colors
    // ?  product.colors.map((it) => { return it.colorNames == "PRODUCT" ? "custom color" : it.colorNames } ) : []

    selectColors.forEach((e) => {
      if (e.colorNames == "PRODUCT") {
        e.colorNames = "custom color"
      }
    })

    const loadColors = () => {
      axios.get(config.api + '/Colors')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
          setColors(items)
      })
      .catch (error => {
        console.log('Home loadColors error:' )
        console.log(error)
      })
    }

    const loadSeasons = () => {
      axios.get(config.api + '/Seasons')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
          setSeasons(items)
      })
      .catch (error => {
        console.log('Home loadSeasons error:' )
        console.log(error)
      })
    }

    const loadDesignTypes = () => {
      axios.get(config.api + '/DesignTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.designName }))
          setDesignTypes(items)
      })
      .catch (error => {
        console.log('Home loadDesignTypes error:' )
        console.log(error)
      })
    }

    const loadTextileTypes = () => {
      axios.get(config.api + '/TextileTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.textileTypeName }))
          setTextileTypes(items)
      })
      .catch (error => {
        console.log('Home loadDesignTypes error:' )
        console.log(error)
      })
    }

    const loadOverworkTypes = () => {
      axios.get(config.api + '/OverworkTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
          setOverworkTypes(items)
      })
      .catch (error => {
        console.log('Home loadDesignTypes error:' )
        console.log(error)
      })
    }

    const loadProductTypes = () => {
      axios.get(config.api + '/ProductTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
          setProductTypes(items)
      })
      .catch (error => {
        console.log('Home loadProductTypes error:' )
        console.log(error)
      })
    }

    const loadPrintTypes = () => {
      axios.get(config.api + '/PrintTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
          setPrintTypes(items)
      })
      .catch (error => {
        console.log('Home loadPrintTypes error:' )
        console.log(error)
      })
    }

    const loadProductStyles = () => {
      axios.get(config.api + '/ProductStyles')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.styleName }))
          setProductStyles(items)
      })
      .catch (error => {
        console.log('Home loadProductStyles error:' )
        console.log(error)
      })
    }


    const loadProduct = async (e) => {

      axios.get(config.api + '/Products/Product?id=' + getFromUrl('id'))
      .then(function (result) {
        const _product = result.data
        const colVar = _product.colors.find(x => !x.colorNo)
        setProduct(_product)
        setPrice(computePrice(_product, 1000, false))
        if (colVar) {
          setCartColor(colVar)
        }
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

    useEffect(() => {
      setDomReady(true)
    }, [])

    useEffect(() => {
      loadProduct()
      loadColors()
      loadSeasons()
      loadDesignTypes()
      loadTextileTypes()
      //loadOverworkTypes()
      loadProductTypes()
      //loadPrintTypes()
      loadProductStyles()
    }, []);

    /*useEffect(() => {
    var filtered = product && product.colors.length ? product.colors.map((it, ix) => { return { 
                  label: "Picture " + ix, 
                  src: config.api + "/" + it.imagePath[0],
                  colorVar: {
                      colorNames: it.colorNames,
                      colorVariantId: it.colorVariantId
                  }}}) : []
                  setFilteredImages(filtered)
                }, [])*/

  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }

  const imageSelect = (item, index) => {
    setColorVar(item.colorVar)
    setManualColor(null)
    console.log(item.colorVar)
    if (!!item.colorVar.price) {
      setPrice(computePrice(product, 1000, false, item.colorVar))
    } else {
      setPrice(computePrice(product, 1000, false, null))
    }
    
     //!! todo !!
    setOnStock(item.colorVar.quantity)
  }

  const handleManualColor = (e) => {
    const col = e.target.value
    //setManualColorVar({colorNo: col})
    setManualColor(e.target.value)

    const color = product.colors.find(p => p.colorNo+'' == col)
    if (!color) {
      setOnStock(null)
    } else {
      setOnStock(color.quantity)
    }
  }

const productInCart = shopCart ? shopCart.findIndex(x => x.product.id == product.id && x.quantity != -1) >= 0 : false;
const productInSamples = shopCart ? shopCart.findIndex(x => x.product.id == product.id && x.quantity == -1) >= 0 : false;
const showColorEditor = (!colorVar || (!!colorVar && colorVar.colorNo==null))
//console.log('product.colors:')
//console.log(product.colors)
//console.log('colorVar:') 
//console.log(colorVar) 

//new ImageZoom(document.getElementById("img-container"), options);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Container sx={{padding: 0 }} className="header-container" >
      </Container>

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

    {/* <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" > */}
    {/* ----- */}
    {( product && domReady == true &&

     <Box className="center-content" sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "row", pt: 4 }}  >  {/* height: "calc(100vh - 330px)" */}
     <Grid container sx={{ marginTop: "20px" }}>
        <Grid item xs={12} md={6} sx={{display: "flex", flexDirection: "column", minWidth: "400px", paddingRight: "30px"}} justifyContent={{ md: "flex-start", xs: "space-around" }} >
            {( product.colors && product.colors.length>0 && 
              <ImageMagnifier 
                sx={{padding: "0 10px"}}
                images={
                  product.colors.map((it, ix) => { return { 
                        index: ix,
                        label: !it.colorNo ? "all" : it.colorNo+"",
                        src: config.api + "/" + it.imagePath[0],
                        colorVar: 
                        {
                            colorNo: it.colorNo,
                            colorNames: it.colorNames,
                            colorVariantId: it.colorVariantId,
                            price: it.price,
                            quantity: it.quantity
                        }
                      }
                    })}
                width={476}
                height={476}
                highlightColor={manualColor}
                alt={product.itemName + " photo"}
                imageSelect={imageSelect}
            /> )}
            <Box sx={{ padding: "5px 0 0 0"}}>Color no. 1: red, blue, chocolate. </Box>
        </Grid>
        <Grid item xs={12} md={6} sx={{ display: "flex", minWidth: "400px" }} justifyContent={{ md: "flex-start", xs: "space-around" }} >
        <Box sx={{width: "400px", marginLeft: "70px"}}>
        <Box sx={{ display: "flex", flexDirection: "column"}} >
          <Box sx={{
              pl: "0px",
              pr: "0px" }}>
          <ItemName label="Item name" value={product.itemName} />
          <div style={{height: "15px"}}>&nbsp;</div>
          <PropertyItem label="Art no" value={fined(product.artNo)} />
          <PropertyItem label="Ref no" value={fined(product.refNo)} />
          <PropertyItem label="Design" value={fined(product.design)} />
          <PropertyItem label="Composition" value={fined(product.composition)} />
          
          <PropertyItem label="Product type" value={fined(product.productType)} />
          <PropertyItem label="Product style" value={fined(product.productStyle)} />
          <PropertyItem label="Print style" value={fined(product.printType)} />

          <PropertyItem label="Meters in roll" value={fined(product.rollLength)} />
          <PropertyItem label="Stock available" value={!!onStock ? onStock + " (meters)" : "no information, please contact us"} />
          <PropertyItem label="Price" value={"from"} valueBold={" $" +price} valueEnd ={" per meter"} />
          {!showColorEditor && <PropertyItem label="Color no." value={colorVar.colorNo} /> }
          {/* {!!manualColor && <PropertyItem label="Color no." value={manualColor} /> } */}
          {/* <PropertyItem label="Price" value={"from <b>$" + price + "</b> per meter"} /> */}

          {/* <Box sx={{ padding: "0px 0px", fontSize: "16px" }} >{!!selectedColorNo ? "Color: " + selectedColorNo : "please select color"}</Box> */}
          {/* <Box sx={{ color: "#222", margin: "15px 0 0 0" }}>Price: from $ <b>{fined(price)}</b> per meter</Box> */}
        </Box>

        <Box sx={{ display: "flex", marginTop: "10px" }}>
          <FormControl>
          {showColorEditor && <Box sx={{display: "flex", alignItems: "center"}}>
              <Box sx={{width: "90px"}}>Color no:</Box>
              <StyledTextField margin="normal"
                  //required
                  //fullWidth
                  id="manualColor"
                  //label="color no"
                  name="manualColor"
                  value={manualColor}
                  onChange={handleManualColor}
                  size="small"
                  sx={{width: "80px", margin: "0"}}
                  inputProps={{ style: { textAlign: "center" } }}
                  //autoComplete="email"
                  //style={itemStyle}
                  autoFocus /> 
            </Box> }
          </FormControl>
        </Box>

          <Box>
                <Box sx={{ display: "flex", margin: "10px 0 0 0", fontSize: "15px" }} >
                  <Box sx={{width: "90px"}}>Quantity:</Box>
                  <Amount value={cartQuantity} setValue={(e)=>{setQuantity(0,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
                  <Selector value={cartUnit} list={["meters","rolls"]} setValue={setCartUnit} /> 
                </Box>

            <Box sx={{width: "930px"}}>
                <StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#222"}} />}
                  onClick={handleAddToCart}
                  //disabled={colorVarId==-1 && !manualColor}
                  sx={{ mt: 3 }} >Add to cart</StyledButton>
                <StyledButton
                  startIcon={<ShopIcon sx={{ color: "#222"}} />}
                  onClick={handleBuySample}
                  //disabled={colorVarId==-1}
                  sx={{ mt: 3, ml: 2 }} >Buy a sample</StyledButton> 

                <StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#222"}} />}
                  onClick={e => handleOpenCart('cart')}
                  sx={{ mt: 3, ml: 2 }}>Open cart</StyledButton>
              </Box>
          </Box>  

        {/* height: "calc(100vh - 330px)" */}
        {/* <Box sx={{ justifyContent: "flex-start", display: "flex", alignItems: "flex-start", flexDirection: "row", margin: "25px 20px 20px 20px" }}  > 
          <Accordion defaultExpanded={false} disableGutters sx={{ boxShadow: "none", backgroundColor: "transparent" }} >

          <AccordionSummary 
            classes={{ content: classes.noexpand, expanded: classes.noexpand }} 
            expandIcon={<ExpandMoreIcon sx={{marginLeft: "0"}} />} 
            sx={{ maxWidth: "744px", padding: "0 3px", flexGrow: 0, justifyContent: "flex-start" }} >
            <Typography sx={{ margin: 0, fontSize: "16px", fontWeight: "400", flexGrow: 0, paddingRight: "4px" }} >More information</Typography>
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
        </Box> */}
        </Box>
        </Box>
        </Grid>
        </Grid>
        </Box>
    )}
    {/* ----- */}

    {/* </Box> */}
<br/>
<br/>
    <Footer sx={{ mt: 2, mb: 2 }} />
 
    </ThemeProvider>
  );
}