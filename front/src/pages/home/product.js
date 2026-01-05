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
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import ShopIcon from '@mui/icons-material/Shop';
import Select from '@mui/material/Select';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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

import { fined, round2, computePrice, calculatePrice } from "../../functions/helper"
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

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ paddingTop: 3 }}>{children}</Box>}
    </div>
  );
}

CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


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
  const [manualColorInCart, setManualColorInCart] = useState(false)
  const [colorVar, setColorVar] = useState(null)
  const [price, setPrice] = useState(0)
  const [onStock, setOnStock] = useState(0)

  const [cartIsRolls, setCartIsRolls] = useState(false)
  const [cartHelp, setCartHelp] = useState(false)
  const [filteredImages, setFilteredImages] = useState(null)
  const [selectedColorNo, setSelectedColorNo] = useState(null)
  const [tabValue, setTabValue] = React.useState(0);

  const [domReady, setDomReady] = React.useState(false)

  const dispatch = useDispatch();

    const add2Cart = (is_sample) => {
      if (!cartColor.colorNo && !!manualColor) {
        cartColor.colorNo = parseInt(manualColor)
        const color = product.colors.find(x => x.colorVariantId!=-1 && x.colorNo + '' == manualColor)
        if (!!color) {
          cartColor.colorNames = color.colorNames;
          cartColor.colorIds  = color.colorIds;
          cartColor.isProduct = color.isProduct;
          cartColor.imagePath = color.imagePath;
          cartColor.price     = color.price;
          cartColor.colorVariantId = color.colorVariantId;
        }
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
      add2Cart(true);
      //navigate("/buysample")
    };

    const handleAddToCart = (event) => {
      /*if (colorVarId ==- 1 && !manualColor) { return } */

      if (productInCart) {
        navigate("/shoppingcart?what=cart")
      } else {
        add2Cart(false);
        setCartQuantity(1)
        setCartIsRolls(false)
      }
    };
  
    const handleOpenCart = (what) => {
      navigate("/shoppingcart?what=" + what)
    }

    const handleTabChange = (event, newValue) => {
      setTabValue(newValue);
    };

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
        // set colVar to global photo:
        const colVar = _product.colors.find(x => !x.colorNo)
        setProduct(_product)
        
        setPrice(computePrice(_product, 1000, false))
        if (colVar) {
          setCartColor(colVar)
        } 
          const prices = _product.colors.map(x=>x.price)
          const priceMin = Math.min(...prices) //?(...prices)
          setPrice(calculatePrice(priceMin, 1000))
        
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
    setCartColor(item.colorVar)
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
    const manInCart = shopCart.findIndex(x => 
      x.product.id == product.id &&
      x.quantity != -1 &&
      x.colorVar.colorNo == e.target.value) >= 0
    setManualColorInCart( manInCart )

    const color = product.colors.find(p => p.colorNo+'' == col)
    if (!color) {
      setOnStock(null)
    } else {
      setOnStock(color.quantity)
      //!!setColorVar(color)
    }

    if (!!color && !!color.price) {
      setPrice(computePrice(product, 1000, false, color))
    } else {
      setPrice(computePrice(product, 1000, false, null))
    }

  }

const productInSamples = shopCart ? shopCart.findIndex(x => x.product.id == product.id && x.quantity == -1) >= 0 : false;
const showColorEditor = (!colorVar || (!!colorVar && colorVar.colorNo==null))

var productInCart = false;
if (!!shopCart && !!colorVar) {
   productInCart = shopCart.findIndex(x => 
    x.product.id == product.id &&
    x.quantity != -1 &&
    (x.colorVar.colorNo == colorVar.colorNo || x.colorVar.colorNo == manualColor)) >= 0;
}

