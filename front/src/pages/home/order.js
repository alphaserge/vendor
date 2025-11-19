import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles, withStyles } from '@mui/styles';
import { Typography } from "@mui/material";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LogoutIcon from '@mui/icons-material/Logout';

import axios from 'axios'

import config from "../../config.json"
import Footer from './footer';
import { Button  } from "@mui/material";

import { getCourse } from '../../api/currencies'
import { getPayments } from '../../api/payments'
import PageHeader from '../../components/pageheader';
import Header from '../../components/header';
import MainSection from './mainsection';
import { formattedPrice, round2, fined, fromUrl, formattedDate, toFixed2 } from "../../functions/helper";
import StyledButton from '../../components/styledbutton';
import StyledButtonWhite from '../../components/styledbuttonwhite';
import StyledIconButton from '../../components/stylediconbutton';
import IconButtonWhite from "../../components/iconbuttonwhite";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledTextField from '../../components/styledtextfield';
import GridItem from "../../components/griditem";

const defaultTheme = createTheme()

const theme = createTheme({
  overrides: {
    MuiCheckbox: {
      colorSecondary: {
        color: '#custom color',
        '&$checked': {
          color: '#custom color',
        },
      },
    },
  },
});

const linkStyle = { textDecoration: 'none', height: "100%", display: "contents" }

