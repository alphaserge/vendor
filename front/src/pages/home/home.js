import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import axios from 'axios'

import config from "../../config.json"

import Header from './header';
import Footer from './footer';

import MainSection from './mainsection';
import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import CheckboxList from '../../components/checkboxlist';
import MySelect from '../../components/myselect';
import { postProduct } from '../../api/products'

import { APPEARANCE } from '../../appearance';
import { Button } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 330, m: 1, ml: 0 }
const smallItemStyle = { width: 161, m: 1, ml: 0 }
const labelStyle1 = { m: 0, mt: 1, ml: 0, mr: 4 }
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, m: 1 }
const outboxStyle = { margin: "80px auto 20px auto", padding: "0 10px" }
const findBoxStyle = { width: "calc(100% - 80px)" }
const findTextStyle = { width: "100%", border: "none" }
//const findTextStyle = { width: "100%", border: "none", border: "solid 1px #888", borderRadius: 1 }
const toolButtonStyle = { width: "26px", height: "26px", marginTop: "5px" }
const flexStyle = { display: "flex", flexDirection: "row", alignItems : "center", justifyContent: "space-between" }

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
    
    const [addItemName, setAddItemName] = useState("")
    const [addRefNo, setAddRefNo] = useState("")
    const [addArtNo, setAddArtNo] = useState("")
    const [addDesign, setAddDesign] = useState("")

    const [savingError, setSavingError] = useState(false)
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }

    const handleShowHideFilter = (event) => {
      setFilter(!filter);
    };

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

      axios.get(config.api + '/Products/Products?id='+props.user.id, 
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

   const handleAddProductShow = (event) => {
    setAddProduct(true)
  };

  const handleAddProductSave = (event) => {
    saveProduct()
    setAddProduct(false)
  };

  const handleAddProductCancel = (event) => {
    setAddProduct(false);
  };

    const url = require('url');

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
      //const params = new URLSearchParams();
      //params.append(color, [1,2]);

      //const params = new url.URLSearchParams({ foo: 'bar' });      

      axios.get(config.api + '/Products/Products?id='+props.user.id, 
        { params: 
            { 
              name: itemName,
              artno: artNo,
              refno: refNo,
              design: design,
              colors: JSON.stringify(color),
              seasons: JSON.stringify(season),
              overworks: JSON.stringify(overworkType),
              designtypes: JSON.stringify(designType),
              search: search
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
        
    const saveProduct = async (e) => {
    
      let vendorId = props.user ? props.user.vendorId : -1;
  /*
    const [addItemName, setAddItemName] = useState("")
    const [addRefNo, setAddRefNo] = useState("")
    const [addArtNo, setAddArtNo] = useState("")
    const [addDesign, setAddDesign] = useState("")

  */
      let prod = {
        vendorId: vendorId,
        artNo: addArtNo,
        itemName: addItemName,
        design: addDesign,
        refNo: addRefNo,
      }
  
      let r = await postProduct(prod, "ProductAdd")
  
      if (r && r.status == true) {
        props.setLastAction("Product has been added")
        setSavingError(false)
        navigate("/updateproduct?id=" + r.id)
      } else {
        setSavingError(true)
      }
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
  
  
    }, []);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
  console.log(colors)
  console.log(colors.map((it) => ({ key: it.id, name: it.colorName })))

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

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
          printTypes={printTypes} />

        <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" >
          <Box sx={{ display: "flex", flexDirection: "column", width: 270 }}  >
             <CheckboxList list={colors.map((it) => ({ key: it.id, name: it.value }))}  title="Colours" height={310} expanded={true} />
             <CheckboxList list={seasons.map((it) => ({ key: it.id, name: it.value }))}  title="Seasons" height={120} expanded={true} />
             <CheckboxList list={designTypes.map((it) => ({ key: it.id, name: it.value }))}  title="Design types" expanded={true} />
             <CheckboxList list={printTypes.map((it) => ({ key: it.id, name: it.value }))}  title="Print types" expanded={true} />
             <CheckboxList list={productTypes.map((it) => ({ key: it.id, name: it.value }))}  title="Product types" height={80} expanded={true} />
          </Box>

          <Box sx={{ padding: "10px" }} >
          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
          <Grid container spacing={0} >
            { view === "grid" && products.map((data, index) => (
            <Grid item xs={12} md={4} key={"itemprod-"+index} >
              <ItemProduct data={data} index={index} />
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

        <Footer sx={{ mt: 2, mb: 2 }} />
              
    </ThemeProvider>
  );
}
