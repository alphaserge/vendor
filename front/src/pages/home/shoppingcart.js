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
import { Button, Typography } from "@mui/material";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import styled from "styled-components";

import { useSelector, useDispatch } from 'react-redux'

import axios from 'axios'

import config from "../../config.json"
import { postOrder } from '../../api/orders'
import { generateSimplePassword, stringToHash } from '../../functions/hash'

import MainSection from './mainsection';
import Footer from './footer';

import { addToCart, removeFromCart, updateQuantity, updateUnit, flushCart } from './../../store/cartSlice' 
import PageHeader from '../../components/pageheader';
import Amount from '../../components/amount';
import Selector from '../../components/selector';
import Property from '../../components/property';
import ShortPrice from '../../components/shortprice';
import StyledButton from '../../components/styledbutton';
import Header from '../../components/header';
import { Fieldset } from '../../functions/fieldset';
import { getCurrencies, getCourse } from '../../api/currencies'

import { fined, computePrice, computeTotalPrice, fromUrl, toFixed2 } from "../../functions/helper"

const useStyles = makeStyles((theme) => ({
  noexpand: {
    flexGrow: "0!important",
    marginLeft: 0
  },
  expand: {
    flexGrow: 0,
    marginLeft: "4px"
  },
  label: {
   backgroundColor: "white",
   color: "#888"
  }
}));

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const halfItemStyle1 = { width: "calc( 50% - 4px )", m: 0 }
const labelStyle1 = { m: 0, ml: 0, mr: 4 }

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

const styles = theme => ({
  root: {
    display: "flex",
    textAlign: "center",
    width: 300,
    marginLeft: 100,
    marginTop: 200
  },
  hidden: {
    display: "none"
  },
  button: {
    background: "green"
  }, 
  label: {
   backgroundColor: "white",
   color: "#888"
  }
});


const getFromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

 const textStyle = { m: 0, mb: 2, backgroundColor: "#fff" }

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
    //const [emailSended, setEmailSended] = useState(false)
    const [info, setInfo] = useState("")
    const [step, setStep] = useState("cart")
    const [fieldsValid, setFieldsValid] = useState(false)
    const [sms, setSms] = useState("")
    const [code, setCode] = useState(randomInt(1001,9999))
    const [counter, setCounter] = useState(1)
    const [courseRur, setCourseRur] = useState(0)

    const [orderError, setOrderError] = useState(false)

    const what = fromUrl('what')
  
    const cart = useSelector((state) => state.cart.items)
  
    const shopCart = what == 'samples' ? 
      cart.filter(e => e.quantity == -1) :
      cart.filter(e => e.quantity != -1)

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

      axios.post("https://elizarov.sa@mail.ru:PGzuNeMuy2LzKjx7FPtH3uL_xsMX7I8P@gate.smsaero.ru/v2/auth")
      .then(function (res) {
        let url = "https://elizarov.sa@mail.ru:PGzuNeMuy2LzKjx7FPtH3uL_xsMX7I8P@gate.smsaero.ru/v2/sms/send?number=79167220074&text=Your code: " + code + "&sign=SMS Aero"
          axios.get(url)
          .then(function (res) {
              let rr = res
          })
          .catch (error => {
            console.log('sendSms error:' )
            console.log(error)
          })
      })
      .catch (error => {
        console.log('sendSms error:' )
        console.log(error)
      })

  }

  const sendEmail = async (e) => {

    await axios.post(config.api + '/Confirm', 
    { 
        code: code, 
        clientName: clientName, 
        email: clientEmail
    })
    .then(function (response) {
      console.log(response);
      //const json = await response.json();    
      //setEmailSended(true)
      setInfo("Please check your email and enter the code from the letter and click Confirm button")
      setCounter(-1)
      setTimeout(() => {
        setCounter(1)
      }, 1000*30);
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    })

  }

  const setUnit = (index, unit) => {
    changeUnit(index, unit)
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

    const password = generateSimplePassword()
    const hash = stringToHash(password)

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
      colorNo: it.colorVar.colorNo,
    }})

    let order = {
      uuid : uuid(),
      clientName : clientName,
      clientPhone : clientPhone,
      clientEmail : clientEmail,
      clientAddress : clientAddress,
      hash: hash,
      password: password,
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

  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }

  console.log(generateSimplePassword())
  console.log('shopcart')
  console.log(shopCart)

  const totalPrice = shopCart.reduce((accumulator, data) => {
    return accumulator +  computeTotalPrice(data.product, data.quantity, data.unit=="rolls", data.colorVar)
  }, 0); // The '0' is the initial value of the accumulator

  useEffect(()=>{ 
    setCourseRur(getCourse(setCourseRur,'rur'))
   }, [])
  
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

    {(step == "cart" && what == 'cart' && 
    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column"  }} className="center-content" >
    <Box sx={{ justifyContent: "flex-start", alignItems: "center", maxWidth: "960px" }}  >
      <Box sx={{marginTop: "20px"}}>
      <PageHeader value={"Your shopping cart: " + shopCart.length + " items"} />
      </Box>

    <Box sx={{ 
      display: "grid", 
      gridTemplateColumns: "66px 1fr 70px 110px 120px 130px",
      columnGap: "5px",
      rowGap: "10px",
      fontSize: "13px",
      alignItems: "center" }}>

      <Grid item><Header text="Photo"></Header></Grid>
      <Grid item><Header text="Item name"></Header></Grid>
      <Grid item><Header text="Price"></Header></Grid>
      <Grid item><Header text="Amount"></Header></Grid>
      <Grid item><Header text="Unit"></Header></Grid>
      <Grid item><Header text="Subtotal"></Header></Grid>

    {shopCart.map((data, index) => (
      <React.Fragment>
        <Link to={"/product?id=" + data.product.id } style={{ textDecoration: 'none' }} >
          <Grid item>
                {( data.colorVar && (data.colorVar.imagePath && data.colorVar.imagePath.length>0) && 
                  <img 
                    src={config.api + "/" + data.colorVar.imagePath[0]}
                    sx={{padding: "0 10px"}}
                    width={64}
                    height={54}
                    alt={data.product.itemName}
                /> )}
                </Grid></Link>
                
        <Link to={"/product?id=" + data.product.id}  style={{ textDecoration: 'none' }} >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property fontSize="14px" value={fined(data.product.artNo) + " " + fined(data.product.itemName)} />
          {/* <Property value={data.product.colors.filter((e)=>{ return e.colorNames!="PRODUCT" && e.colorNames!=""}).map((e)=> { return e.colorNames }).join(", ")}  /> */}
          <Property value={"Color " + data.colorVar.colorNo + ": " + data.colorVar.colorNames} />
        </Grid>
        </Link>

        <Link to={"/product?id=" + data.product.id}  style={{ textDecoration: 'none' }} >
        <Grid item sx={{ display: "flex", textAlign: "center", justifyContent: "center"}}>
          <ShortPrice value={fined(computePrice(data.product, data.quantity, data.unit=="rolls", data.colorVar))} />
        </Grid>
        </Link>

        <Amount size="-small" value={data.quantity} setValue={(e)=>{setQuantity(index,e)}} />   {/* label="Meters" labelWidth="3.2rem" */}
        <Selector size="-small" value={data.unit} list={["meters","rolls"]} setValue={(e)=>{setUnit(index,e)}} /> 

        <Box sx={{display: "flex", flexDirection: "row", justifyContent: "flex-end"}} >
        <ShortPrice value={fined(computeTotalPrice(data.product, data.quantity, data.unit=="rolls", data.colorVar))} />
        <IconButton aria-label="delete" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "0", padding: "0" }}>
          <DeleteOutlineIcon
            sx={{ color: "#888", fontSize: 26}}
            onClick={(e)=>{deleteFromCart(index)}} >
          </DeleteOutlineIcon>
        </IconButton>
        </Box>

      </React.Fragment>
    ))}

      {[1,2,3,4].map((data, index) => (
        <Grid item></Grid>
      ))}
      <Grid item sx={{textAlign: "right", fontSize: "14px", fontWeight: 600, gridColumn: "span 2"}}>
        <Box sx={{display: "grid", gridTemplateColumns: "100px 100px", justifyContent: "flex-end"}}>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "15px"}}>Total USD:</Typography>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "15px"}}>{(!!totalPrice ? (fined(totalPrice.toLocaleString('ru-RU', {minimumFractionDigits: 2})) + " $") : "-")}</Typography>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Total RUR:</Typography>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!totalPrice && !!courseRur ? (fined((totalPrice*courseRur).toLocaleString('ru-RU', {minimumFractionDigits: 2})) + " ₽") : "-")}</Typography>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Course USD:</Typography>
          <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!courseRur ? (fined(courseRur.toLocaleString('ru-RU', {minimumFractionDigits: 2})) + " ₽") : "-")}</Typography>
        </Box> 
      </Grid>
      <Grid item></Grid>

      {[1,2,3,4].map((data, index) => (
        <Grid item></Grid>
      ))}
      <Grid item sx={{textAlign: "right", fontSize: "14px", fontWeight: 600, gridColumn: "span 2"}}>
        <StyledButton
            startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
            onClick={(e) => { setStep("delivery")} }
            sx={{ mt: 2, width: "160px" }}>Create order</StyledButton>
      </Grid>
      <Grid item></Grid>

    </Box>
    </Box>
    </Box> )}

    {(step == "cart" && what == 'samples' && 
    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }} className="center-content" >
    <Box sx={{ justifyContent: "flex-start", alignItems: "center", marginTop: "20px" }}  >
    <PageHeader value={"Delivery a samples: " + shopCart.length + " items"} />

    <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "center", columnGap: 4, rowGap: 4 }}>

    {shopCart.map((data, index) => (
      <React.Fragment>
        <Link to={"/product?id=" + data.product.id } style={{ textDecoration: 'none' }} >
          <Box sx={{ display: "flex", flexDirection: "column", height: "300px" }}>
                {( data.colorVar && (data.colorVar.imagePath && data.colorVar.imagePath.length>0) && 
                  <img 
                    src={config.api + "/" + data.colorVar.imagePath[0]}
                    sx={{padding: "0 10px"}}
                    width={165}
                    height={165}
                    alt={data.product.itemName}
                /> )}
                <Box sx={{ width: "165px", fontSize: "14px", mt: 2 }}>{ fined(data.product.itemName) }</Box>
                <Box sx={{ width: "165px", fontSize: "14px" }}>{ "color no. " + data.colorVar.colorNo + " : " + data.colorVar.colorNames }</Box>
                <IconButton aria-label="delete" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "6px", marginTop: "auto" }}>
                  <DeleteOutlineIcon
                    sx={{ color: "#888", fontSize: 26 }}
                    onClick={(e)=>{deleteFromCart(index)}} >
                  </DeleteOutlineIcon>
                </IconButton>
          </Box>
        </Link>

      </React.Fragment>
    ))}

    </Box>
        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
          <StyledButton
            startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
            onClick={(e) => { setStep("delivery")} }
            sx={{ mt: 4 }}>Create order</StyledButton>
        </Box>
    </Box>
    </Box> )}    

    {(step == "delivery" &&  

    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column" }} className="center-content" >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "600px", marginTop: "20px" }}  >
      <Typography sx={{fontSize: "16px", fontWeight: 700, color: "#444", margin: "20px 0 20px"}} >Delivery information:</Typography>

      {/* <Typography sx={{fontSize: "15px", fontWeight: 600, color: "#333", margin: "20px 0 10px"}} >Delivery Information</Typography> */}
      {/* <Fieldset title="Delivery Information"> */}
                <StyledTextField
                  margin="normal"
                  size="small"
                  id="clientName"
                  name="clientName"
                  label="Your name"
                  labelId="client-name-label"
                  key="client-name"
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
              { true && <Box sx={{display: "flex"}}>
                <StyledTextField
                  disabled={!fieldsValid}
                  margin="normal"
                  size="small"
                  id="smscode"
                  name="sms-code"
                  label="Code from email"
                  sx = {{...textStyle, ...{width: "140px"}}}
                  value={sms}
                  onChange={ev => { setSms(ev.target.value)  } }
                />
            <Button onClick={sendEmail} sx={{ 
              display: fieldsValid && ( counter>=0 ? "block":"none" ),
              p: "3px 8px", 
              height: "32px",
              marginTop: "3px",
              marginLeft: "8px",
              fontSize: "14px",
              textTransform: "none",
              backgroundColor: fieldsValid ? "#222":"#ccc", 
              color: "#fff", 
              borderRadius: 0 }}>Send e-mail</Button>
          </Box>
          }

        { info && <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "14px", color: "#333" }}>{info}</Box> }

        { orderError &&
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> }

        {/* </Fieldset> */}

        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
          <StyledButton
            startIcon={<ShoppingCartOutlinedIcon sx={{ color: "#fff"}} />}
            onClick={makeOrder}
            disabled={sms != code}
            //disabled={fieldsValid==false}
            sx={{ mt: 4 }} >Confirm</StyledButton>
        </Box>

        </Box>
        </Box> )}

    {(step == "confirm" &&  

    <Box id="id0" sx={{ justifyContent: "center", display: "flex", alignItems: "center", flexDirection: "column", pt: 8 }} className="center-content" >
      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: "600px" }}  >
      {/* <PageHeader value={"Your order has been successfully created"} /> */}
      <Property value={"Your order has been successfully created"} />
      <Property value={"Please check the email address you provided when placing your order"} />
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

<br/>
<br/>
      <Footer sx={{ mt: 2, mb: 2 }} />
 
    </ThemeProvider>
  );
}