export default function Order(props) {

  const navigate = useNavigate();
  const [order, setOrder] = useState([])
  const [agree, setAgree] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState("")
  const [expand, setExpand] = useState(false)
  const [courseRur, setCourseRur] = useState(0)
  const [payOption, setPayOption] = React.useState("")
  const [payerName, setPayerName] = useState( !props.data.user.payerName ? "" : props.data.user.payerName )
  const [payAmount, setPayAmount] = useState(null)
  
  const toggleExpand = (e) => {
    setExpand(!expand)
  }

  const logout = () => {
    props.data.logOut()
  }

  const paymentMinimum = Math.ceil(0.3 * order.total)

  const handlePayAmount = (event) => {
    
    var value = null
    try {
      value = parseFloat(event.target.value)
      if (Number.isNaN(value)) {
        value = null
      }
      /*if (value < paymentMinimum) {
        value = paymentMinimum
      }*/
    }
    catch (error) {
      value = null
    }
    setPayAmount(value)
  }

  const sendInvoice = async (order) => {

    let data = { 
      order: order,
      email: props.data.user.email,
      phones: props.data.user.phones,
      customer: payerName,
    }

    await axios.post(
      config.api + '/SendInvoice', 
      JSON.stringify(data), 
      { headers: { "Content-Type" : "application/json" }})
        .then(function (response) {
          setInvoiceUrl(config.api + "/" + response.data)
          return true;
        })
        .catch(function (error) {
          setInvoiceUrl("")
          return false;
        })
  };

  const pay = async (id, total) => {
    window.open("https://show.cloudpayments.ru/widget/");
    await axios.post(config.api + '/Payments/Pay', 
    { 
        what: "order", 
        whatId: id,
        amount: total,
        currency: "usd"
    })
    .then(function (response) {
      console.log(response)
    })
    .catch(function (error) {
      console.log(error);
    })    
  }

  const payOptionChange = (event)  => {
    setPayOption(event.target.value)
    setAgree(true)
  }
  
  const loadOrder = async (e) => {
    if (!props.data.user || props.data.user.email=="") {
      navigate("/login?return=order?uuid=" + uuid)
      return
    }

    let uuid = fromUrl("uuid")

    axios.get(config.api + '/Order?uuid=' + uuid) 
    .then(function (res) {
        setOrder(res.data)
    })
  }

  useEffect(() => {
    loadOrder()
    setCourseRur(getCourse(setCourseRur,'rur'))
    //getPayments(setPayments, orders[orderIndex].id)
  }, [])

  if (!props.data.user || props.data.user.Id === 0) {
    navigate("/login")
  }
  
  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }


  let total = 0;
  let orderTotal = 0;

  console.log('order:')
  console.log(order)
  
  var readyForPayment = false
  if (!order && order.items.length>0 && order.items.findIndex(it => !it.details)==-1) {
    readyForPayment = true
  }

  // orderTotal = 0
  // if (!!order && !!order.items && order.items.length>0) {
  //   total = order.items.reduce((n, {price}) => n + price, 0)
  //   (order.items.findIndex(i => i.checked) != -1) ?
  //     order.items.filter((i)=> {return i.checked}).reduce((n, {price}) => n + price, 0) : total
  // }
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

        <Box className="center-content" sx={{minHeight: "300px", padding: "0px 100px"}}>
        <Box sx={{display: "flex", alignItems: "center", margin: "20px 0 10px"}}>
          <PageHeader value={"Order no. " + order.number + " from "  + formattedDate(order.created)}></PageHeader>
            <StyledButtonWhite sx={{ marginLeft: 'auto', p: 0}} onClick={(e)=>{navigate("/orders")}}>Back to list</StyledButtonWhite>
            <StyledButtonWhite sx={{ ml: 2 }} onClick={(e)=>{logout(); navigate("/")}}>Log out</StyledButtonWhite>
        </Box> 
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "70px auto auto auto auto auto auto auto",
          columnGap: "8px",
          rowGap: "6px",
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item sx={{mb: 1}}><Header text="Photo"></Header></Grid>
                  {/* <Grid item sx={{mb: 1}}><Header text="Art No."></Header></Grid> */}
                  <Grid item sx={{mb: 1}}><Header text="Item name"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Design"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Color No"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Order qty"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Roll details"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Total qty"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Price"></Header></Grid>
                  {/* <Grid item sx={{mb: 1}}><Header text="Status"></Header></Grid> */}
            
                { !!order && !!order.items && order.items.map((data, index) => { 
                  const link = "/product?id=" + data.productId
                  const src = !!data.imagePath ? config.api + "/" + data.imagePath : config.api + "/public/noimage.jpg"
                  const quantity = data.quantity + data.unit.replace('rolls','r').replace('meters','m')
                  return (
                  <React.Fragment>
                    <GridItem link={link} center img src={src} />
                    <GridItem link={link} text={(!!data.artNo ? "Art. " + data.artNo + " " : "") + data.itemName}/>
                    <GridItem link={link} center text={data.design}/>
                    <GridItem link={link} center text={data.colorNo}/>
                    <GridItem link={link} center text={quantity}/>
                    <GridItem link={link} center text={data.details}/>
                    <GridItem link={link} center text={data.total+"m"}/>
                    <GridItem link={link} center text={formattedPrice(data.price)}/>
                </React.Fragment> )})}
                {[1,2,3,4,5,6].map((data, index) => (
                  <Grid item></Grid>
                ))}
                <Grid item sx={{textAlign: "right", fontWeight: 600, gridColumn: "span 2", marginRight: "20px", marginTop: "10px"}}>
                  <Box sx={{display: "grid", gridTemplateColumns: "auto 90px", justifyContent: "flex-end"}}>
                    <Typography sx={{fontSize: "16px", fontWeight: "500", marginTop: "0px"}}>Total ordered USD:</Typography>
                    <Typography sx={{fontSize: "16px", fontWeight: "500", marginTop: "0px"}}>{(!!order.total ? (toFixed2(order.total) + " $") : "-")}</Typography>
                    {/* <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Total RUR:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!orderTotal && !!courseRur ? (fined((orderTotal*courseRur).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})) + " ₽") : "-")}</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Course USD:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!courseRur ? (fined(courseRur.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " ₽") : "-")}</Typography> */}
                  </Box>
                </Grid>
      </Box>

        { !!order && 
          (!order.payments || order.payments.length == 0) && <Typography  sx={{fontSize: "16px", fontWeight: "500", marginTop: "20px"}}>Order has no payments</Typography>
        }
        { !!order && 
          !!order.payments && 
            order.payments.length != 0 &&
        <Box><Typography  sx={{fontSize: "16px", fontWeight: "500", margin: "20px 0"}}>Order payments</Typography>
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "120px 120px 140px 120px",
          columnGap: "8px",
          rowGap: "6px",
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item sx={{mb: 1}}><Header text="Date"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Amount"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Amount (USD)"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Exch. rate "></Header></Grid>
            
                { order.payments.map((data, index) => { 
                  return (
                  <React.Fragment>
                    <GridItem center text={formattedDate(data.date)}/>
                    <GridItem center text={toFixed2(data.currencyAmount) + " " + data.currency}/>
                    <GridItem center text={toFixed2(data.amount)}/>
                    <GridItem center text={toFixed2(data.exchangeRate)}/>
                </React.Fragment> )})}
                {[1,2].map((data, index) => (
                  <Grid item></Grid>
                ))}
                <Grid item sx={{textAlign: "right", fontSize: "14px", gridColumn: "span 2", mt: 1}}>
                  <Box sx={{display: "grid", gridTemplateColumns: "auto 90px", justifyContent: "flex-end", marginTop: "10px", marginRight: "24px"}}>
                    <Typography sx={{fontSize: "16px", fontWeight: "500", marginTop: "0px"}}>Total paid USD:</Typography>
                    <Typography sx={{fontSize: "16px", fontWeight: "500", marginTop: "0px"}}>{(!!order.totalPaid ? (toFixed2(order.totalPaid)) : "")}&nbsp;$</Typography>
                  </Box>
                </Grid>
      </Box></Box> }


        { !!order && order.totalPaid+0.1 < order.total && readyForPayment && <Box sx={{display: "flex", alignItems: "flex-start", mt: 3}}>
          <IconButtonWhite aria-label="expand" onClick={toggleExpand} >
          <KeyboardArrowDownIcon sx={{ color: "#3d694a", fontSize: 26 }} >
          </KeyboardArrowDownIcon>
            &nbsp;Proceed to payment
          </IconButtonWhite>
        </Box> }

        { expand && order.status != "paid" && 
          <React.Fragment>
          { invoiceUrl.length == 0 && <Box sx={{display: "flex", flexDirection: "column", alignItems: "left", mt: 4}} >
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}} >
              
              {/* <FormControlLabel required control={<Checkbox checked={agree} onChange={handleAgree} />} label="I confirm that the order details meets my requirements" sx={{pl: 2 }} /> */}
               <FormControl>
                  <FormLabel id="radio-buttons-group" sx={{ color: "#222", marginBottom: "5px" }}>Payment option:</FormLabel>
                  <RadioGroup 
                    aria-labelledby="radio-buttons-group"
                    name="radio-buttons-group"
                    value={payOption}
                    onChange={payOptionChange}
                  >
                    <FormControlLabel value="payment" control={<Radio />} label="Pay for the order in full" />
                    <FormControlLabel value="prepayment" control={<Radio />} label="Pay for the order partially" />
                  </RadioGroup>
              </FormControl>

            </Box>
            <Box sx={{ display: "grid", alignItems: "center", gridTemplateColumns: "150px 300px"}} >
                <Grid item gridColumn="span 2"><StyledTextField item
                  margin="normal"
                  required
                  id="payerName"
                  label="Payer name"
                  name="payerName"
                  value={payerName}
                  onChange={ev => setPayerName(ev.target.value)}
                  style={{ width: 400 }}
                  autoFocus /></Grid>
                { payOption == "prepayment" && <React.Fragment><Grid item><StyledTextField 
                  margin="normal"
                  required
                  id="pay-amount"
                  label="Amount"
                  name="pay-amount"
                  value={payAmount}
                  onChange={handlePayAmount} /></Grid>
                <Grid item><Typography sx={{ml: 2, mt: 1}}>Should be at least {paymentMinimum}$</Typography></Grid></React.Fragment>}
                <StyledIconButton 
                  aria-label="pay" 
                  sx={{backgroundColor: "#222", color: "#fff", width: "90px", mt: 1}} 
                  disabled={!agree || payerName.length < 6 || order.items.findIndex(x => !x.details) != -1 || (payOption=="prepayment" && payAmount < paymentMinimum) }
                  onClick={(e)=> { sendInvoice(order) }} >
                  Continue
                </StyledIconButton>                          
            </Box>
        </Box> }
        

          { invoiceUrl.length > 0 && <Box sx={{display: "flex", flexDirection: "column", gap: "20px",  alignItems: "center", mt: 4 }} className="product-item" >
            
              <Box>Your invoice is ready</Box>
              
              <Box><Link to={invoiceUrl} sx={{pt: 2}} style={{ textDecoration: 'none' }} >
                Please <span style={{color: "#44f", backgroundColor: "#ddd", padding: "1px 8px", borderRadius: "12px"}}>click this link</span> to download document
              </Link></Box>
            
                <StyledIconButton 
                  size="small" 
                  aria-label="pay" 
                  sx={{backgroundColor: "#222", color: "#fff", width: "90px", mt: 2}} 
                  onClick={(e)=> { setInvoiceUrl("") }} >
                  Back
                </StyledIconButton>                          
        </Box> }

        </React.Fragment>
        }

        </Box>

        <br/><br/>

      <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
