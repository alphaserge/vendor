import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from 'react-redux'

import { v4 as uuid } from 'uuid'
import { makeStyles, withStyles } from '@mui/styles';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { Button, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import axios from 'axios'

import { computePrice } from '../../functions/helper';
import config from "../../config.json"
import { postOrder } from '../../api/orders'

import ImageMagnifier from '../../components/imagemagnifier';
import MainSection from './mainsection';
import ShoppingCart from '../../components/shoppingcartmodal';

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../../store/cartSlice' 
import PropertyQuantity from "../../components/propertyquantity";
import PropertyItem from '../../components/propertyitem';
import Price from '../../components/price';
import ItemName from '../../components/itemname';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import Property from '../../components/property';
import {APPEARANCE as ap} from '../../appearance';

import { fined } from "../../functions/helper"

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

const StyledButton = withStyles({
  root: {
    backgroundColor: '#222',
    color: '#fff',
    fontSize: "18px",
    textTransform: "none!important",
    '&:hover': {
      backgroundColor: '#fd8bb5',
      color: '#fff',
  },
}})(Button);

const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

export default function Product(props) {

  const classes = useStyles()

    const [showShoppingCart, setShowShoppingCart] = React.useState(false);
    const [clientAddress, setClientAddress] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientEmail, setClientEmail] = useState("")

    const [orderError, setOrderError] = useState(false)

  const shopCart = useSelector((state) => state.cart.items)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const textStyle = { m: 0, mb: 2 }

  const changeQuantity = (index, quantity) => { 
    dispatch(updateQuantity({ index, quantity }));
  };

  const deleteFromCart = (index) => {
    dispatch(removeFromCart({index}));
  }

  const setQuantity = (index, quantity) => {
    changeQuantity(index, quantity);
  }

  const setRolls = (index, isRolls) => {
    shopCart[index].isRolls = isRolls
  }

  const setHelp = (index, help) => {
    shopCart[index].help = help
  }

  const handleShowShoppingCart = () => {
    navigate("/")
  }

const makeOrder = async (event) => {

    if (!clientAddress || !clientEmail || !clientName || !clientPhone) {
      setOrderError(true)
      return
    }

    let items = shopCart.map((it) => { return {
      productId: it.product.id,
      quantity: it.quantity,
      itemName: it.product.itemName,
      refNo: it.product.refNo,
      artNo: it.product.artNo,
      design: it.product.design,
      price: (it.quantity > 500 ? it.product.price : ( it.quantity > 300 ? it.product.price1 : it.product.price2 ))
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
      setOrderError(false)
      props.closeDialog("Your order has been successfully created. Please check the email address you provided when placing your order.");
      dispatch(flushCart());
    } else {
      setOrderError(true)
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

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

    <Box sx={{ justifyContent: "center", display: "flex", alignItems: "flex-start", flexDirection: "column" }} className="center-content" >
        
    <Box sx={{display: "flex", height: "60px", pt: 1}}>
      <Typography sx={{fontSize: "18px", fontWeight: 600, color: "#333", p:0, pb: 2, flexGrow: 1}}>
        {/* Your shopping items:&nbsp;{items.length}&nbsp;items */}
      </Typography>
    </Box>

    <Box>
    <table class="shopping-items" cellPadding={0} cellSpacing={0}>
    <tbody>
    {shopCart.map((data, index) => (
      <tr style={{ height : "100px", cursor: "pointer"}} onClick={(e) => { navigate("/product?id=" + data.product.id) }}>
        <td>
          <img 
            src={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
            alt={"photo_"+data.product.id}
            style={{ borderRadius: "6px", maxWidth: "90px" }} />
        </td>
        <td style={{wordBreak: "break-all", paddingLeft: "15px"}}>
          <table cellPadding={0} cellSpacing={4}>
            <tbody>
              <PropertyItem maxWidth={200} label="Item name" value={data.product.itemName} />
              <PropertyItem maxWidth={200} label="Design" value={data.product.design} />
              <PropertyItem maxWidth={200} label="Composition" value={data.product.composition} />
            </tbody>
          </table>
        </td>
        <td>
        <table style={{paddingLeft: "10px"}}>
            <tbody>
              <PropertyItem maxWidth={200} label="Price" value={computePrice(data.product, data.quantity) + " $"} />
              <PropertyQuantity 
                maxWidth={200} 
                label="Quantity" 
                index={index} 
                product={data.product} 
                quantity={data.quantity} 
                isRolls={data.isRolls} 
                setQuantity={setQuantity} 
                setRolls={setRolls} 
                setHelp={setHelp} />
              
            </tbody>
          </table>
          </td>
        <td style={{paddingLeft: "10px"}}>
        <IconButton aria-label="delete" sx={{backgroundColor: "#ddd", borderRadius: "8px", margin: "6px" }}>
          <DeleteIcon 
            sx={{ color: "#3d694a", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(index)}} >
          </DeleteIcon>
        </IconButton> 
        </td>
        </tr>
        ))}
      </tbody>
    </table>
    </Box>

        <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#3d694a", p:0, pb: 2, pt: 2}}> Delivery information </Typography>
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
            onClick={makeOrder} >
                Make order
        </Button>
        <Button
            variant="contained"
            //sx={{...roundButtonStyle, ...{ml: 3}}}
            className="add-to-cart-button"
            sx={{ml: 1}}
            onClick={() => {
              props.closeDialog();
              setShowShoppingCart(false);
              }}>
                Close
        </Button>
        </Box>

    </Box>
 
    </ThemeProvider>
  );
}