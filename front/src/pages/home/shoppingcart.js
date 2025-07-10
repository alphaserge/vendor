import React, { useState, useEffect, useRef } from "react";
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

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
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styled from "styled-components";

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import config from "../../config.json"
import { postOrder } from '../../api/orders'

import ImageMagnifier from '../../components/imagemagnifier';
import MainSection from './mainsection';

import { addToCart, removeFromCart, updateQuantity, updateUnit, flushCart } from './../../store/cartSlice' 
import PropertyQuantity from "../../components/propertyquantity";
import PropertyItem from '../../components/propertyitem';
import Price from '../../components/price';
import ItemName from '../../components/itemname';
import PageHeader from '../../components/pageheader';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import Property from '../../components/property';

import { fined, computePrice } from "../../functions/helper"
import {APPEARANCE as ap} from '../../appearance';

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

const StyledTextField1 = withStyles({
  borderRadius: '0px',
    root: {
            borderRadius: '0px',
            '& fieldset.MuiOutlinedInput-notchedOutline': {
              borderColor: "#bbb",
            },
          }
  })(TextField);

const StyledTextField = styled(TextField)`
  & label.Mui-focused {
    color: white;
  }
  & .MuiOutlinedInput-root {
    border-radius: 0px;
    &.Mui-focused fieldset {
      border-color: #888;
      border-width: 1px;
    }
  }
`;

const StyledLink = withStyles({
    textDecoration: 'none',
    '&:focus, &:hover, &:visited, &:link, &:active': {
        textDecoration: 'none'
    }
  })(Link);

const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

 const textStyle = { m: 0, mb: 2 }

 function randomInt(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function ShoppingCart(props) {

  const classes = useStyles()

    const [showShoppingCart, setShowShoppingCart] = React.useState(false);
    const [clientAddress, setClientAddress] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientEmail, setClientEmail] = useState("")
    const [step, setStep] = useState("cart")
    const [fieldsValid, setFieldsValid] = useState(false)
    const [sms, setSms] = useState("")
    const [code, setCode] = useState(randomInt(1001,9999))

    const [orderError, setOrderError] = useState(false)

  const shopCart = useSelector((state) => state.cart.items)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeQuantity = (index, quantity) => { 
    dispatch(updateQuantity({ index, quantity }))
  };

  const changeUnit = (index, unit) => { 
    dispatch(updateUnit({ index, unit }))
  };

  const deleteFromCart = (index) => {
    dispatch(removeFromCart({index}))
  }

  const setQuantity = (index, quantity) => {
    changeQuantity(index, quantity)
  }

  const sendSms = (e) => {
      let url = "https://elizarov.sa@mail.ru:PGzuNeMuy2LzKjx7FPtH3uL_xsMX7I8P@gate.smsaero.ru/v2/sms/send?number=79167220074&text=Your code: " + code + "&sign=SMS Aero"
          axios.get(url)
          .then(function (res) {
              //...
          })
          .catch (error => {
            console.log('sendSms error:' )
            console.log(error)
          })
    
    
  }

  const setUnit = (index, unit) => {
    changeUnit(index, unit)
  }

  const setHelp = (index, help) => {
    shopCart[index].help = help
  }

  const handleShowShoppingCart = () => {
    navigate("/")
  }

  const checkAddress = (address) => {
    setFieldsValid(!!address && !!clientEmail && !!clientName && !!clientPhone)
  }
  const checkName = (name) => {
    setFieldsValid(!!name && !!clientEmail && !!clientAddress && !!clientPhone)
  }
  const checkEmail = (email) => { 
    setFieldsValid(!!email && !!clientAddress && !!clientName && !!clientPhone)
  }
  const checkPhone = (phone) => {
    setFieldsValid(!!phone && !!clientEmail && !!clientName && !!clientAddress)
  }

const makeOrder = async (event) => {

    let items = shopCart.map((it) => { return {
      productId: it.product.id,
      quantity: it.quantity,
      unit: it.unit,
      itemName: it.product.itemName,
      refNo: it.product.refNo,
      artNo: it.product.artNo,
      design: it.product.design,
      price: computePrice(it.product, it.quantity, it.unit=="rolls"), //(it.quantity > 500 ? it.product.price : ( it.quantity > 300 ? it.product.price1 : it.product.price2 )),
      colorVariantId: it.colorVar.colorVariantId,
      colorNames: it.colorVar.colorNames,
    }})

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
      //props.closeDialog(". Please check the email address you provided when placing your order.");
      setStep("success")
      dispatch(flushCart());
    } else {
      setOrderError(true)
      setStep("error")
    }
  }

  console.log('shopCart:')
  console.log(shopCart)

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

    {(step == "cart" &&       
    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }} className="center-content" >
    <Box sx={{ justifyContent: "flex-start", alignItems: "center" }}  >
    <PageHeader value={"Shopping cart: " + shopCart.length + " items"} />

    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: "80px 1fr 100px 140px 140px 40px",
      columnGap: "10px",
      rowGap: "10px",
      alignItems: "center" }}>

    {shopCart.map((data, index) => (
      <React.Fragment>
        <Link to={"/product?id=" + data.product.id } style={{ textDecoration: 'none' }} >
          <Grid item>
                {( data.product.colors && data.product.colors.length>0 && 
                  <img 
                    src={config.api + "/" + data.product.colors[0].imagePath[0]}
                    sx={{padding: "0 10px"}}
                    width={65}
                    height={65}
                    alt={data.product.itemName}
                /> )}
                </Grid></Link>
                
        <Link to={"/product?id=" + data.product.id}  style={{ textDecoration: 'none' }} >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={fined(data.product.itemName)}  />
          {/* <Property value={data.product.colors.filter((e)=>{ return e.colorNames!="PRODUCT" && e.colorNames!=""}).map((e)=> { return e.colorNames }).join(", ")}  /> */}
          <Property value={data.colorVar.colorNames} />
        </Grid>
        </Link>

        <Link to={"/product?id=" + data.product.id}  style={{ textDecoration: 'none' }} >
        <Grid item>
          <Property value={fined(data.product.price) + "$"} />
        </Grid>
        </Link>

        <Amount size="-small" value={data.quantity} setValue={(e)=>{setQuantity(index,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
        <Selector size="-small" value={data.unit} list={["meters","rolls"]} setValue={(e)=>{setUnit(index,e)}} /> 

        <IconButton aria-label="delete" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "6px" }}>
          <DeleteOutlineIcon
            sx={{ color: "#888", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(index)}} >
          </DeleteOutlineIcon>
        </IconButton>

        {/* <PropertyQuantity 
                        maxWidth={200} 
                        label="Quantity" 
                        index={index} 
                        product={data.product} 
                        quantity={data.quantity} 
                        isRolls={data.isRolls} 
                        setQuantity={setQuantity} 
                        setRolls={setRolls} 
                        setHelp={setHelp} /> */}
      </React.Fragment>
    ))}

    </Box>
        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
          <Button
            startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
            onClick={(e) => { setStep("delivery")} }
            sx={{ 
              mt: 4, 
              p: "12px", 
              width: "160px", 
              fontSize: ap.FONTSIZE,
              textTransform: "none",
              backgroundColor: "#222", 
              color: "#fff", 
              borderRadius: 0 }}>Create order</Button>
        </Box>
    </Box>
    </Box> )}

    {(step == "delivery" &&  

    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }} className="center-content" >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "600px" }}  >
      <PageHeader value={"Delivery information"} />
      {/* <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#3d694a", p:0, pb: 2, pt: 2}}> Delivery information </Typography> */}
        
                <StyledTextField
                  margin="normal"
                  size="small"
                  id="clientName"
                  name="clientName"
                  label="Your name"
                  sx = {{...textStyle, ...{width: "200px"}}}
                  value={clientName}
                  onChange={ev => { setClientName(ev.target.value); checkName(ev.target.value);  } }
                />
                <StyledTextField
                  margin="normal"
                  size="small"
                  id="clientPhone"
                  name="clientPhone"
                  label="Phone"
                  sx = {{...textStyle, ...{width: "200px"}}}
                  value={clientPhone}
                  onChange={ev => { setClientPhone(ev.target.value); checkPhone(ev.target.value);  } }
                />
                <StyledTextField
                  margin="normal"
                  size="small"
                  id="clientEmail"
                  name="clientEmail"
                  label="Email"
                  sx = {{...textStyle, ...{width: "200px"}}}
                  value={clientEmail}
                  onChange={ev => { setClientEmail(ev.target.value); checkEmail(ev.target.value);  } }
                />
                <StyledTextField
                  margin="normal"
                  size="small"
                  id="clientAddress"
                  name="clientAddress"
                  label="Delivery address"
                  sx = {{...textStyle, ...{width: "380px"}}}
                  value={clientAddress}
                  onChange={ev => { setClientAddress(ev.target.value); checkAddress(ev.target.value); } }
                />
