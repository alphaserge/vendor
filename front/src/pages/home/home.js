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
//import CloseIcon from '@material-ui/icons/Close'
//import  from '@mui/icons-material/Close';
import CloseIcon from '@mui/icons-material/Close';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import InputAdornment from '@mui/material/InputAdornment';

import TextField from '@mui/material/TextField';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';

import useMediaQuery from '@mui/material/useMediaQuery';

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

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

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

    const [selectedTextileType, setSelectedTextileType] = useState([])
    const [selectedDesignType, setSelectedDesignType] = useState([])
    const [selectedSeason, setSelectedSeason] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedPrintType, setSelectedPrintType] = useState([])
    const [selectedProductType, setSelectedProductType] = useState([])
    const [selectedOverworkType, setSelectedOverworkType] = useState([])

    const [filterTextileType, setFilterTextileType] = useState([])
    const [filterDesignType, setFilterDesignType] = useState([])
    const [filterSeason, setFilterSeason] = useState([])
    const [filterColor, setFilterColor] = useState([])
    const [filterPrintType, setFilterPrintType] = useState([])
    const [filterProductType, setFilterProductType] = useState([])

    const [addItemName, setAddItemName] = useState("")
    const [addRefNo, setAddRefNo] = useState("")
    const [addArtNo, setAddArtNo] = useState("")
    const [addDesign, setAddDesign] = useState("")

    const [savingError, setSavingError] = useState(false)
    const [showQuickView, setShowQuickView] = React.useState(false);
    const [quickViewProduct, setQuickViewProduct] = React.useState({ colors: [{ imagePath: [''] }]});
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }
    // store thumbs swiper instance
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const handleShowHideFilter = (event) => {
      setFilter(!filter);
    };

    const matches_sm = useMediaQuery(theme.breakpoints.up('md'));

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
          console.log(result.data)
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


    const quickView = (e, data) => {
      setShowQuickView(true)
      setQuickViewProduct(data)
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
  console.log(products)// matches_sm)
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />


      <Modal
        open={showQuickView}
        onClose={function() { setAddProduct(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto", outline: "none" }} >
      
        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: (matches_sm ? "890px" : "330px"), 
          //width: "330px", 
          boxShadow: 24,
          padding: "20px 20px 20px 20px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: 'row', 
          alignItems: 'center', justifyContent: "right" }}>
        {/* <Typography>Modal title</Typography> */}
        <IconButton
           sx={{ position: "absolute", top: 6  }}
           onClick={() => { setShowQuickView(false) }}>
            <CloseIcon />
        </IconButton>

        <Grid container spacing={2} >
          <Grid item xs={12} md={6} >
          <Swiper 
                className="swiper" 
                modules={[Thumbs, Navigation, Pagination,]} // Navigation, Pagination, Scrollbar, A11y]}
                /*slidesPerView={1}
                //navigation */
                thumbs={{ swiper: thumbsSwiper }}
                //watchSlidesProgress
                //onSwiper={setThumbsSwiper}
                //onSwiper={(swiper) => console.log(swiper)}
                //pagination={{ clickable: true }}
                //scrollbar={{ draggable: true }}
                
                onSlideChange={() => console.log('slide change')} >
                  {quickViewProduct.colors.map((cv, index) => {
                   return <Box key={"product-box-00"} >
                   <SwiperSlide key={"product-swiper-00"} sx={{ display: "flex", justifyContent: "center" }} >
                    <Box className="product-img-holder" ><Box component={"img"} key={"product-swiper-00"} 
                    src={config.api + "/" + cv.imagePath[0]} 
                    alt={"photo_00"} className="product-img" /></Box>
                   </SwiperSlide></Box>
                })}
                </Swiper>
          </Grid>
          <Grid item xs={12} md={6} >
          <Box sx = {{ display: "flex",flexDirection: 'column'}} >
              <div class="product-item">{quickViewProduct.itemName}</div>
              <div class="product-item">{quickViewProduct.artNo}</div>
              <div class="product-item">{quickViewProduct.refNo}</div>
              <div class="product-item">{quickViewProduct.design}</div>
              <div class="product-item">{quickViewProduct.composition}</div>
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
          </Grid>
        </Grid>
        </Box>
      </Modal>


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
          setSeason       = {(v)=>{ dropFilters(); setSelectedSeason(v)}}
          setTextileType  = {(v)=>{ dropFilters(); setSelectedTextileType(v)}}  
          setDesignType   = {(v)=>{ dropFilters(); setSelectedDesignType(v)}} 
          setColor        = {(v)=>{ dropFilters(); setSelectedColor(v)}} 
          setPrintType    = {(v)=>{ dropFilters(); setSelectedPrintType(v)}} 
          setOverworkType = {(v)=>{ dropFilters(); setSelectedOverworkType(v)}}
          />

        <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" >
          <Box sx={{ display: "flex", flexDirection: "column", width: 270 }}  >
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
          <Grid container spacing={1} >
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

        <Footer sx={{ mt: 2, mb: 2 }} />
              
    </ThemeProvider>
  );
}
