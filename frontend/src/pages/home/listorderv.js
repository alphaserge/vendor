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
import MyGrid from './../../components/mygrid';
import MyOrders from '../../components/myorders';
import { APPEARANCE } from '../../appearance';
import { colors } from "@mui/material";

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
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
      /*let ords = [...orders]
          for (let i=0; i< ords[i].items.length; i++) {
            if (ords[i].items[i].id == itemId) {
              ords[i].items[i].confirmByVendor = Date.now()
              if (ords[i].items[i].details==null && 
                  ords[i].items[i].rollLength != null &&
                  ords[i].items[i].quantity != null) {
                let q = ords[i].items[i].quantity
                let r = ords[i].items[i].rollLength
                let n = Math.floor(q / r)
                let details = "";
                if (n > 0) {
                  details = n + "r"
                }
                q -= r*n
                details += "+"+q
              }
              break
            }
          
        }
        setOrders(ords)*/
        setToggle(!toggle)
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

      let api = config.api + '/Orders/OrderItems?id=3'// config.api + '/Orders' //'/VendorOrders?vendorId=' + props.user.vendorId
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
                  id        : d.id,
                  imagePath : d.imagePath,
                  product   : d.itemName,
                  spec      : d.composition,
                  price     : d.price,
                  owner     : d.vendorName,
                  quantity  : d.quantity,
                  unit      : d.unit,
                  rollLength : d.rollLength,
                  colorNames: d.colorNames,
                  details   : d.details,
                  changes   : false,
                  confirmByVendor: d.confirmByVendor
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
    }, [entity,toggle]);

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
          <MyGrid 
              key={"orders-grid"}
              show = {{
                image: true,
                product: true, 
                spec: false, 
                //owner: true, 
                colorNames: true,
                price: true, 
                quantity: true, 
                details: false, 
                client: true
              }}
              edit = {{ details: true }}
              button = {{ confirm: true }}
              setDetails={setDetails} 
              handleAccept={handleAccept} 
              entity = {entity}
              entities = {entities}
              changeEntity = {changeEntity}
              title = "Order list"
              data={{items: orders}} />
          }

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