<Box sx={{display: "flex"}}>
                <StyledTextField
                  disabled={!fieldsValid}
                  margin="normal"
                  size="small"
                  id="smscode"
                  name="sms-code"
                  label="SMS code"
                  sx = {{...textStyle, ...{width: "100px"}}}
                  value={sms}
                  onChange={ev => { setSms(ev.target.value)  } }
                />

                <Button
            
            onClick={sendSms}
            sx={{ 
              
              p: "3px 8px", 
              height: "32px",
              marginTop: "3px",
              marginLeft: "8px",
              fontSize: "14px",
              textTransform: "none",
              backgroundColor: fieldsValid ? "#222":"#ccc", 
              color: "#fff", 
              borderRadius: 0 }}>Send</Button>
</Box>
        { orderError &&
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> }

        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
          <Button
            startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
            onClick={makeOrder}
            disabled={sms != code}
            sx={{ 
              mt: 4, 
              p: "6px", 
              width: "120px", 
              fontSize: ap.FONTSIZE,
              textTransform: "none",
              backgroundColor: sms == code ? "#222":"#ccc", 
              color: "#fff", 
              borderRadius: 0 }}>Confirm</Button>
        </Box>
        </Box>
        </Box> )}

    {(step == "success" &&  

    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column", pt: 8 }} className="center-content" >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "600px" }}  >
      {/* <PageHeader value={"Your order has been successfully created"} /> */}
      <Property value={"Your order has been successfully created"} />
      <Property value={"Please check the email address you provided when placing your order"} />
      </Box>
      </Box> )}

    {(step == "error" &&  

    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column", pt: 8 }} className="center-content" >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "600px" }}  >
      {/* <PageHeader value={"An error has occurred"} /> */}
      <Property value={"An error has occurred"} />
      <Property value={"Please check that all fields are filled in correctly and completely and try saving again"} />
      </Box>
      </Box> )}

 
    </ThemeProvider>
  );
}