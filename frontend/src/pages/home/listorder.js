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

import MyGrid from '../../components/mygrid';

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }

export default function ListOrder(props) {

    const navigate = useNavigate();

    const [toggle, setToggle] = useState(false)
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [entity, setEntity] = useState('active orders');
    const [modified, setModified] = useState(false)

    const handleSave = (event) => {
      
      let ords = [...orders]
      for (let j=0; j< ords.length; j++) {
          for (let i=0; i< ords[j].items.length; i++) {
            if (ords[j].items[i].changes) {
              //changeDetails(ords[j].items[i].id, ords[j].items[i].details)
            }
          }
        }
        setOrders(ords)
        setToggle(!toggle)
         //loadOrders()
    }

    const loadOrders = async (e) => {

      let api = config.api + '/Orders'// config.api + '/Orders' //'/VendorOrders?vendorId=' + props.user.vendorId

      axios.get(api, /* { params: { name: itemName, artno: artNo, search: search }}*/)
      .then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                id      : d.id,
                created : d.created,
                number  : d.number,
                vendor  : d.vendorName,
                client  : d.clientName,
                phone   : d.clientPhone,
                changes : false,
                paid    : d.paid,
                shippedByVendor : d.shippedByVendor,
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
                  confirmByVendor: it.confirmByVendor,
                  status: it.confirmByVendor != null ? "confirmed" : (it.confirmByVendor != null ? "shipped" : (it.inStock != null ? "in stock" : (it.shippedToClient != null ? "shipped to client" : (it.recievedByClient != null ? "recieved" : "ordered"))))
                  }}) : [])
              }
          });

          //result = result.filter((i)=> { return i.items.length > 0})

          // if (entity == 'delivered orders'){
          //   result = result.filter((i)=> { return i.items.length > 0})
          // }
          
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
    }, [entity, toggle]);

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
        <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pr: 6, textAlign: "center" }} > {"Orders list of " + props.user.vendorName}</Box> 

          { orders.map((item, index) => (
          <MyGrid 
            className={"orders-grid"}
            key={"orders-grid-"+index}
            show = {{
              image: true,
              product: true, 
              spec: false, 
              owner: true, 
              colorNames: true,
              price: true, 
              quantity: true, 
              details: false, 
              client: true,
              details: true,
              vendor: true,
              status: true,
              number: true,
              paid: true,
            }}
            edit = {{ details: false }}
            button = {{ confirm: false }}
            data={item} 
            index={index} 
            orderId={item.id}
            setDetails={props.setDetails}
            handleAccept={props.handleAccept} />
          ))}
        </Box>
          <br/>
          <br/>
        </div>
        <Footer sx={{ mt: 2, mb: 2 }} />
         </Container>
              
    </ThemeProvider>
  );
}
