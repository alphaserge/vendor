import React, { useState, useEffect } from "react";
import { json, useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import TuneIcon from '@mui/icons-material/Tune';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios'

import config from "../../config.json"

import Header from './header';
import Footer from './footer';
import MainBanner from './mainbanner';
import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import MySelect from '../../components/myselect';

import { clear } from "@testing-library/user-event/dist/clear";

import { APPEARANCE } from '../../appearance';
import { Button } from "@mui/material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 330, m: 1, ml: 0 }
const itemStyle1 = { width: "100%", mt: 0, ml: 0, mr: 0 }
const labelStyle = { m: 2 }
const labelStyle1 = { m: 0, mt: 1, ml: 0, mr: 4 }
const buttonStyle = { width: 180, m: 2 }
const accordionSummaryStyle = { maxWidth: "744px", margin: "0 auto 20px auto", padding: "0 10px" }
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

export default function ListProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")

    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
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

    const headStyle = { maxWidth: "744px", margin: "0 auto", padding: "0 10px" }

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
        console.log('Addproduct loadColors error:' )
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
        console.log('Addproduct loadSeasons error:' )
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
        console.log('Addproduct loadDesignTypes error:' )
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
        console.log('Addproduct loadDesignTypes error:' )
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
        console.log('Addproduct loadProductTypes error:' )
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
        console.log('Addproduct loadProductStyles error:' )
        console.log(error)
      })
    }
        

    useEffect(() => {
      loadProducts()
      loadColors()
      loadSeasons()
      loadDesignTypes()
      loadOverworkTypes()
      loadProductTypes()
      loadProductStyles()
    }, []);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
    
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container sx={{padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
          {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography> */}

          

          <Box component="form" noValidate sx={accordionSummaryStyle} >

          <Box style={headStyle} sx={{ display: "flex", justifyContent:"space-between",  margin: "0 auto", maxWidth: "1100px", backgroundColor: "#e4e4e4", textTransform: "none", border: "1px #ddd solid", borderRadius: "4px"}} justifyContent={"center"} className="header-menu" >
            <Tooltip title="Rows interface">
            <IconButton onClick={ (e) => { setView("rows")} } sx={{ p: 0, ml: 2 }}>
              <TableRowsIcon sx={{color: view=="grid" ? APPEARANCE.BLACK : APPEARANCE.GREY }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Grid interface">
            <IconButton onClick={ (e) => { setView("grid")} } sx={{ p: 0, ml: 1 }}>
              <GridViewIcon sx={{color: view=="grid" ? APPEARANCE.GREY : APPEARANCE.BLACK }} />
            </IconButton>
            </Tooltip>
            <Box sx={{ display: "flex", alignItems:"center", justifyContent: "center", width: "100%", mt: 2, mb: 2}}>
            <Typography component="h7" variant="h7" color={APPEARANCE.COLOR1}>
              {props.user && ( props.user.vendorName + " product's list") } 
            </Typography>
            </Box>
            <IconButton onClick={handleShowHideFilter} sx={{ p: 0, mr: 4 }}>
              <TuneIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
          </Box>

          <Box style={headStyle} sx={{ display: "flex", justifyContent:"space-between",  margin: "0 auto", maxWidth: "1100px"}} justifyContent={"center"} className="header-menu" >
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                label="Find products - art, ref, design, item name .."
                name="search"
                sx={{ flex: 2 }}
                value={search}
                onChange={ev => searchProducts(ev.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment>
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
          </Box>

          <Box sx={{ backgroundColor: "none", display: filter==true? "block": "none", textAlign: "center", mt: 3, mb: 3  }} className="filter" >
          <Box className="filter" sx={{ textAlign: "left"}} >
          <Typography component="p" variant="p" sx={{ mb: 2, fontSize: "10pt", fontWeight: "bold"}} >
              Product's filters
            </Typography>
            <Grid container spacing={1} >
            <Grid item xs={12} md={6} sx={{...flexStyle}} >
          <TextField
                margin="normal"
                size="small" 
                id="itemName"
                label="Item name"
                name="itemName"
                sx = {itemStyle}
                value={itemName}
                onChange={ev => setItemName(ev.target.value)}
              />
              </Grid>
            <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="refNo"
                label="Ref No"
                name="refNo"
                sx = {itemStyle}
                value={refNo}
                onChange={ev => setRefNo(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="artNo"
                label="Art No"
                name="artNo"
                sx = {itemStyle}
                value={artNo}
                onChange={ev => setArtNo(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="design"
                label="Design"
                name="design"
                sx = {itemStyle}
                value={design}
                onChange={ev => setDesign(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-producttype"
                  url="ProductTypes"
                  title="Product Type"
                  valueName="typeName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={productType}
                  setValueFn={setProductType}
                  data={productTypes}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Product Style"
                  valueName="styleName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={productStyle}
                  setValueFn={setProductStyle}
                  data={productStyles}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-season"
                  url="Seasons"
                  title="Season"
                  valueName="seasonName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={season}
                  setValueFn={setSeason}
                  data={seasons}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-color"
                  url="Colors"
                  title="Color"
                  valueName="colorName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={color}
                  setValueFn={setColor}
                  data={colors}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >  
                <MySelect 
                  id="addproduct-designtype"
                  url="DesignTypes"
                  title="Design type"
                  valueName="designName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={designType}
                  setValueFn={setDesignType}
                  data={designTypes}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-overworktype"
                  url="OverWorkTypes"
                  title="Overwork type"
                  valueName="overWorkName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={overworkType}
                  setValueFn={setOverworkType}
                  data={overworkTypes}
                />
                </Grid>

              </Grid>

          </Box>
                <Button variant="contained" className="action-button" onClick={loadProducts} >
                  Apply
                </Button>
                <Button variant="outlined" className="clear-button" onClick={clearFilter} sx={{ml:2}} >
                  Clear
                </Button>
          </Box>

          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
          <Grid container spacing={2} >
            { view == "grid" && products.map((data, index) => (
            <Grid item xs={12} md={6} >
              <ItemProduct data={data} index={index} />
              </Grid>
            ))}
            { view == "rows" && products.map((data, index) => (
            <Grid item xs={12} md={12} >
              <ItemProductRow data={data} index={index} />
              </Grid>
            ))}
          </Grid>

          </Box>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
