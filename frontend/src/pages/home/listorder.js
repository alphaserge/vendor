import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';

import axios from 'axios'

import config from "../../config.json"
import Header from './header';
import Footer from './footer';
import MyOrders from '../../components/myorders';

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['incoming orders', 'sent orders', 'recieved orders']

export default function ListOrder(props) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [entity, setEntity] = useState('incoming orders');
    
    const loadOrders = async (e) => {

      let api = config.api + '/Orders'// config.api + '/Orders' //'/VendorOrders?vendorId=' + props.user.vendorId
      /*if (viewAs == 'incoming orders') {
        api += '&status=incoming'
      }
      if (viewAs == 'sent orders') {
        api += '&status=sent'
      }
      if (viewAs == 'recieved orders') {
        api += '&status=recieved'
      }*/

      axios.get(api, /* { params: { name: itemName, artno: artNo, search: search }}*/)
      .then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                created : d.created,
                number  : d.number,
                vendor  : d.vendorName,
                client  : d.clientName,
                phone   : d.clientPhone,
                items   : ( !!d.items ? d.items.map((it) => { return {
                  id        : it.id,
                  imagePath : it.imagePath,
                  product   : it.itemName,
                  spec      : it.composition,
                  price     : it.price,
                  owner    : it.vendorName,
                  quantity  : it.quantity,
                  quantity2 : it.vendorQuantity ? it.vendorQuantity : ""
                  }}) : [])
              }
          });

          result = result.filter((i)=> { return i.items.length > 0})
          
          setOrders(result)
          setFilter(false)
      })
      .catch (error => {
        console.log(error)
      })
    }

    const setQuantity2 = (id, value) => {
      console.log('set quantity2')
    }

    const changeEntity = (e, index) => {
      setEntity(e.target.value)
    }
        
    useEffect(() => {
      loadOrders()
    }, [entity]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      
      <Container sx={{padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
        <Box component="form" noValidate style={outboxStyle}>

          { entity !== "dummy" &&
          <MyOrders 
            data={orders} 
            entity = {entity}
            entities = {entities}
            changeEntity = {changeEntity}
            title = "Your orders list"
            show = {{
              image: true,
              product: true, 
              spec: false, 
              owner: true, 
              price: true, 
              quantity: true, 
              quantity2: false, 
            }}
            edit = {{ quantity2: true }}
            setQuantity2={setQuantity2} 
            /> }

          </Box>
          <br/>
          <br/>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
