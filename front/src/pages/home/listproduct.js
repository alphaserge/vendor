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

import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import MySelect from '../../components/myselect';
import { postProduct } from '../../api/products'

import { APPEARANCE } from '../../appearance';
import { Button } from "@mui/material";
import MainSection from "./mainsection";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 330, m: 1, ml: 0 }
const smallItemStyle = { width: 161, m: 1, ml: 0 }
const labelStyle1 = { m: 0, mt: 1, ml: 0, mr: 4 }
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, m: 1 }
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
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


export default function ListProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [addProduct, setAddProduct] = useState(false)
    
    const [colors, setColors] = useState([])
    //const [seasons, setSeasons] = useState([])
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

      if (getFromUrl("new")==1) {
        setAddProduct(true)
      }
  
  
    }, []);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
    
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Modal
        open={addProduct}
        onClose={function() { setAddProduct(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto"}} >

        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: "auto", 
          bgcolor: 'background.paper', 
          border: '2px solid #000', 
          boxShadow: 24, 
          p: 4,
          display: "flex",
          flexDirection: 'column', 
          alignItems: 'left' }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: "center"}} >
            Adding a new product
          </Typography>

          {/* General */}
            <TextField
                margin="normal"
                size="small" 
                id="itemName"
                label="Item name"
                name="itemName"
                sx = {itemStyle}
                value={addItemName}
                onChange={ev => setAddItemName(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="design"
                label="Design"
                name="design"
                sx = {itemStyle}
                value={addDesign}
                onChange={ev => setAddDesign(ev.target.value)}
              />
              <Box sx={{ 
                display: "flex",
                flexDirection: 'row', 
                alignItems: 'left' }}>
                <TextField
                    margin="normal"
                    size="small" 
                    id="refNo"
                    label="Ref No"
                    name="refNo"
                    value={addRefNo}
                    sx = {smallItemStyle}
                    onChange={ev => setAddRefNo(ev.target.value)}
                  />
                <TextField
                    margin="normal"
                    size="small" 
                    id="artNo"
                    label="Art No"
                    name="artNo"
                    sx = {smallItemStyle}
                    value={addArtNo}
                    onChange={ev => setAddArtNo(ev.target.value)}
                  />
                  </Box>

                  { savingError && 
                    <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
                    An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
                    </Box> }

                  <Box sx={{ 
                    display: "flex",
                    flexDirection: 'row', 
                    justifyContent: 'center' }}>
                      <Button 
                          variant="contained"
                          style={buttonStyle}
                          sx={buttonStyle}
                          onClick={handleAddProductSave} >
                              Next
                      </Button>
                      <Button 
                          variant="contained"
                          sx={buttonStyle}
                          onClick={handleAddProductCancel} >
                              Cancel
                      </Button>
                  </Box>
        </Box>
      </Modal>

      <Container sx={{padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        <MainSection user={props.user} title={props.title} />
        <div>
        
          <Box component="form" noValidate style={outboxStyle}>

          <Box style={headStyle} sx={{ display: "flex", justifyContent:"left", margin: "0", alignItems: "center" }}  >
            <Tooltip title="Rows interface">
            <IconButton onClick={ (e) => { setView("rows")} } style={toolButtonStyle} sx={{mr: 0}} >
              <TableRowsIcon sx={{color: view=="grid" ? APPEARANCE.BLACK : APPEARANCE.GREY }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Grid interface">
            <IconButton onClick={ (e) => { setView("grid")} } style={toolButtonStyle} sx={{mr: 1}} >
              <GridViewIcon sx={{color: view=="grid" ? APPEARANCE.GREY : APPEARANCE.BLACK }} />
            </IconButton>
            </Tooltip>
            {/* <Box sx={{ display: "flex", alignItems:"center", justifyContent: "center", width: "100%", mt: 2, mb: 2}}>
            <Typography component="h7" variant="h7" color={APPEARANCE.COLOR1} sx={{fontWeight: "bold"}} >
              {props.user && ( "Products") } 
            </Typography>
            </Box> */}
          <Box style={findBoxStyle}>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                label="Find products"
                name="search"
                style = {findTextStyle}
                sx={{borderRadius: "0"}}
                value={search}
                onChange={ev => searchProducts(ev.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
          </Box>

            <Tooltip title="Filters">
            <IconButton onClick={handleShowHideFilter} style={toolButtonStyle} sx={{mr: 1, ml: 1}} >
              <TuneIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
            </Tooltip>

            <Button
              variant="text"
               startIcon={<AddCircleOutlineIcon sx={{color: APPEARANCE.BLACK}} />}
               sx={{ backgroundColor: "#fff", color: APPEARANCE.BLACK, textTransform: "none", width: "140px", height: "26px", marginTop: "5px" }}
               onClick={handleAddProductShow}>
               Add product
            </Button>

            {/* <Tooltip title="Add a new product">
            <IconButton onClick={handleAddProductShow} style={toolButtonStyle} sx={{mr: 1}} >
              <AddCircleOutlineIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
            </Tooltip> */}

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
                  data={props.productTypes}
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
                  data={props.productStyles}
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
                  data={props.seasons}
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
                  data={props.colors}
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
                  data={props.designTypes}
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
                  data={props.overworkTypes}
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
            { view === "grid" && products.map((data, index) => (
            <Grid item xs={12} md={6} key={"itemprod-"+index} >
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
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
