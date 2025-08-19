import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { colors } from "@mui/material";
import { Paid } from "@mui/icons-material";

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import { APPEARANCE } from '../../appearance';

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "900px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }

export default function ListOrderV(props) {

    const navigate = useNavigate();

    const [toggle, setToggle] = useState(false)
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [entity, setEntity] = useState('active orders');
    const [modified, setModified] = useState(false)


  const changeDetails = async (id, details) => {

  await axios.post(config.api + '/ChangeDetails', 
    {
      id: id,
      details: details,
    })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    })
  };

  const postAccept = async (itemId) => {

  await axios.post(config.api + '/Accept', 
    {
      itemId: itemId,
    })
    .then(function (response) {
      console.log(response);
      return true;
    })
    .catch(function (error) {
      console.log(error);
      return false;
    })
  };

    const handleAccept = (id) => {

      handleSave()

      postAccept(id)

      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].id == id) {
              ords[j].confirmByVendor = true;
              setOrders(ords)
              break
            }
          }


        setToggle(!toggle)
    }


    const handleSave = () => {
      
      for (let j=0; j< orders.length; j++) {
            if (orders[j].changes) {
              changeDetails(orders[j].id, orders[j].details)
            }
          }

         loadOrders()
    }

    const loadOrders = async (e) => {

      axios.get(config.api + '/OrderItems?vendorId=' + props.user.vendorId 
        //,{ params: { type: "vendorId", value: props.user.vendorId, id: null }}
      ).then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                  id        : d.id,
                  productId : d.productId,
                  orderId   : d.orderId,
                  imagePath : d.imagePath,
                  product   : d.itemName,
                  spec      : d.composition,
                  price     : d.price,
                  owner     : d.vendorName,
                  quantity  : d.quantity,
                  unit      : d.unit,
                  rollLength: d.rollLength,
                  colorNames: d.colorNames,
                  colorNo   : d.colorNo,
                  details   : d.details,
                  paid      : d.paid,
                  changes   : false,
                  confirmByVendor: d.confirmByVendor,
                  }
              })
          setOrders(result)
          setFilter(false)
          setModified(false)
          })      
      .catch (error => {
        console.log(error)
      })
    }

    const setDetails = (orderId, id, value) => {

      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
        if (ords[j].orderId == orderId && ords[j].id == id) {
              ords[j].details = value
              ords[j].changes = true;
              setOrders(ords)
              setModified(true)
              break
            }
          }

      console.log('set details')
      console.log(id)
      console.log(value)
    }

    const changeEntity = (e, index) => {
      setEntity(e.target.value)
    }
        
    useEffect(() => {
      loadOrders()
    }, [entity,toggle]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  const changes = orders.map(e => e.changes).indexOf(true) != -1
  //console.log("orders")
  //console.log(orders)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      
      <Container sx={{padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
        <Box component="form" noValidate style={outboxStyle}>

        {/* <Box gutterBottom/> */}
        <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pb: 2, pr: 6, textAlign: "center" }} > {"Orders list of " + props.user.vendorName}</Box> 
          
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "70px 1fr 1fr 70px 100px 140px 60px",
          columnGap: "4px",
          rowGap: "20px",
          alignItems: "center" }}>
            <Grid item sx={{p:0, m:0}}><Header text="Photo"></Header></Grid>
            <Grid item sx={{p:0, m:0}}><Header text="Item name"></Header></Grid>
            <Grid item><Header text="Color"></Header></Grid>
            <Grid item><Header text="Amount"></Header></Grid>
            <Grid item><Header text="Status"></Header></Grid>
            <Grid item><Header text="Details"></Header></Grid>
            <Grid item></Grid>
        </Box>

          {/* <MyGrid 
              key={"orders-grid"}
              show = {{
                image: true,
                product: true, 
                spec: false, 
                //owner: true, 
                colorNames: true,
                price: false, 
                quantity: true, 
                details: false, 
                client: false,
                number: false,
                paid: true,
              }}
              edit = {{ details: true }}
              button = {{ confirm: true }}
              setDetails={setDetails} 
              handleAccept={handleAccept} 
              entity = {entity}
              entities = {entities}
              changeEntity = {changeEntity}
              title = "Order list"
              data={{items: orders}} /> */}

            <Button 
              variant="contained"
              style={changes ? buttonStyle : disableStyle}
              //sx= {changes ? buttonStyle : disableStyle}
              //disabled={!changes}
              onClick={handleSave} >
                  Save
            </Button>

          </Box>
          <br/>
          <br/>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
