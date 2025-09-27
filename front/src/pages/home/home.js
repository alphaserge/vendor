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

//import Header from './header';
import Footer from './footer';

import MainSection from './mainsection';
import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import ShoppingCart from '../../components/shoppingcartmodal';
import CheckboxList from '../../components/checkboxlist';
import QuickView from '../../components/quickview';
import Info from '../../components/info';
import { postProduct } from '../../api/products'
import { fromUrl } from '../../functions/helper';
import { stringToHash } from '../../functions/hash'


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

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")

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

    const [selectedTextileType, setSelectedTextileType] = useState([])
    const [selectedDesignType, setSelectedDesignType] = useState([])
    const [selectedSeason, setSelectedSeason] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedPrintType, setSelectedPrintType] = useState([])
    const [selectedProductType, setSelectedProductType] = useState([])
    const [selectedOverworkType, setSelectedOverworkType] = useState([])
    
    const [quickViewProduct, setQuickViewProduct] = React.useState(null);

    const [info, setInfo] = React.useState("");

    const shoppingCartRef = useRef()
    const quickViewRef = useRef()

    const setFilter = (entity, value) => {
        if (entity == "clear") {
          setSelectedTextileType([])
          setSelectedColor([])
          setSelectedDesignType([])
          setSelectedOverworkType([])
          setSelectedPrintType([])
          setSelectedProductType([])
          setSelectedSeason([])
          return
        }

        switch (entity) {
          case "color": setSelectedColor(value); break;
          case "textileType": setSelectedTextileType(value); break;
          case "designType": setSelectedDesignType(value); break;
          case "overworkType": setSelectedOverworkType(value); break;
          case "printType": setSelectedPrintType(value); break;
          case "productType": setSelectedProductType(value); break;
          case "selectedSeason": setSelectedSeason(value); break;
        }
    }

    const searchProducts = async (e) => {

      setSearch(e)
      axios.get(config.api + '/Products/Products?id='+props.data.user.id,
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

    const quickView = (e, data) => {
      //setShowQuickView(true)
      setQuickViewProduct(data)
      //setAddToCartFunction("Add to Cart")
      if (quickViewRef.current) {
        quickViewRef.current.displayWindow(true);
      }
    }

    useEffect(() => {

      let search = fromUrl("q")
      if (!!search) {
        let decoded = decodeURIComponent(search)
        setSearch(decoded)
        searchProducts(decoded)
      }

    }, []);

    useEffect(() => {

      loadProducts()

    }, [quickViewProduct, quickViewRef, selectedSeason, selectedColor, selectedDesignType, selectedPrintType, selectedProductType, selectedTextileType]);


    let passwordhash1 = stringToHash('Aa123456')
    //console.log('passwhash')
    //console.log(passwordhash1)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      {/* Quick view modal */}
      {/* {(
        <QuickView 
          product={quickViewProduct} 
          ref={quickViewRef}
          closeDialog={(action) => { 
            if (action=='open cart') {
              handleShowShoppingCart();
            }
          }}
        />)} */}

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
          searchProducts={searchProducts}
          data={props.data}
          setFilter = {(value, entity)=>{ setFilter(value, entity)}} />

        <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" >
          <Box display={{ xs: 'none', md: 'flex' }} sx={{ flexDirection: "column", minWidth: "200px", marginTop: "4px" }}  >
            {/* <Box className="subtitle" >Shopping options</Box> */}
            {/* <strong role="heading" aria-level="2" class="subtitle underline">Shopping Options</strong> */}
            <CheckboxList
              list={!props.data.designTypes ? [] : props.data.designTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Design types"
              expanded={true}
              setValueFn={setSelectedDesignType}
              value={selectedDesignType}
              padding="20px 0 0 0"
            />
            <CheckboxList
              list={!props.data.productTypes ? [] : props.data.productTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Product types"
              //height={80}
              expanded={true}
              setValueFn={setSelectedProductType}
              value={selectedProductType}
              padding="10px 0 0 0"
            />
            <CheckboxList
              list={!props.data.printTypes ? [] : props.data.printTypes.map((it) => ({ key: it.id, name: it.value }))}
              title="Print types"
              expanded={true}
              setValueFn={setSelectedPrintType}
              value={selectedPrintType}
              padding="10px 0 0 0"
            />
            <CheckboxList
              list={!props.data.colors ? [] : props.data.colors.map((it) => ({ key: it.id, name: it.value }))}
              title="Colours"
              // height={310}
              expanded={false}
              setValueFn={setSelectedColor}
              value={selectedColor}
              padding="10px 0 0 0"
            />
            <CheckboxList
              list={!props.data.seasons ? [] : props.data.seasons.map((it) => ({ key: it.id, name: it.value }))}
              title="Seasons"
              //height={120}
              expanded={false}
              setValueFn={setSelectedSeason }
              value={selectedSeason}
              padding="10px 0 0 0"
            />
          </Box>

          <Box sx={{ padding: "10px" }} >
          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
          <Grid container spacing={1} sx={{marginX: "auto"}} >
            { products.map((data, index) => (
            <Grid item xs={6} md={3} key={"itemprod-"+index} sx={{ minWidth: "240px" }} >
              <ItemProduct data={data} index={index} quickView={quickView} />
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
