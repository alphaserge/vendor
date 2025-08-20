import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { Link } from 'react-router-dom';
import { colors } from "@mui/material";
import { Paid } from "@mui/icons-material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import EmojiPeopleIcon from '@mui/icons-material/EmojiPeople';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import HandshakeIcon from '@mui/icons-material/Handshake';
import PaidIcon from '@mui/icons-material/Paid';
import DoneIcon from '@mui/icons-material/Done';
import RecommendIcon from '@mui/icons-material/Recommend';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import QueryBuilderIcon from '@mui/icons-material/QueryBuilder';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import ViewInArIcon from '@mui/icons-material/ViewInAr';


import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import Property from '../../components/property';
import { APPEARANCE } from '../../appearance';

import { fined, status, computePrice } from "../../functions/helper"

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "900px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
//const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
//const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }
const buttonStyle = { height: 26, backgroundColor: "#222", color: APPEARANCE.WHITE, textTransform: "none" }
const disableStyle = { height: 26, backgroundColor: "#ccc", color: APPEARANCE.WHITE, textTransform: "none" }

export default function ListOrderV(props) {

    const navigate = useNavigate();

    const [toggle, setToggle] = useState(false)
    const [orders, setOrders] = useState([])
    const [expand, setExpand] = useState([])
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

    const toggleExpand = (index) => {
      let exp = [...expand]
      exp[index] = !exp[index]
      setExpand(exp)
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
                  itemName  : d.itemName,
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

          const desiredLength = result.length;
          const filledArray = new Array(desiredLength).fill(false);
          const art = new Array(3).fill(false)
          setExpand(new Array(desiredLength).fill(false))
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
  console.log("orders")
  console.log(orders)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      
      <Container sx={{padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
        <Box component="form" noValidate style={outboxStyle}>

        {/* <Box gutterBottom/> */}
        <Box sx={{ fontWeight: "400", fontSize: "16px", pt: 3, pb: 3, pr: 6, textAlign: "left" }} > {"Orders list of " + props.user.vendorName}</Box> 
          
        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: "70px 1fr 1fr 70px 100px 140px 60px",
          columnGap: "0px",
          rowGap: "20px",
          alignItems: "center" }}>
            <Grid item sx={{p:0, m:0}}><Header text="Photo"/></Grid>
            <Grid item sx={{p:0, m:0}}><Header text="Item name"/></Grid>
            <Grid item><Header text="Color"/></Grid>
            <Grid item><Header text="Amount"/></Grid>
            <Grid item><Header text="Status"/></Grid>
            <Grid item><Header text="Details"/></Grid>
            <Grid item><Header text="Expand"/></Grid>

    {orders.map((data, index) => (
      <React.Fragment>
        <Link to={"/updateproduct?id=" + data.productId } style={{ textDecoration: 'none' }} >
          <Grid item>
                
                  <img 
                    src={config.api + "/" + data.imagePath}
                    sx={{padding: "0 10px"}}
                    width={65}
                    height={65}
                    alt={data.itemName}
                /> 
                </Grid></Link>
                
        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={fined(data.itemName, "-")}  />
        </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={data.colorNames} />
        </Grid>
        </Link>
       
        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={data.quantity} />
        </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={status(data)} />
        </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <Property value={fined(data.details, "-")} />
        </Grid>
        </Link>

        <IconButton aria-label="expand" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "6px" }}>
          <KeyboardArrowDownIcon
            sx={{ color: "#888", fontSize: 26, transform: expand[index]==true ? "rotate(0.5turn)" : "none" }}
            onClick={(e)=>{ toggleExpand(index) }} >
          </KeyboardArrowDownIcon>
        </IconButton>

         <Box className="row-border" sx={{ display: expand[index]==true ? "flex" : "none", justifyContent: "end" }}  >
          <Button 
            variant="contained"
            //sx={{buttonStyle}}
            sx={!!data.details || !!data.confirmByVendor ? disableStyle : buttonStyle}
            disabled={!!data.details || !!data.confirmByVendor }
            onClick={(e) => { handleAccept(data.id) }} >
                Accept
          </Button>
         </Box>

      </React.Fragment>
    ))}

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
