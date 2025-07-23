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
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import styled from 'styled-components'

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
import StyledButton from '../../components/styledbutton';
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
  const [cartColor, setCartColor] = useState({colorNames: "select color", colorVariantId: -1})
  const [cartIsRolls, setCartIsRolls] = useState(false)
  const [cartHelp, setCartHelp] = useState(false)
  const [filteredImages, setFilteredImages] = useState(null)
  const [colorVarId, setColorVarId] = useState(-1)

  const [domReady, setDomReady] = React.useState(false)
  
  const shoppingCartRef = useRef()

  const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
  }

    const dispatch = useDispatch();

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

    var selectColors = product.colors
      .filter((it,ix) => { return it.colorNames != "PRODUCT"})


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
          setProduct(result.data)
          //console.log('result.data:')
          //console.log(result.data)
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
    const productInCart = shopCart ? shopCart.map((x) => { return x.product.id }).indexOf(product.id) >= 0 : false;

    //console.log(filtered)
    //console.log(cartColor)

console.log('colorVarId:')
console.log(colorVarId)

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
          textileTypes={textileTypes}
          designTypes={designTypes}
          seasons={seasons}
          colors={colors}
          printTypes={printTypes}
          productTypes={productTypes}
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

     <Box className="center-content" sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "row", pt: 4 }}  >  {/* height: "calc(100vh - 330px)" */}
     <Grid container sx={{ marginTop: "20px" }}>
      <Grid item xs={12} md={6} sx={{display: "flex", minWidth: "400px", paddingRight: "30px"}} justifyContent={{ md: "flex-end", xs: "space-around" }} >
            {( product.colors && product.colors.length>0 && 
              <ImageMagnifier 
                //src={config.api + "/" + product.colors[0].imagePath[0]}
                sx={{padding: "0 10px"}}
                images={colorVarId == -1 ? product.colors.map((it, ix) => { return { 
                  label: "Picture " + ix, 
                  src: config.api + "/" + it.imagePath[0],
                  colorVar: {
                      colorNo: it.colorNo,
                      colorNames: it.colorNames,
                      colorVariantId: it.colorVariantId
                  }}})
                : product.colors.filter((i)=> { return i.colorVariantId == colorVarId}).map((it, ix) => { return { 
                  label: "Picture " + ix, 
                  src: config.api + "/" + it.imagePath[0],
                  colorVar: {
                      colorNo: it.colorNo,
                      colorNames: it.colorNames,
                      colorVariantId: it.colorVariantId
                  }}})
                }
                colorVarId={colorVarId}
                width={330}
                height={330}
                magnifierHeight={500}
                magnifierWidth={600}
                zoomLevel={6}
                alt={product.itemName + " photo"}
            /> )}
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: "flex", minWidth: "400px" }} justifyContent={{ md: "flex-start", xs: "space-around" }} >
            <Box sx={{width: "400px", marginLeft: "70px"}}>
            <Box sx={{ display: "flex", flexDirection: "column"}} >
        <Box sx={{
            pl: "20px",
            pr: "20px" }}>
        <ItemName label="Item name" value={product.itemName} />
        <Price label="Price per meter :" price={product.price} />
       </Box>

          <Box sx={{
            pl: "20px",
            pr: "20px" }}>
              {(productInCart!==true && 
              <> 
                <Box sx={{ display: "flex", marginTop: "20px", width: "930px" }} >
                  <Amount value={cartQuantity} setValue={(e)=>{setQuantity(0,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
                  <Selector value={cartUnit} list={["meters","rolls"]} setValue={setCartUnit} /> 
                </Box>

                {product.rollLength && <Box sx={{ display: "flex", marginTop: "18px" }}>
                  <Property fontSize={ap.FONTSIZE} color={ap.COLOR} value={product.rollLength + " meters in roll"} />
                </Box>}

                <Box sx={{ display: "flex", marginTop: "18px" }}>
                
                <FormControl>
                {/*<InputLabel id="demo-simple-select-label">color</InputLabel>*/}
                <StyledSelect
                  //labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  //value={cartColorVar.colorNames}
                  value={cartColor}
                  //label="color"
                  sx={{width: "250px", borderRadius: "0px"}}
                  displayEmpty
        renderValue={(value) => {
          if (!value) {
            return <Typography color="gray">your label here</Typography>;
          }
          return <>{value.colorNames}</>;
        }}
                  onChange={handleColorVarChange} >
                  { selectColors.map((it, ix) => (
                      <MenuItem key={"sh_"+ix}  value={it}>{it.colorNames}</MenuItem> )) }
                </StyledSelect>
                </FormControl>
              </Box>

                <StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  onClick={handleAddToCart}
                  disabled={colorVarId==-1}
                  sx={{ mt: 3 }} >Add to cart</StyledButton>
              </>)}

              {(productInCart===true && 
              <Box sx={{ width: "930px" }}> 
                {(productInCart===true && <StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  onClick={handleOpenCart}
                  sx={{ mt: 3 }}>In cart</StyledButton> )}
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
        </Box>
        </Grid>
        </Grid>
        </Box>
    )}
    {/* ----- */}

    {/* </Box> */}

    {/* <Footer sx={{ mt: 2, mb: 2 }} /> */}

    </ThemeProvider>
  );
}