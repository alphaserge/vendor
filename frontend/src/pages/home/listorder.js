import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';

import axios from 'axios'

import config from "../../config.json"
import Header from './header';
import Footer from './footer';
import MyOrders from '../../components/myorders';
import { getOrders, vendorQuantity } from '../../api/orders'
import { APPEARANCE } from '../../appearance';

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

export default function ListOrder(props) {

    const navigate = useNavigate();

    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [view,   setView  ] = useState("rows")
    const [viewAs, setViewAs] = React.useState('incoming orders');
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }

    const handleChangeViewAs = (event) => {
      setViewAs(event.target.value);
    };    

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
                items   : d.items.map((it) => { return {
                  id        : it.id,
                  imagePath : it.imagePath,
                  product   : it.itemName,
                  spec      : it.composition,
                  price     : it.price,
                  vendor    : it.vendorName,
                  quantity  : it.quantity,
                  quantity2 : it.vendorQuantity ? it.vendorQuantity : "",
              }})
              }
          });
          
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
        
    useEffect(() => {
      loadOrders()
    }, [viewAs]);

  if (!props.user || props.user.Id == 0) {
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

          <Box sx={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <Typography gutterBottom variant="h6" component="div" mr={4} className="order-header" sx={{flexGrow: 1}} ><b>Vendor orders list</b></Typography>
            <InputLabel id="demo-simple-select-label" sx={{pr:2}}>Show:</InputLabel>
            <Select
              id="view-as-select"
              size="small"
              value={viewAs}
              onChange={handleChangeViewAs}>
              <MenuItem value={'incoming orders'}>incoming orders</MenuItem>
              <MenuItem value={'paid orders'}>paid orders</MenuItem>
              <MenuItem value={'closed orders'}>closed orders</MenuItem>
            </Select>
          </Box>

          { viewAs != "dummy" &&
          <MyOrders data={orders} 
            show = {{
              image: true,
              product: true, 
              spec: false, 
              vendor: true, 
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
