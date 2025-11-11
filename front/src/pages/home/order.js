import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles, withStyles } from '@mui/styles';
import { Typography } from "@mui/material";

import FormControlLabel from '@mui/material/FormControlLabel';

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
import { formattedPrice, orderStatusString, fined, fromUrl, formattedDate, toFixed2 } from "../../functions/helper";
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
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }

export default function Order(props) {

  const navigate = useNavigate();
  const [order, setOrder] = useState([])
  const [agree, setAgree] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState("")
  const [expand, setExpand] = useState(false)
  const [courseRur, setCourseRur] = useState(0)
  const [payerName, setPayerName] = useState( !props.data.user.payerName ? "" : props.data.user.payerName )
  
  const handleAgree = (event) => {
    setAgree(event.target.checked);
  };

  const toggleExpand = (e) => {
    setExpand(!expand)
  }

  const logout = () => {
    props.data.logOut()
  }

  const sendInvoice = async (order) => {

    let data = 
      { id: order.id,
        number: order.number,
        email: props.data.user.email,
        phones: props.data.user.phones,
        customer: payerName,
        items: 
          order.items.map((i) => ({ 
            id: i.id,
            itemName: i.itemName,
            quantity: i.quantity,
            price: i.price,
            unit: i.unit,
            discountedRate: 0}))
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
  };

  
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
          <PageHeader value={"Order no. " + " / "  }></PageHeader>
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
                  console.log("data:")
                  console.log(data)
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
                <Grid item sx={{textAlign: "right", fontSize: "14px", fontWeight: 600, gridColumn: "span 2"}}>
                  <Box sx={{display: "grid", gridTemplateColumns: "100px 70px", justifyContent: "flex-end"}}>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "0px"}}>Total USD:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "0px"}}>{(!!orderTotal ? (fined(orderTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})) + " $") : "-")}</Typography>
                    {/* <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Total RUR:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!orderTotal && !!courseRur ? (fined((orderTotal*courseRur).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})) + " ₽") : "-")}</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Course USD:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!courseRur ? (fined(courseRur.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " ₽") : "-")}</Typography> */}
                  </Box>
                </Grid>
      </Box>
        {/* public DateTime? Date { get; set; }
        public string? Currency { get; set; }
        public int OrderId { get; set; }
        public Decimal? Amount { get; set; }
        public Decimal? CurrencyAmount { get; set; }
        ExchangeRate
        public int CurrencyId { get; set; } */}

        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "100px 100px 100px",
          columnGap: "8px",
          rowGap: "6px",
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item sx={{mb: 1}}><Header text="Date"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Amount"></Header></Grid>
                  <Grid item sx={{mb: 1}}><Header text="Amount USD"></Header></Grid>
            
                { !!order && !!order.items && order.items.map((data, index) => { 
                  console.log("data:")
                  console.log(data)
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
                <Grid item sx={{textAlign: "right", fontSize: "14px", fontWeight: 600, gridColumn: "span 2"}}>
                  <Box sx={{display: "grid", gridTemplateColumns: "100px 70px", justifyContent: "flex-end"}}>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "0px"}}>Total USD:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "0px"}}>{(!!orderTotal ? (fined(orderTotal.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})) + " $") : "-")}</Typography>
                    {/* <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Total RUR:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!orderTotal && !!courseRur ? (fined((orderTotal*courseRur).toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2})) + " ₽") : "-")}</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>Course USD:</Typography>
                    <Typography sx={{fontSize: "14px", fontWeight: "500", marginTop: "5px"}}>{(!!courseRur ? (fined(courseRur.toLocaleString('ru-RU', {minimumFractionDigits: 2, maximumFractionDigits: 2 })) + " ₽") : "-")}</Typography> */}
                  </Box>
                </Grid>
      </Box>

      {/* <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}} >
        <Box className="product-item" sx={{mt: 1}}>Total summ: {formattedPrice(orderTotal)}&nbsp;$</Box>
      </Box> */}

        { order.status != "paid" && <Box sx={{display: "flex", alignItems: "flex-start", mt: 3}}>
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
              
              <FormControlLabel required control={<Checkbox checked={agree} onChange={handleAgree} />} label="I confirm that the order composition meets my requirements" sx={{pl: 2 }} />
            </Box>
            <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}} >
                <StyledTextField
                            margin="normal"
                            required
                            fullWidth
                            id="payerName"
                            label="Payer name"
                            name="payerName"
                            value={payerName}
                            onChange={ev => setPayerName(ev.target.value)}
                            style={itemStyle}
                            autoFocus
                          />
                <StyledIconButton 
                  size="small" 
                  aria-label="pay" 
                  sx={{backgroundColor: "#222", color: "#fff", width: "80px", ml: 2}} 
                  disabled={!agree || payerName.length < 6 || order.findIndex(x => !x.details) != -1}
                  onClick={(e)=> { sendInvoice(order) }} >
                  {/*onClick={(e)=> { pay(orders[orderIndex].id, orders[orderIndex].total) }} >*/}
                  {/* <AttachMoneyIcon sx={{color: "#fff"}} /> */}
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
                  sx={{backgroundColor: "#222", color: "#fff", width: "80px", mt: 2}} 
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