//console.log('product.colors:')
//console.log(product.colors)
console.log('product:') 
console.log(product) 
console.log('colorVar:') 
console.log(colorVar) 
console.log('shopCart:') 
console.log(shopCart) 
console.log('productInCart:');
console.log(productInCart);

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
                            quantity: it.quantity,
                            imagePath: it.imagePath
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
        <Box sx={{width: "400px", marginLeft: "30px"}}>
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
          <PropertyItem label="Price" value={"from"} valueBold={" $" + price} valueEnd ={" per meter"} />
          {!showColorEditor && <PropertyItem label="Color no." value={colorVar.colorNo} /> }
          {/* {!!manualColor && <PropertyItem label="Color no." value={manualColor} /> } */}
          {/* <PropertyItem label="Price" value={"from <b>$" + price + "</b> per meter"} /> */}

          {/* <Box sx={{ padding: "0px 0px", fontSize: "16px" }} >{!!selectedColorNo ? "Color: " + selectedColorNo : "please select color"}</Box> */}
          {/* <Box sx={{ color: "#222", margin: "15px 0 0 0" }}>Price: from $ <b>{fined(price)}</b> per meter</Box> */}
        </Box>

        <Box sx={{ display: "flex", flexDirection: "column", width: "930px", marginTop: "15px" }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleTabChange} aria-label="" TabIndicatorProps={{sx: {display: 'none'},}}>
                  <Tab label="Add to cart" {...a11yProps(0)} sx={{textTransform: "none", fontSize: "15px", fontWeight: tabValue==0 ? "600":"400", color: "#222 ! important"}} />
                  <Tab label="Buy a sample" {...a11yProps(1)} sx={{textTransform: "none", fontSize: "15px", fontWeight: tabValue==1 ? "600":"400", color: "#222 ! important"}} />
                </Tabs>
            </Box>
            <CustomTabPanel value={tabValue} index={0} sx={{padding: "0"}} padding="0" >
            <FormControl id="dd0" sx={{padding: "0"}}>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "flex-start", columnGap: "10px"}}>
                
                <Box sx={{ display: "flex", flexDirection: "column", rowGap: "10px"}}>
                { showColorEditor && <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                <Box sx={{width: "85px"}}>Color no:</Box>
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

                <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center"}}>
                    <Box sx={{width: "85px"}}>Quantity:</Box>
                    <Amount value={cartQuantity} labelWidth="10px ! important" setValue={(e)=>{setQuantity(0,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
                </Box>
                { !showColorEditor && <Box sx={{ width: "140px" }}><StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  onClick={handleAddToCart}
                  disabled={ (!colorVar || (!!colorVar && !colorVar.colorNo)) && !manualColor}
                  sx={{ mt: 3 }} >{ productInCart ? "In cart" : "Add to cart" } </StyledButton></Box>}

                </Box>

                    <FormControl id="dd1" sx={{marginLeft: "20px"}}>
                      {/* <FormLabel id="demo-radio-buttons-group-label">Gender</FormLabel> */}
                      <RadioGroup
                        sx={{display: "flex", flexDirection: showColorEditor ? "column" : "row"}}
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="meters"
                        name="radio-buttons-group" >
                        <FormControlLabel value="meters" control={<Radio />} label="meters" />
                        <FormControlLabel value="rolls" control={<Radio />} label="rolls" />
                      </RadioGroup>
                    </FormControl>

                 { showColorEditor &&<StyledButton
                  startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
                  onClick={handleAddToCart}
                  disabled={ (!colorVar || (!!colorVar && !colorVar.colorNo)) && !manualColor}
                  sx={{ mt: 3 }} >{ productInCart || manualColorInCart ? "In cart" : "Add to cart" } </StyledButton>}
              </Box>
            </FormControl>
            </CustomTabPanel>
            <CustomTabPanel value={tabValue} index={1}>
                Item Two
            </CustomTabPanel>
        </Box>

        </Box>
        </Box>
        </Grid>
        </Grid>
        </Box>
    )}
<br/>
<br/>
    <Footer sx={{ mt: 2, mb: 2 }} />
 
    </ThemeProvider>
  );
}