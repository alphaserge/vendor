import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { makeStyles, withStyles } from '@mui/styles';

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
import { APPEARANCE as ap} from '../../appearance';
import { Button  } from "@mui/material";

import PageHeader from '../../components/pageheader';
import Header from '../../components/header';
import MainSection from './mainsection';
import { idFromUrl, formattedDate, toFixed2 } from "../../functions/helper";
import StyledButton from '../../components/styledbutton';
import StyledButtonWhite from '../../components/styledbuttonwhite';
import StyledIconButton from '../../components/stylediconbutton';
import IconButtonWhite from "../../components/iconbuttonwhite";
import OrderItemStatus from "../../components/orderitemstatus";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import StyledTextField from '../../components/styledtextfield';
import { formattedPrice, orderStatusString } from '../../functions/helper';

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

const linkStyle = { textDecoration: 'none', color: ap.COLOR, height: "100%" }
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }

export default function Orders(props) {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [orderIndex, setOrderIndex] = useState(-1)
  const [agree, setAgree] = useState(false)
  const [invoiceUrl, setInvoiceUrl] = useState("")
  const [expand, setExpand] = useState(false)
  const [payerName, setPayerName] = useState( !props.data.user.payerName ? "" : props.data.user.payerName )

  const handleAgree = (event) => {
    setAgree(event.target.checked);
  };

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

  const toggleExpand = (e) => {
    setExpand(!expand)
  }

  const loadOrders = async (e) => {

      if (!props.data.user || props.data.user.email=="") {
        navigate("/login?return=orders")
        return
      }

      let id = idFromUrl()

      let api = config.api + '/Orders'
      axios.get(api, { 
        params: { type: "client", value: props.data.user.email, id: id }})
      .then(function (res) {
        if (!res.data) {
          //navigate("/login")
          return
        }
          var result = res.data.map((d) => 
          {
              return {
                id: d.id,
                created : d.created,
                number  : d.number,
                vendor  : d.vendorName,
                client  : d.clientName,
                phone   : d.clientPhone,
                email   : d.clientEmail,
                address : d.clientAddress,
                total   : d.items.reduce((n, it) => n + it.quantity*it.price, 0),
                paid    : d.paid,
                changes : false,
                canPay  : false,
                items   : ( !!d.items ? d.items.map((it) => { return {
                  checked   : false,
                  id        : it.id,
                  productId : it.productId,
                  paid      : it.paid,
                  imagePath : it.imagePath,
                  itemName  : it.itemName,
                  artNo     : it.artNo,
                  refNo     : it.refNo,
                  design    : it.design,
                  colorNo   : it.colorNo,
                  spec      : it.composition,
                  price     : it.price,
                  owner     : it.vendorName,
                  quantity  : it.quantity,
                  unit      : it.unit,
                  colorNames: it.colorNames,
                  details   : it.details,
                  changes   : false,
                  details   : it.details,
                  shipped   : it.shipped,
                  delivered : it.delivered,
                  deliveryNo: it.deliveryNo,
                  deliveryCompany : it.deliveryCompany,
                  status: it.confirmByVendor != null ? "confirmed" : (it.confirmByVendor != null ? "shipped" : (it.inStock != null ? "in stock" : (it.shippedToClient != null ? "shipped to client" : (it.recievedByClient != null ? "recieved" : "ordered"))))
                  }}) : [])
              }
          });

          result = result.filter((i)=> { return i.items.length > 0})
          //setCanPay(result.filter((i)=> { return i.checked}).length>0)

          if (!!id) {
            let ix = result.findIndex(x => x.id == id)
            setOrderIndex(ix)
            //result = result.filter((i)=> { return i.id == id})
          } else {
            setOrderIndex(-1)
          }

          setOrders(result)

      console.log(result)

      })
      .catch (error => {
        console.log(error)
      })
    }

    const setDetails = (orderId, id, value) => {

      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].id == orderId) {
          for (let i=0; i< ords[j].items.length; i++) {
            if (ords[j].items[i].id == id) {
              ords[j].items[i].details = value
              ords[j].items[i].changes = true;
              ords[j].changes = true;
              setOrders(ords)
              //setModified(true)
              break
            }
          }
        }
      }
      console.log('set details')
      console.log(id)
      console.log(value)
    }
        
    /* useEffect(() => {
      let id = idFromUrl()
      if (!!id) {
        setView("items")
      } else {
        setView("order")
      }
    loadOrders()
    }, [view])// [entity, toggle]); */

    useEffect(() => {
      loadOrders()
    }, [])

  if (!props.data.user || props.data.user.Id === 0) {
    navigate("/login")
  }
  
  const searchProducts = (param) => {
    //if (param.length > 2) {
      navigate("/?q=" + encodeURIComponent(param))
    //}
  }


  console.log("orders: ")
  console.log(orders)
  console.log(orderIndex)

  let total = 0;
  let totalPay = 0;
  if (orderIndex != -1) {
    total = orders[orderIndex].items.reduce((n, {price}) => n + price, 0)
    totalPay = (orders[orderIndex].items.findIndex(i => i.checked) != -1) ?
      orders[orderIndex].items.filter((i)=> {return i.checked}).reduce((n, {price}) => n + price, 0) : total
  }
  console.log('totalPay:')
  console.log(totalPay)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <MainSection
        searchProducts={searchProducts}
        data={props.data}/>

        { orderIndex == -1 && <Box className="center-content" sx={{minHeight: "300px", padding: "0 0 0 135px"}}>
        <Box sx={{display: "flex", alignItems: "center", maxWidth: 650}}>
          <PageHeader value="Your orders list"></PageHeader>
          <StyledButtonWhite sx={{ marginLeft: "auto" }} onClick={(e)=>{logout(); navigate("/")}}>Log out</StyledButtonWhite>
        </Box>
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "100px 100px 100px 100px 100px 100px",
          columnGap: "10px",
          rowGap: "20px",
          fontFamily: ap.FONTFAMILY,
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item><Header text="Number"></Header></Grid>
                  <Grid item><Header text="Date"></Header></Grid>
                  <Grid item><Header text="Items"></Header></Grid>
                  <Grid item><Header text="Cost"></Header></Grid>
                  <Grid item><Header text="Status"></Header></Grid>
                  <Grid item><Header text="Paid"></Header></Grid>
            
                { orders.map((data, index) => ( 
              <React.Fragment>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}} >{data.number.toString().padStart(4, '0')}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}} >{formattedDate(data.created)}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}}>{data.items.length}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}}>{toFixed2(data.totalPay)} $</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}}>{"active"}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} ><Grid item sx={{textAlign: "center"}}>{data.paid + " $"}</Grid></Link>
                {/* <Grid item sx={{textAlign: "center"}}>
                  <IconButton size="small" aria-label="pay" sx={{backgroundColor: "#333", color: "#fff"}} onClick={(e)=> { window.open("https://show.cloudpayments.ru/widget/") }}><AttachMoneyIcon sx={{color: "#fff"}} /></IconButton>
                </Grid> */}
              </React.Fragment> ))}
        </Box>
        </Box> }

        { orderIndex != -1 && orders.length > 0 && <Box className="center-content" sx={{minHeight: "300px", padding: "0px 100px"}}>
        <Box sx={{display: "flex", alignItems: "center"}}>
          <PageHeader value={"Order no. " + orders[orderIndex].number + " / " + formattedDate(orders[orderIndex].created)}></PageHeader>
            <StyledButtonWhite sx={{ marginLeft: 'auto', p: 0}} onClick={(e)=>{setOrderIndex(-1); navigate("/orders")}}>Back to list</StyledButtonWhite>
            <StyledButtonWhite sx={{ ml: 2 }} onClick={(e)=>{logout(); navigate("/")}}>Log out</StyledButtonWhite>
        </Box> 
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "90px 90px 2fr 2fr 100px 1fr 90px 150px",
          columnGap: "8px",
          rowGap: "6px",
          fontFamily: ap.FONTFAMILY,
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item><Header text="Photo"></Header></Grid>
                  <Grid item><Header text="Art No."></Header></Grid>
                  <Grid item><Header text="Item name, design"></Header></Grid>
                  <Grid item><Header text="Colors"></Header></Grid>
                  {/* <Grid item><Header text="Design"></Header></Grid> */}
                  <Grid item><Header text="Ordered"></Header></Grid>
                  <Grid item><Header text="Details"></Header></Grid>
                  <Grid item><Header text="Price"></Header></Grid>
                  <Grid item><Header text="Status"></Header></Grid>
                  
            
                { orders[orderIndex].items.map((data, index) => ( 
              <React.Fragment>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={() => {setOrderIndex(index)}} >
                <Grid item sx={{textAlign: "center", display: "flex", flexDirection: "row", justifyContent: "center"}} >
                  {( !!data.imagePath && 
                      <img 
                        src={config.api + "/" + data.imagePath}
                        sx={{padding: "5px 5px 0 5px"}}
                        width={60}
                        height={55}
                        alt={data.itemName}
                    /> )}
                  {( !data.imagePath && 
                      <img 
                        src={config.api + "/public/noimage.jpg"}
                        sx={{padding: "5px 5px 0 5px"}}
                        width={60}
                        height={55}
                        alt={data.itemName}
                    /> )}                              
                </Grid>
                </Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center", verticalAlign:"top"}} >{data.artNo}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "left"}} >{data.itemName + " " + data.design}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "left"}} >{data.colorNo + " / " + data.colorNames}</Grid></Link>
                {/* <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.design}</Grid></Link> */}
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.quantity + " " + data.unit}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.details}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{formattedPrice(data.price)}&nbsp;$</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "left"}} >{orderStatusString(data)}</Grid></Link>
              </React.Fragment> ))}
        </Box>

          <Box sx={{display: "flex", flexDirection: "row", alignItems: "center"}} >
            <Box className="product-item">Total summ: {formattedPrice(totalPay)}&nbsp;$</Box>
          </Box>

        <Box sx={{display: "flex", alignItems: "flex-start", mt: 3}}>
          <IconButtonWhite aria-label="expand" onClick={toggleExpand} >
          <KeyboardArrowDownIcon sx={{ color: "#3d694a", fontSize: 26 }} >
          </KeyboardArrowDownIcon>
            &nbsp;Buy now
          </IconButtonWhite>
        </Box> 

        { expand && 
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
                  disabled={!agree || payerName.length < 6 || orders[orderIndex].items.findIndex(x => !x.details) != -1}
                  onClick={(e)=> { sendInvoice(orders[orderIndex]) }} >
                  {/*onClick={(e)=> { pay(orders[orderIndex].id, orders[orderIndex].total) }} >*/}
                  {/* <AttachMoneyIcon sx={{color: "#fff"}} /> */}
                  Continue
                </StyledIconButton>                          
            </Box>
        </Box> }

          { invoiceUrl.length > 0 && <Box sx={{display: "flex", flexDirection: "column", gap: "20px",  alignItems: "center", mt: 4 }} className="product-item" >
            
              <Box>Your invoice is ready</Box>
              
              <Box><Link to={invoiceUrl} sx={{pt: 2}} style={{ textDecoration: 'none' }} >
                Please click this link to download document
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

        </Box> }

        <br/><br/>

      <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
