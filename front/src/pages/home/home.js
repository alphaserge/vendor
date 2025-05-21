import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import axios from 'axios'

import config from "../../config.json"

import Header from './header';
import Footer from './footer';

import MainSection from './mainsection';
import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import ShoppingCart from '../../components/shoppingcart';
import CheckboxList from '../../components/checkboxlist';
import QuickView from '../../components/quickview';
import Info from '../../components/info';
import { postProduct } from '../../api/products'

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

const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

export default function Home(props) {

    const cartCount = useSelector((state) => state.cart.items.length)
    const shopCart = useSelector((state) => state.cart.items)
    //const shopCart = useSelector((state) => state.cart.items)
    //console.log(cart1)

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [addProduct, setAddProduct] = useState(false)

    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [textileTypes, setTextileTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [printTypes, setPrintTypes] = useState([])
    const [productStyles, setProductStyles] = useState([])

    const [productStyle, setProductStyle] = useState("")
    const [productType, setProductType] = useState("")
    const [color, setColor] = useState([])
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [itemName, setItemName] = useState("")
    const [refNo, setRefNo] = useState("")
    const [artNo, setArtNo] = useState("")
    const [design, setDesign] = useState("")
    const [view, setView] = useState("grid")

    const [selectedTextileType, setSelectedTextileType] = useState([])
    const [selectedDesignType, setSelectedDesignType] = useState([])
    const [selectedSeason, setSelectedSeason] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedPrintType, setSelectedPrintType] = useState([])
    const [selectedProductType, setSelectedProductType] = useState([])
    const [selectedOverworkType, setSelectedOverworkType] = useState([])

    
    const [addItemName, setAddItemName] = useState("")
    const [addRefNo, setAddRefNo] = useState("")
    const [addArtNo, setAddArtNo] = useState("")
    const [addDesign, setAddDesign] = useState("")

    const [showQuickView, setShowQuickView] = React.useState(false);
    const [quickViewProduct, setQuickViewProduct] = React.useState(null);//{ notValid: true, colors: [{ imagePath: [''] }]});

    const [info, setInfo] = React.useState("");

    const shoppingCartRef = useRef()
    const quickViewRef = useRef()

    const dropFilters = (e) => {
      setSelectedTextileType([])
      setSelectedDesignType([])
      setSelectedSeason([])
      setSelectedColor([])
      setSelectedPrintType([])
      setSelectedProductType([])
      setSelectedOverworkType([])
    }

    const clearFilter = (e) => {
      setProductStyle("")
      setProductType("")
      setColor([])
      setDesignType([])
      setOverworkType([])
      setSeason([])
      setItemName("")
      setRefNo("")
      setArtNo("")
      setDesign("")
      setSearch("")

      axios.get(config.api + '/Products/Products?id='+'0', //+props.user.id,
        { params:
            {
              vendorId: null
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
          setFilter(false)
        })
      .catch (error => {
        console.log(error)
      })
   }

   const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
   }

   const handleShowQuickView = (event) => {
    if (quickViewRef.current) {
      quickViewRef.current.displayWindow(true);
    }
   }

    const searchProducts = async (e) => {

      setSearch(e)
      axios.get(config.api + '/Products/Products?id='+props.user.id,
        { params:
            {
              search: e
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
      })
      .catch (error => {
        console.log(error)
      })
    }

    const loadProducts = async (e) => {

      axios.get(config.api + '/Products/Products?id=0',//+props.user.id,
        { params:
            {
              name: itemName,
              artno: artNo,
              refno: refNo,
              design: design,
              colors: JSON.stringify(selectedColor), //color
              seasons: JSON.stringify(selectedSeason),
              overworks: JSON.stringify(overworkType),
              designtypes: JSON.stringify(selectedDesignType),
              textiletypes: JSON.stringify(selectedTextileType),
              printypes: JSON.stringify(selectedPrintType),
              producttypes: JSON.stringify(selectedProductType),
              search: search
            }})
      .then(function (result) {
          setProducts(result.data)
          setFilter(false)
      })
      .catch (error => {
        console.log(error)
      })
    }

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

    const quickView = (e, data) => {
      //setShowQuickView(true)
      setQuickViewProduct(data)
      handleShowQuickView();
      
      //setAddToCartFunction("Add to Cart")
    }

    useEffect(() => {
      loadProducts()
      loadColors()
      loadSeasons()
      loadDesignTypes()
      loadTextileTypes()
      loadOverworkTypes()
      loadProductTypes()
      loadPrintTypes()
      loadProductStyles()

      if (getFromUrl("new")==1) {
        setAddProduct(true)
      }
      //console.log('use effect:' + selectedSeason)
    }, [selectedSeason, selectedColor, selectedDesignType, selectedPrintType, selectedProductType, selectedTextileType]);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      {/* Quick view modal */}
      {(quickViewProduct && 
        <QuickView 
          product={quickViewProduct} 
          ref={quickViewRef}
          closeDialog={(action) => { 
            if (action=='open cart') {
              handleShowShoppingCart();
            }
          }}
        />)} 

      {/* Shopping cart modal */}
        <ShoppingCart 
          ref={shoppingCartRef}
          closeDialog={(text) => { 
            setInfo(text);
          }} /> 

      {/* Show info modal */}
      {( info && info.length > 0 && 
        <Info message={info} close={ ()=>{ setInfo(""); }} /> )}

      <Container sx={{padding: 0 }} className="header-container" >
      </Container>

        <MainSection
          user={props.user}
          title={props.title}
          searchProducts={searchProducts}
          textileTypes={textileTypes}
          designTypes={designTypes}
          seasons={seasons}
          colors={colors}
          printTypes={printTypes}
          cart={shopCart}
          openShoppingCart={handleShowShoppingCart}
          setSeason       = {(v)=>{ dropFilters(); setSelectedSeason(v)}}
          setTextileType  = {(v)=>{ dropFilters(); setSelectedTextileType(v)}}
          setDesignType   = {(v)=>{ dropFilters(); setSelectedDesignType(v)}}
          setColor        = {(v)=>{ dropFilters(); setSelectedColor(v)}}
          setPrintType    = {(v)=>{ dropFilters(); setSelectedPrintType(v)}}
          setOverworkType = {(v)=>{ dropFilters(); setSelectedOverworkType(v)}}
          />

        <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" >
          <Box display={{ xs: 'none', md: 'flex' }} sx={{ flexDirection: "column", minWidth: "200px" }}  >
            <CheckboxList
              list={colors.map((it) => ({ key: it.id, name: it.value }))}
              title="Colours"
              height={310}
              expanded={true}
              setValueFn={setSelectedColor}
              value={selectedColor}
            />
            <CheckboxList
              list={seasons.map((it) => ({ key: it.id, name: it.value }))}
              title="Seasons"
              height={120}
              expanded={true}
              setValueFn={setSelectedSeason }
              value={selectedSeason}
            />
            <CheckboxList
              list={designTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Design types"
              expanded={true}
              setValueFn={setSelectedDesignType}
              value={selectedDesignType}
            />
            <CheckboxList
              list={printTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Print types"
              expanded={true}
              setValueFn={setSelectedPrintType}
              value={selectedPrintType}
            />
            <CheckboxList
              list={productTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Product types"
              height={80}
              expanded={true}
              setValueFn={setSelectedProductType}
              value={selectedProductType}
            />
          </Box>

          <Box sx={{ padding: "10px" }} >
          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
          <Grid container spacing={1} sx={{marginX: "auto"}} >
            { view === "grid" && products.map((data, index) => (
            <Grid item xs={12} md={4} key={"itemprod-"+index} sx={{ minWidth: "320px" }} >
              <ItemProduct data={data} index={index} quickView={quickView} />
            </Grid>
            ))}
            { view === "rows" && products.map((data, index) => (
            <Grid item xs={12} md={12} key={"itemprod-"+index} >
              <ItemProductRow data={data} index={index} />
            </Grid>
            ))}
          </Grid>

          </Box>
          </Box>

        {/*<Button
            variant="contained"
            onClick={(e) => { setInfo("8934 u8929 c20u23 4") }} >
                Close
        </Button>*/}

        <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
