import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import axios from 'axios'

import config from "../../config.json"
import Header from './header';
import Footer from './footer';
import MyOrders from '../../components/myorders';
import { APPEARANCE } from '../../appearance';
import { colors } from "@mui/material";

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['incoming orders', 'sent orders', 'recieved orders']
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }

export default function ListOrder(props) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [entity, setEntity] = useState('incoming orders');
    const [modified, setModified] = useState(false)


  const changeDetails = async (id, details) => {

  await axios.post(config.api + '/Orders/ChangeDetails', 
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

  const setAccept = async (itemId) => {

  await axios.post(config.api + '/Orders/Accept', 
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

    const handleAccept = (itemId) => {
      let d = itemId;
      setAccept(itemId)
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
          for (let i=0; i< ords[j].items.length; i++) {
            if (ords[j].items[i].id == itemId) {
              ords[j].items[i].confirmByVendor = Date.now()
              break
            }
          }
        }
        setOrders(ords)
    }


    const handleSave = (event) => {
      
      for (let j=0; j< orders.length; j++) {
          for (let i=0; i< orders[j].items.length; i++) {
            if (orders[j].items[i].changes) {
              changeDetails(orders[j].items[i].id, orders[j].items[i].details)
            }
          }
        }

         loadOrders()
    }

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
                id: d.id,
                created : d.created,
                number  : d.number,
                vendor  : d.vendorName,
                client  : d.vendorName,
                phone   : d.clientPhone,
                changes : false,
                items   : ( !!d.items ? d.items.map((it) => { return {
                  id        : it.id,
                  imagePath : it.imagePath,
                  product   : it.itemName,
                  spec      : it.composition,
                  price     : it.price,
                  owner    : it.vendorName,
                  quantity  : it.quantity,
                  unit: it.unit,
                  colorNames: it.colorNames,
                  details : it.details,
                  changes : false,
                  confirmByVendor: it.confirmByVendor
                  }}) : [])
              }
          });

          result = result.filter((i)=> { return i.items.length > 0})
          
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
        if (ords[j].id == orderId) {
          for (let i=0; i< ords[j].items.length; i++) {
            if (ords[j].items[i].id == id) {
              ords[j].items[i].details = value
              ords[j].items[i].changes = true;
              ords[j].changes = true;
              setOrders(ords)
              setModified(true)
              break
            }
          }
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
    }, [entity]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  const changes = orders.map(e => e.changes).indexOf(true) != -1
  console.log("changes: " + changes)

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
              //owner: true, 
              colorNames: true,
              price: true, 
              quantity: true, 
              details: false, 
            }}
            edit = {{ details: true }}
            button = {{ confirm: true }}
            setDetails={setDetails} 
            handleAccept={handleAccept} 
            /> }

            <Button 
              variant="contained"
              style={changes ? buttonStyle : disableStyle}
              //sx= {changes ? buttonStyle : disableStyle}
              disabled={!changes}
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
