import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Thumbs } from 'swiper/modules';

import axios from 'axios'

import config from "../../config.json"

import Header from './header';
import Footer from './footer';

import MainSection from './mainsection';
import ShoppingCart from '../../components/shoppingcart';

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../../store/cartSlice' 
import PropertyQuantity from "../../components/propertyquantity";
import PropertyItem from '../../components/propertyitem';
import ItemName from '../../components/itemname';

import { fined } from "../../functions/helper"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';


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

export default function Product(props) {

    const cartCount = useSelector((state) => state.cart.items.length)
    const shopCart = useSelector((state) => state.cart.items)

    const navigate = useNavigate();
    const theme = useTheme();

    const [product, setProduct] = useState({colors: []})
    const [info, setInfo] = React.useState("");

    const [cartQuantity, setCartQuantity] = useState(1)
    const [cartIsRolls, setCartIsRolls] = useState(false)
    const [cartHelp, setCartHelp] = useState(false)

    // store thumbs swiper instance
    const [thumbsSwiper, setThumbsSwiper] = useState(null);
    
    const shoppingCartRef = useRef()

    const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
   }

    const dispatch = useDispatch();

    const _addToCart = () => {
      dispatch(addToCart({ product, cartQuantity, cartIsRolls }));
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
      _addToCart();
      setCartQuantity(1)
      setCartIsRolls(false)
    };
  
    const handleOpenCart = (event) => {
      //!!!
    }

    const loadProduct = async (e) => {

      axios.get(config.api + '/Products/Product?id=' + getFromUrl('id'))
      .then(function (result) {
          setProduct(result.data)
      })
      .catch (error => {
        console.log(error)
      })
    }

    /* link external script
       https://stackoverflow.com/questions/34424845/adding-script-tag-to-react-jsx */
    useEffect(() => {
      const script = document.createElement('script');
      script.src = "https://unpkg.com/js-image-zoom@0.4.1/js-image-zoom.js";
      script.async = true;
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      }
    }, []);

    useEffect(() => {
      loadProduct()
    }, [product]);

    const productInCart = shopCart ? shopCart.map((x) => { return x.product.id }).indexOf(product.id) >= 0 : false;

console.log('product.js shopCart:')
console.log(product.shopCart)

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
          textileTypes={[]}
          designTypes={[]}
          seasons={[]}
          colors={[]}
          printTypes={[]}
          productTypes={[]}
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

    <Box sx={{ alignContent: "left", display: "flex", flexDirection: "row" }} className="center-content" >

    {( product &&
    <Grid container spacing={0} >
      <Grid item xs={12} md={6} sx={{paddingLeft:"0px"}} >
      <Swiper
            className="swiper-product"
            modules={[Thumbs, Navigation, Pagination,]} // Navigation, Pagination, Scrollbar, A11y]}
            //slidesPerView={1}
            navigation
            thumbs={{ swiper: thumbsSwiper }}
            //watchSlidesProgress
            //onSwiper={setThumbsSwiper}
            //onSwiper={(swiper) => console.log(swiper)}
            pagination={{ clickable: true,
              renderBullet: function (index, className) 
                { return `<span class="${className}"  >${index + 1}</span>`; },
             }}
             sx={{ width: "550px", height: "310px" }}
            //scrollbar={{ draggable: true }}
            onSlideChange={() => console.log('slide change')} >

              {(product.colors && product.colors.map((cv, index) => {
                return <SwiperSlide 
                id={"img-container-" + index}
                  key={"product-swiper-" + index} 
                  sx={{ display: "flex", 
                        justifyContent: "center" }} >
                
                  <Box component={"img"} key={"product-swiper-00"}
                    src={config.api + "/" + cv.imagePath[0]}
                    alt={"photo_00"} className="product-img"
                    sx={{ borderRadius: 0, 
                      width: 400, 
                      height: 300, 
                      overflow: "hidden", 
                      padding: 0, 
                      cursor: "pointer" }} />
                  
                </SwiperSlide>
                
            }))}
            </Swiper>
      </Grid>
      <Grid item xs={12} md={6} sx={{ height: "100%", margin: "auto auto"}} paddingLeft={{ xs: "0", md: "10px"}} paddingTop={{ xs: "10px", md: "0"}}>
      <Box sx = {{ display: "flex", flexDirection: 'column', p: 1, height: "100%", justifyContent: "space-between"}} className="product-item" >
        <ItemName label="Item name" value={product.itemName} />
        <Box sx={{ display: "flex", flexGrow: 1 }} >
        <table style={{ paddingLeft: 10 }}>
        <PropertyItem maxWidth={270} label="Art No" value={fined(product.artNo)} />
        <PropertyItem maxWidth={270} label="Ref No" value={fined(product.refNo)} />
        <PropertyItem maxWidth={270} label="Design" value={fined(product.design)} />
        <PropertyItem maxWidth={270} label="Composition" value={fined(product.composition)} />
        <PropertyItem maxWidth={270} label="Product type" value={fined(product.productType)} />
        <PropertyItem maxWidth={270} label="Product style" value={fined(product.productStyle)} />
        <PropertyItem maxWidth={270} label="Print style" value={fined(product.printType)} />
        <PropertyItem maxWidth={270} label="Price per meter" value={product.price + " $"} />
        </table>
        </Box>
          <Box sx={{
            display: "flex", 
            flexDirection: 'column',
            alignItems: "center",
            className:"quantity",
            pl: "20px",
            pr: "20px" }}>
              {(productInCart!==true && <> <PropertyQuantity
                  maxWidth={200}
                  label="Quantity"
                  index={-1}
                  product={product}
                  quantity={cartQuantity}
                  isRolls={cartIsRolls}
                  setQuantity={setQuantity}
                  setRolls={setIsRolls}
                  setHelp={setHelp}
                  />
                <Button
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon/>}
                  className="button"
                  onClick={handleAddToCart}
                  sx={{mt: 4, p: "8px", width: "160px" }}>Add to cart</Button></>)}
              {(productInCart===true && <Button
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon/>}
                  className="button"
                  onClick={handleOpenCart}
                  sx={{mt: 4, p: "8px", width: "160px" }}>In cart</Button> )}
          </Box>
        </Box>
      </Grid>
    </Grid> )}
    </Box>

    {/* <Footer sx={{ mt: 2, mb: 2 }} /> */}

    </ThemeProvider>
  );
}
