import React, { useState, useEffect, useImperativeHandle } from 'react';
import { useDispatch, useSelector } from 'react-redux'

import Box from '@mui/material/Box';
import { Button } from "@mui/material";
import Grid from '@mui/material/Grid';

import IconButton from '@mui/material/IconButton';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';

import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';

// import Swiper core and required modules
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Thumbs } from 'swiper/modules';

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../store/cartSlice'
import PropertyQuantity from "../components/propertyquantity";
import PropertyItem from '../components/propertyitem';
import ItemName from '../components/itemname';

import config from "../config.json"

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import 'swiper/css/thumbs';

const QuickView = React.forwardRef((props, ref) => {

  const [showModal, setShowModal] = React.useState(false);
  const [product, setProduct] = useState(props.product)
  const shopCart = useSelector((state) => state.cart.items)

  const textStyle = { m: 0, mb: 2 }

  const modalSx = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "800px",
      boxShadow: 24,
      padding: "20px 40px 40px 40px", 
      outline: "none",
      bgcolor: 'background.paper',
    }

  useImperativeHandle(ref, () => ({
    displayWindow(show) {
      displayWindow(show)
    }
  }))

  const displayWindow = (show) => {
    setShowModal(show);
  }

  const [cartQuantity, setCartQuantity] = useState(1)
  const [cartIsRolls, setCartIsRolls] = useState(false)
  const [cartHelp, setCartHelp] = useState(false)

  // store thumbs swiper instance
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  
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
    setShowModal(false)
    props.closeDialog('open cart')
  } 

  const productImgHolderClass = "product-img-holder"
  const productInCart = props.product ? shopCart.map((x) => { return x.product.id }).indexOf(props.product.id) >= 0 : false;

return <>
  {/* Show info modal */}
  <Modal
    open={showModal}
    onClose={function() { setShowModal(false) }}
    aria-labelledby="modal-modal-title"
    aria-describedby="modal-modal-description"
    sx={{ width: "auto", outline: "none" }} >

    <Box sx={{
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      margin: "0px",
      height: "auto",
      width: "950px",
      boxShadow: 24,
      padding: "0px",
      outline: "none",
      bgcolor: '#fff',
      display: "flex",
      overflow: "hidden",
      flexDirection: 'row',
      borderRadius: "20px",
      alignItems: 'center', justifyContent: "right" }}>
    <IconButton
        sx={{ position: "absolute", top: 1, mr: 0, zIndex: 100, backgroundColor: "#fff", border: "2px solid #ccc", border: "none" }}
        onClick={() => { setShowModal(false) }}>
        <CloseIcon sx={{ fontSize: 24 }}/>
    </IconButton>

    <Grid container spacing={0} >
      <Grid item xs={12} md={6} sx={{paddingLeft:"0px"}} >
      <Swiper
            className="swiper"
            modules={[Thumbs, Navigation, Pagination,]} // Navigation, Pagination, Scrollbar, A11y]}
            /*slidesPerView={1}*/
            navigation 
            thumbs={{ swiper: thumbsSwiper }}
            //watchSlidesProgress
            //onSwiper={setThumbsSwiper}
            //onSwiper={(swiper) => console.log(swiper)}
            //pagination={{ clickable: true }}
            //scrollbar={{ draggable: true }}

            onSlideChange={() => console.log('slide change')} >
              {props.product.colors.map((cv, index) => {
                return <Box key={"product-box-00"} >
                <SwiperSlide key={"product-swiper-00"} sx={{ display: "flex", justifyContent: "center" }} >
                <Box sx={{ width: 600, height: 600, overflow: "hidden", padding: 0, cursor: "pointer" }} >
                  <Box component={"img"} key={"product-swiper-00"}
                    src={config.api + "/" + cv.imagePath[0]}
                    alt={"photo_00"} className="product-img"
                    sx={{ borderRadius: 0 }} />
                  </Box>
                </SwiperSlide>
                </Box>
            })}
            </Swiper>
      </Grid>
      <Grid item xs={12} md={6} paddingLeft={{ xs: "0", md: "10px"}} paddingTop={{ xs: "10px", md: "0"}}>
      <Box sx = {{ display: "flex", flexDirection: 'column', p: 1}} className="product-item" >
        <ItemName label="Item name" value={props.product.itemName} />
        <table style={{ fontSize: "15px", paddingLeft: 20 }}>
        <PropertyItem maxWidth={200} label="Art No" value={props.product.artNo} />
        <PropertyItem maxWidth={200} label="Ref No" value={props.product.refNo} />
        <PropertyItem maxWidth={200} label="Design" value={props.product.design} />
        <PropertyItem maxWidth={200} label="Composition" value={props.product.composition} />
        <PropertyItem maxWidth={200} label="Product type" value={props.product.productType} />
        <PropertyItem maxWidth={200} label="Product style" value={props.product.productStyle} />
        <PropertyItem maxWidth={200} label="Print style" value={props.product.printType} />
        <PropertyItem maxWidth={200} label="Price per meter" value={props.product.price}$ />
        </table>
          <Box sx={{
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: "center",
            className:"quantity",
            mt: 4,
            pl: "20px",
            pr: "20px" }}>
              {(productInCart!==true && <> <PropertyQuantity 
                  maxWidth={200} 
                  label="Quantity" 
                  index={-1} 
                  product={props.product} 
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
                  sx={{mt: 4, p: "12px", width: "90%" }}>Add to cart</Button></>)}
              {(productInCart===true && <Button
                  variant="contained"
                  startIcon={<ShoppingCartOutlinedIcon/>}
                  className="button"
                  onClick={handleOpenCart}
                  sx={{mt: 4, p: "12px", width: "90%" }}>In cart</Button> )}
          </Box>
        </Box>
      </Grid>
    </Grid>
    </Box>
  </Modal>
</>
})

export default QuickView;