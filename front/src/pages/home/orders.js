import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useSelector } from 'react-redux'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Grid';
import LocalAtmIcon from '@mui/icons-material/LocalAtm';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

import axios from 'axios'

import config from "../../config.json"
import Footer from './footer';
import { APPEARANCE as ap} from '../../appearance';
import { appBarClasses, Button, colors } from "@mui/material";

import PageHeader from '../../components/pageheader';
import Header from '../../components/header';
import MainSection from './mainsection';
import { idFromUrl, formattedDate } from "../../functions/helper";
import StyledButton from '../../components/styledbutton';

const defaultTheme = createTheme()

const linkStyle = { textDecoration: 'none', color: ap.COLOR }

export default function Orders(props) {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [view, setView] = useState("order")  // "order" or "items"

  const viewItems = () => {
    setView("items")
  }

    const loadOrders = async (e) => {

      if (!props.data.user) {
        navigate("/login")
        return
      }

      let id = idFromUrl()

      let api = config.api + '/Orders'
      console.log('api:')
      console.log(api)
      console.log(props.data.user.email)
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
                shippedByVendor : d.shippedByVendor,
                changes : false,
                items   : ( !!d.items ? d.items.map((it) => { return {
                  id        : it.id,
                  productId : it.productId,
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
                  confirmByVendor: it.confirmByVendor,
                  status: it.confirmByVendor != null ? "confirmed" : (it.confirmByVendor != null ? "shipped" : (it.inStock != null ? "in stock" : (it.shippedToClient != null ? "shipped to client" : (it.recievedByClient != null ? "recieved" : "ordered"))))
                  }}) : [])
              }
          });

          result = result.filter((i)=> { return i.items.length > 0})

          if (!!id) {
            setView("items")
            result = result.filter((i)=> { return i.id == id})
          }

          setOrders(result)
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
      let id = idFromUrl()
      if (!!id) {
        setView("items")
      } else {
        setView("order")
      }
    loadOrders()
    }, [])// [entity, toggle]);

  if (!props.data.user || props.data.user.Id === 0) {
    navigate("/login")
  }
  

  console.log("orders: ")
  console.log(orders)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <MainSection
        user={props.user}
        //searchProducts={searchProducts}
        data={props.data}/>

        { (view == "order") && <Box className="center-content" sx={{minHeight: "300px", padding: "0px 100px"}}>
        <PageHeader value="Your orders list"></PageHeader>
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
                  <Grid item><Header text="Pay"></Header></Grid>
            
                { orders.map((data, index) => ( 
              <React.Fragment>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} onClick={viewItems} ><Grid item sx={{textAlign: "center"}} >{data.number.toString().padStart(4, '0')}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} ><Grid item sx={{textAlign: "center"}} >{formattedDate(data.created)}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} ><Grid item sx={{textAlign: "center"}}>{data.items.length}</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} ><Grid item sx={{textAlign: "center"}}>{data.items.reduce((n, currentItem) => n + currentItem.quantity*currentItem.price, 0)} $</Grid></Link>
                <Link to={"/orders?id=" + data.id } style={{ textDecoration: 'none', color: ap.COLOR }} ><Grid item sx={{textAlign: "center"}}>{"active"}</Grid></Link>
                <Grid item sx={{textAlign: "center"}}>
                  <IconButton size="small" aria-label="pay" sx={{backgroundColor: "#222", color: "#fff"}} onClick={(e)=> { navigate("/pay?id=" + data.id)}}><AttachMoneyIcon sx={{color: "#fff"}} /></IconButton>
                </Grid>
              </React.Fragment> ))}
        </Box>
        </Box> }

        { view == "items" && orders.length > 0 && <Box className="center-content" sx={{minHeight: "300px", padding: "0px 100px"}}>
        <Box sx={{display: "flex", alignItems: "center"}}><PageHeader value={"Order no. " + orders[0].number + " / " + formattedDate(orders[0].created)}></PageHeader><Button sx={{ height: "32px", ml: 2, textTransform: "none", color: "#222", border: "1px solid #888"}} onClick={(e)=>{setView("order")}}>Back to list</Button> </Box> 
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "1fr 1fr 1fr 1fr 100px 1fr 90px 90px",
          columnGap: "10px",
          rowGap: "20px",
          fontFamily: ap.FONTFAMILY,
          fontSize: "16px",
          alignItems: "center" }}>
                  <Grid item><Header text="Item name"></Header></Grid>
                  <Grid item><Header text="Art/Ref No."></Header></Grid>
                  <Grid item><Header text="Colors"></Header></Grid>
                  <Grid item><Header text="Design"></Header></Grid>
                  <Grid item><Header text="Quantity"></Header></Grid>
                  <Grid item><Header text="Details"></Header></Grid>
                  <Grid item><Header text="Price"></Header></Grid>
                  <Grid item><Header text="Status"></Header></Grid>
            
                { orders[0].items.map((data, index) => ( 
              <React.Fragment>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.itemName}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.artNo + " / " + data.refNo}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.colorNo + " / " + data.colorNames}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.design}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.quantity + " " + data.unit}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.details}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.price}</Grid></Link>
                <Link to={"/product?id=" + data.productId } style={linkStyle} ><Grid item sx={{textAlign: "center"}} >{data.status}</Grid></Link>
              </React.Fragment> ))}

                  <IconButton size="small" aria-label="pay" sx={{backgroundColor: "#222", color: "#fff"}} onClick={(e)=> { navigate("/pay?id=" + orders[0].id)}}><AttachMoneyIcon sx={{color: "#fff"}} /></IconButton>
        </Box>
        </Box> }

        <br/><br/>

      <Footer sx={{ mt: 2, mb: 2 }} />

    </ThemeProvider>
  );
}
