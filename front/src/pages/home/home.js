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
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

import TextField from '@mui/material/TextField';
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
import PropertyItem from '../../components/propertyitem';
import PropertyAmount from '../../components/propertyamount';
import { addShoppingCart, getShoppingCart, setShoppingCart } from '../../functions/shoppingcart';
import { computePrice } from '../../functions/helper';
import QuantityInput from '../../components/quantityinput';
import { postProduct } from '../../api/products'
import { postOrder } from '../../api/orders'
import { v4 as uuid } from 'uuid'

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
const textStyle = { m: 0, mb: 2 }

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

    const [clientAddress, setClientAddress] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientEmail, setClientEmail] = useState("")

    const [orderError, setOrderError] = useState(false)
    const [savingError, setSavingError] = useState(false)
    const [showQuickView, setShowQuickView] = React.useState(false);
    const [quickViewProduct, setQuickViewProduct] = React.useState({ colors: [{ imagePath: [''] }]});

    const [showShoppingCart, setShowShoppingCart] = React.useState(false);
    const [showInfo, setShowInfo] = React.useState(false);
    const [info, setInfo] = React.useState("");

    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }
    // store thumbs swiper instance
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const [cartAmount, setCartAmount] = useState(1)
    const [addToCartFunction, setAddToCartFunction] = useState("Add to Cart")
    //const [cart, setCart] = useState(props.cart);

    const handleShowHideFilter = (event) => {
      setFilter(!filter);
    };

    /*useEffect(() => {
      localStorage.setItem('shoppingCart', shoppingCart);
    }, [shoppingCart]);*/

    const matches_md = useMediaQuery(theme.breakpoints.up('md'));

    const cartImageSize = matches_md ? "60px" : "90px";

    const modalSx = matches_md ? {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "800px",
      boxShadow: 24,
      padding: "20px 40px 40px 40px", 
      outline: "none",
      bgcolor: 'background.paper',
    } : {
      width: "calc(100vw - 60px)",
      boxShadow: 24,
      padding: "10px 10px 10px 10px", 
      margin: "0 auto",
      outline: "none",
      bgcolor: 'background.paper',
    }; 

    const setOrderAmount = (productId, value) => {

      let cart = [...getShoppingCart()]
      let i=0
      for(i=0; i<cart.length; i++) {
        if (cart[i].product.id == productId) {
          cart[i].amount = value
          break
        }
      }
      //setShoppingCart(cart)
      props.updateCart(cart)
    }

    const deleteFromCart = (productId, amount) => {

      let cart = [...getShoppingCart()]
      let i=0
      let ix=-1
      for(i=0; i<cart.length; i++) {
        if (cart[i].product.id == productId && cart[i].amount == amount) {
          ix=i
          break
        }
      }
      if (i!=-1) {
        cart.splice(ix, 1);
      }
      //setShoppingCart(cart)
      props.updateCart(cart)
    }



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
    setShowShoppingCart(event)
    setAddToCartFunction("Add to Cart");
   }

   const handleAddProductShow = (event) => {
    setAddProduct(true)
  };

  const handleAddProductSave = (event) => {
    saveProduct()
    setAddProduct(false)
  };

  const handleMakeOrder = async (event) => {

    if (!clientAddress || !clientEmail || !clientName || !clientPhone) {
      setOrderError(true)
      return
    }

    let items = props.cart.map( (it) => { return {
      productId: it.product.id,
      quantity: it.amount,
      itemName: it.product.itemName,
      refNo: it.product.refNo,
      artNo: it.product.artNo,
      design: it.product.design,
      price: (it.amount > 500 ? it.product.price : ( it.amount > 300 ? it.product.price1 : it.product.price2 ))
    }} )

    let order = {
      uuid : uuid(),
      clientName : clientName,
      clientPhone : clientPhone,
      clientEmail : clientEmail,
      clientAddress : clientAddress,
      items : items
    }

    let r = await postOrder(order)

    if (r && r.ok == true) {
      //props.setLastAction("Order has been created")
      setOrderError(false)
      setShowShoppingCart(false)
      setShowInfo(true)
      setInfo("Your order has been successfully created. Please check the email address you provided when placing your order.")
      props.updateCart([])
      //navigate("/updateproduct?id=" + r.id)
    } else {
      setOrderError(true)
    }
  }

  const handleAddToCart = (event) => {
    props.addToCart({
      product: quickViewProduct,
      amount: cartAmount
    })

    setAddToCartFunction("Open cart")
    /*addShoppingCart({
      product: quickViewProduct,
      amount: cartAmount
    })*/
    /*let cart = getShoppingCart()
    cart.push(item)
    setShoppingCart(cart)*/
  };

  const handleOpenCart = (event) => {
    setShowQuickView(false)
    setShowShoppingCart(true)
    setAddToCartFunction("Add to Cart")
  }

  const handleRemoveFromCart = (id) => {
    props.removeFromCart(id)
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
          //console.log(result.data)
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
      setAddToCartFunction("Add to Cart")
    }

    const setAmount = (productId, amount) => {
      let changed = false
      for(let i=0; i<props.cart.length; i++) {
        if (props.cart[i].product.id == productId) {
          props.cart[i].amount = parseInt(amount)
          changed = true
          break
        }
      }
      if (changed === true) {
        //console.log('update amount:')
        //console.log(props.cart)
        props.updateCart(props.cart)
      }
    }

    const setRolls = (productId, isRolls) => {
      let changed = false
      for(let i=0; i<props.cart.length; i++) {
        if (props.cart[i].product.id == productId) {
          props.cart[i].isRolls = isRolls
          changed = true
          break
        }
      }
      if (changed === true) {
        console.log('setRolls:')
        console.log(props.cart)
        props.updateCart(props.cart)
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
      //console.log('use effect:' + selectedSeason)
    }, [selectedSeason, selectedColor, selectedDesignType, selectedPrintType, selectedProductType, selectedTextileType]);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }
  //console.log(products)// matches_sm)
  console.log('props.cart:')
  console.log(props.cart)


  const productImgHolderClass = matches_md ? "product-img-holder" : "product-img-holder-mobile";

  // useEffect(() => {
  //   const items = JSON.parse(localStorage.getItem('items'));
  //   if (items) {
  //    setItems(items);
  //   }
  // }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      {/* Quick view modal */}
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
          margin: (matches_md ? "" : "-50px -10px" ),
          height: (matches_md ? "auto" : "calc(100% + 50px)"),
          width: (matches_md ? "890px" : "330px"),
          //width: "330px",
          boxShadow: 24,
          padding: matches_md ? "20px 20px 20px 20px" : "20px 20px 5px 5px",
          outline: "none",
          bgcolor: 'background.paper',
          display: "flex",
          flexDirection: 'row',
          alignItems: 'center', justifyContent: "right" }}>
        {/* <Typography>Modal title</Typography> */}
        <IconButton
           sx={{ position: "absolute", top: 6, mr: matches_md ? -2 : 1, zIndex: 100, backgroundColor: "#ddd" }}
           onClick={() => { setShowQuickView(false) }}>
            <CloseIcon />
        </IconButton>

        <Grid container spacing={0} >
          <Grid item xs={12} md={5} sx={{paddingLeft:"0px"}} >
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
                    <Box className={productImgHolderClass} >
                      <Box component={"img"} key={"product-swiper-00"}
                        src={config.api + "/" + cv.imagePath[0]}
                        alt={"photo_00"} className="product-img"
                        sx={{
                          borderRadius: (matches_md ? 0 : "0")
                        }}
                        />
                      </Box>
                   </SwiperSlide>
                   </Box>
                })}
                </Swiper>
          </Grid>
          <Grid item xs={12} md={7} paddingLeft={{ xs: "0", md: "10px"}} paddingTop={{ xs: "10px", md: "0"}}>
          <Box sx = {{ display: "flex",flexDirection: 'column', p: 1}} className="product-item" >
          <table >
                <tr><td class="label" style={ matches_md ? {width: "130px"} : {}} >Item name:</td><td>{quickViewProduct.itemName}</td></tr>
                <tr><td class="label">Art No:</td><td>{quickViewProduct.artNo}</td></tr>
                <tr><td class="label">Ref No:</td><td>{quickViewProduct.refNo}</td></tr>
                <tr><td class="label">Design:</td><td>{quickViewProduct.design}</td></tr>
                <tr><td class="label">Composition:</td><td>{quickViewProduct.composition}</td></tr>
                <tr><td class="label">Product type:</td><td>{quickViewProduct.productType}</td></tr>
                <tr><td class="label">Product style:</td><td>{quickViewProduct.productStyle}</td></tr>
                <tr><td class="label">Print style:</td><td>{quickViewProduct.printType}</td></tr>
                <tr><td class="label"> { matches_md ? "Price per meter" : "Price PM" }:</td><td><b>from&nbsp;{quickViewProduct.price}$</b></td></tr>
              </table>
                  <Box sx={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    className:"quantity",
                    mt: 2 }}>
                      <QuantityInput 
                        step={1} 
                        onChange={(e,v)=>{ setCartAmount(v)}} 
                        />
                      <Button
                          variant="contained"
                          startIcon={<ShoppingCartOutlinedIcon/>}
                          // sx={{...roundButtonStyle, ...{ml: 3}}}
                          className="add-to-cart-button"
                          onClick={ (e) => { addToCartFunction=="Add to Cart" ? handleAddToCart(e) : handleOpenCart(e) } } 
                          sx={ matches_md ? {ml: 4} : {ml: 1,p:1,pl:2,pr:2}} >
                              {addToCartFunction}
                      </Button>
                  </Box>
          </Box>
          </Grid>
        </Grid>
        </Box>
      </Modal>

      {/* Shopping cart modal */}
      <Modal
        open={showShoppingCart}
        onClose={function() { setShowShoppingCart(false); }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="shoppingCartModal"
        sx={{ width: (matches_md ? "auto":"auto"), outline: "none", overflow: "scroll", p: 0 }} >

        <Box sx={{...modalSx, ...{borderRadius: "10px"}}} >
        { matches_md && 
        <Box sx={{display: "flex", height: "60px", pt: 1}}>
          <Typography sx={{fontSize: "18px", fontWeight: 600, color: "#333", p:0, pb: 2, flexGrow: 1}}>
            Your shopping cart:&nbsp;{props.cart.length}&nbsp;items
          </Typography>
          {/* <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#333", p:0, pb: 2}}>
            Total:&nbsp;{props.cart.length}&nbsp;items
          </Typography> */}
        </Box>}
        {!matches_md && <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#18515E", p:0, pb: 2}}><span style={{color: "#008"}} >{props.cart.length}&nbsp;items</span>&nbsp;in your shopping cart</Typography>}
      <Box>
      {(!matches_md &&
        (props.cart.map((data, index) => (
      <Card sx={{margin: "10px 0", padding: "10px"}} >
      <CardMedia
        component="img"
        alt="Fabric photo"
        sx={{  maxWidth: cartImageSize, maxHeight: cartImageSize, float: "left" }}
        image={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
      />
      <CardContent sx={{ 
                    width: (matches_md ? "" : "calc(100% - 100px)"), 
                    float: (matches_md ? "none" : "left"), p:0, pl: 2, '&:last-child': { pb: 0 } }} >
        <Typography 
          gutterBottom 
          variant={matches_md ? "h6" : "p"} 
          sx={{ fontSize: (matches_md ? "18px":"14px") }}
          component="div">
        {data.product.itemName}
        </Typography>
        <Box sx={{ color: "#222", padding: (matches_md ? "0px":"0px"), fontSize: (matches_md ? "18px":"14px") }}>
        <table>
          <tr><td>Art.No:</td><td>&nbsp;&nbsp;{data.product.artNo}</td></tr>
          {matches_md && <tr><td>Design:</td><td>&nbsp;&nbsp;{data.product.design}</td></tr> }
          <tr><td>Price:</td><td>&nbsp;&nbsp;{ (data.amount > 500 ? data.product.price : ( data.amount > 300 ? data.product.price1 : data.product.price2 ))} $</td></tr>
          <tr></tr>
          </table>
          <table style={{width: "100%"}}>
            <tr>
            <td><QuantityInput step={1} onChange={(e,v)=>{ setOrderAmount(data.product.id,v)}} defaultValue={data.amount} /> </td>
          <td style={{ textAlign:"right" }}>
            <IconButton aria-label="delete" size="large" >
              <DeleteIcon onClick={(e)=>{deleteFromCart(data.product.id,data.amount)}} />
            </IconButton>
            </td>
          </tr>
          </table>
        
        </Box>
      </CardContent>
      {/* <CardActions>
        <Button size="small">Share</Button>
        <Button size="small">Learn More</Button>
      </CardActions> */}
    </Card>
        ))
      ))}

      {(matches_md &&
        <table class="shopping-cart" cellPadding={0} cellSpacing={0}>
        <tbody>
        {props.cart.map((data, index) => (
          <tr style={{ height : "100px"}}>
            <td >
              <img 
                src={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
                alt={"photo_00"}
                style={{ borderRadius: "6px" }} />
            </td>
            <td style={{wordBreak: "break-all", paddingLeft: "10px"}}>
              <table cellPadding={0} cellSpacing={0}>
                <tbody>
                  {/* <tr><td><span class="item-label">Item name:</span></td><td>{data.product.itemName}</td></tr>
                  <tr><td><span class="item-label">Design:</span></td><td>{data.product.design}</td></tr> */}
                  <PropertyItem maxWidth={200} label="Item name" value={data.product.itemName} />
                  <PropertyItem maxWidth={200} label="Design" value={data.product.design} />
                  <PropertyItem maxWidth={200} label="Composition" value={data.product.composition} />
                  {/* <tr><td><span class="item-label">Composition:</span></td><td><span className="text-overflow-ellipsis" style={{maxWidth: "200px"}} title={data.product.composition}>{data.product.composition}</span></td></tr>  */}
                </tbody>
              </table>
            {/* <Tooltip title={"art." + data.product.artNo + " ref." + data.product.refNo}>
              {data.product.itemName}&nbsp;-&nbsp;
              {data.product.design}
            </Tooltip> */}
            </td>
            <td>
            <table>
                <tbody>
                  {/* <tr><td><span class="item-label">Price:</span></td><td style={{textAlign: "left", paddingLeft: "14px"}}>{computePrice(data.product)} $</td></tr> */}
                  <PropertyItem maxWidth={200} label="Price" value={computePrice(data.product, data.amount) + " $"} />
                  <PropertyAmount maxWidth={200} label="Amount" product={data.product} amount={data.amount} isRolls={data.isRolls} setAmount={setAmount} setRolls={setRolls} />
                  {/* <tr><td><span class="item-label">Amount:</span></td>
                      <td>
                      <TextField
                        margin="normal"
                        size="small" 
                        id={"valuequantity2-" + props.index}
                        name={"valuequantity2-" + props.index}
                        sx = {{ width: 60, mt: '-3px', ml: 0, mr: 0, mb: '-3px' }}
                        value={data.amount}
                        onChange={ev => setOrderAmount(data.product.id, ev.target.value)}
                        inputProps={{
                          style: {
                            height: "10px",
                          },
                        }}
                      />
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={data.product.orderRolls===true? "roll":"m" }
                        label="Unit"
                        // onChange={handleChange}
                        sx={{ height: "27px", ml: 1, mt: '-3px', mb: '-3px' }} >
                        <MenuItem value={'meters'}>m</MenuItem>
                        <MenuItem value={'rolls'}>roll</MenuItem>
                      </Select>
                      </td>
                  </tr> */}
                  <tr><td><span class="item-label">&nbsp;</span></td><td>&nbsp;</td></tr>
                </tbody>
              </table>
              </td>
              <td>
            <table>
                <tbody>
                  <tr><td><span class="item-label">&nbsp;</span></td><td>&nbsp;</td></tr>
                  <tr><td><span class="item-label">&nbsp;</span></td><td>&nbsp;</td></tr>
                  <tr><td><span class="item-label">&nbsp;</span></td><td>&nbsp;</td></tr>
                </tbody>
              </table>
              </td>
            {/* <td><QuantityInput step={1} onChange={(e,v)=>{ setOrderAmount(data.product.id,v)}} defaultValue={data.amount} /> </td> */}
            <td>
            <IconButton aria-label="delete">
              <DeleteIcon 
                sx={{ color: "#18515E", fontSize: 26 }}
                onClick={(e)=>{deleteFromCart(data.product.id,data.amount)}} >
              </DeleteIcon>
            </IconButton> 
            </td>
            </tr>
            ))}
          </tbody>
        </table>)}
        
        </Box>
        <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#333", p:0, pb: 2, pt: 2}}> Delivery information </Typography>
        <Grid container spacing={1} >
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientName"
                  name="clientName"
                  label="Client name"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientName}
                  onChange={ev => setClientName(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientPhone"
                  name="clientPhone"
                  label="Client phone"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientPhone}
                  onChange={ev => setClientPhone(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientEmail"
                  name="clientEmail"
                  label="Client email"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientEmail}
                  onChange={ev => setClientEmail(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={12} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientAddress"
                  name="clientAddress"
                  label="Client address"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientAddress}
                  onChange={ev => setClientAddress(ev.target.value) }
                />
          </Grid>
        </Grid>

        { orderError &&
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> }

        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
        <Button
            variant="contained"
            //sx={{...roundButtonStyle, ...{ml: 3}}}
            className="add-to-cart-button"
            onClick={handleMakeOrder} >
                Make order
        </Button>
        <Button
            variant="contained"
            //sx={{...roundButtonStyle, ...{ml: 3}}}
            className="add-to-cart-button"
            sx={{ml: 1}}
            onClick={() => {
              setShowShoppingCart(false);
              }}>
                Close
        </Button>
        </Box>
        </Box>
      </Modal>

      {/* Show info modal */}
      <Modal
        open={showInfo}
        onClose={function() { setShowInfo(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto", outline: "none" }} >

        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: (matches_md ? "330px" : "330px"),
          //width: "330px",
          boxShadow: 24,
          padding: "45px 40px 40px 40px",
          outline: "none",
          bgcolor: 'background.paper',
           }}>
        {/* <Typography>Modal title</Typography> */}
        <Box sx={{ width: "100%", textAlign:"right", pr: 3, pb: 2 }} >
        <IconButton
           sx={{ position: "absolute", top: 6, mr: 0 }}
           onClick={() => { setShowInfo(false) }}>
            <CloseIcon />
        </IconButton>
        </Box>
        <Typography sx={{fontSize: "16px", color: "#333" , textAlign: "center" }}>{info}</Typography>
        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "center", pt: 3}}>
        <Button
            variant="contained"
            onClick={(e) => { setShowInfo(false) }} >
                Close
        </Button>
        </Box>

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
          cart={props.cart}
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

        <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
