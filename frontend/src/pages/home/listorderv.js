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
import { colors, FormControl, Icon } from "@mui/material";
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
import TextField from '@mui/material/TextField';
import { InputLabel } from "@mui/material"
import InputAdornment from '@mui/material/InputAdornment';
import Tooltip from '@mui/material/Tooltip';

import axios from 'axios'

import config from "../../config.json"
import PageHeader from './pageheader';
import Footer from './footer';
import Header from '../../components/header';
import Property from '../../components/property';
import MySelect from '../../components/myselect';
import { APPEARANCE } from '../../appearance';

import { fined, status, quantityInfo, computePrice } from "../../functions/helper"

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "900px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
//const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
//const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }
const buttonStyle = { height: 26, backgroundColor: "#222", color: APPEARANCE.WHITE, textTransform: "none" }
const disableStyle = { height: 26, backgroundColor: "#ccc", color: APPEARANCE.WHITE, textTransform: "none" }
const labelStyle = { m: 0, ml: 0, mr: 0 }
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0  }

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}


export default function ListOrderV(props) {

    const navigate = useNavigate();

    const [toggle, setToggle] = useState(false)
    const [orders, setOrders] = useState([])
    const [expand, setExpand] = useState([])
    const [detail, setDetail] = useState([])
    const [filter, setFilter] = useState(false)
    const [entity, setEntity] = useState('active orders');
    const [modified, setModified] = useState(false)


  const changeDetails = async (index) => {

  await axios.post(config.api + '/ChangeDetails', 
    {
      id: orders[index].id,
      details: orders[index].details,
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
                  delivered : d.delivered,
                  shipped   : d.shipped,
                  paid      : d.paid,
                  changes   : false,
                  deliveryNo: d.deliveryNo,
                  deliveryCompany : d.deliveryCompany,
                  }
              })
          setOrders(result)
          setFilter(false)
          setModified(false)

          setDetail(result.map((e)=> { return e.details }))

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
          gridTemplateColumns: "70px 1fr 1fr 70px 140px 60px 140px", // 60px",
          columnGap: "4px",
          rowGap: "0px",
          alignItems: "center" }}>
            <Grid item sx={{p:0, m:0}}><Header text="Photo"/></Grid>
            <Grid item sx={{p:0, m:0}}><Header text="Item name"/></Grid>
            <Grid item><Header text="Color"/></Grid>
            <Grid item><Header text="Ordered"/></Grid>
            <Grid item><Header text="Details"/></Grid>
            <Grid item><Header text="Status"/></Grid>
            <Grid item><Header text="Delivery"/></Grid>
            {/* <Grid item><Header text="Expand"/></Grid> */}

    {orders.map((data, index) => (
      <React.Fragment>
        <Link to={"/updateproduct?id=" + data.productId } style={{ textDecoration: 'none' }} >
          <Grid item>
                <Box sx={{padding: "8px 0 0 0" }}>
                  <img 
                    src={config.api + "/" + data.imagePath}
                    width={65}
                    height={45}
                    alt={data.itemName}
                /> 
                </Box>
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
        <Grid item sx={{display: "flex", flexDirection: "column", justifyContent: "center"}}>
          <Property value={quantityInfo(data)} textAlign="center" />
        </Grid>
        </Link>

        
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          {/* <Property value={fined(data.details, "-")} /> */}
            <TextField //label="Details"
                              margin="normal"
                              size="small" 
                              id={"valuedetails-" + index}
                              name={"valuedetails-" + index}
                              sx={{marginTop: "14px"}}
                              value={data.details}
                              onChange={ev => { setDetails(data.orderId, data.id, ev.target.value)}}
                              InputProps={{
                                
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Button onClick={(e)=>{ 
                                      console.log(e.target.value); 
                                      //return; 
                                      changeDetails(index) }} 
                                      edge="end" sx={{backgroundColor: "#777", color: "#fff", borderRadius: "2px", height: "26px", minWidth: "20px", fontSize: "14px", textTransform: "none"}}>set</Button>
                                  </InputAdornment>
                                ),
                              }} />
        </Grid>
        

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "row", justifyContent: "center"}}>
          <Tooltip title={status(data)}>
            <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px", marginTop: "10px"}} >
            { status(data)=="waiting"    && <QueryBuilderIcon  sx={{ color: "#888", fontSize: 24 }} /> } {/* waiting vendor */}
            { status(data)=="confirmed"  && <HandshakeIcon     sx={{ color: "#393", fontSize: 24 }} /> } {/* vendor accepted  */}
            { status(data)=="paid"       && <PaidIcon          sx={{ color: "#888", fontSize: 24 }} /> } {/* paid by client */}
            {/*{ status(data)=="in stock"   && <ViewInArIcon      sx={{ color: "#888", fontSize: 24 }} /> }*/} {/* in stock */}
            { status(data)=="shipping"   && <LocalShippingIcon sx={{ color: "#888", fontSize: 24 }} /> } {/* shipping */}
            { status(data)=="delivered"  && <RecommendIcon     sx={{ color: "#888", fontSize: 24 }} /> } {/* waiting vendor */}
            </Box>
          </Tooltip>
            {/* <Box sx={{color: "#888", fontSize: 14, padding: "1px 2px"}} >{status(data)}</Box> */}

            {/* <EmojiPeopleIcon sx={{ color: "#888", fontSize: 26 }} />
            <DoneIcon sx={{ color: "#888", fontSize: 26 }} />
            <ThumbUpOffAltIcon sx={{ color: "#888", fontSize: 26 }} />
            <SentimentSatisfiedAltIcon sx={{ color: "#888", fontSize: 26 }} /> */}
        </Grid>
        </Link>

        <Link to={"/updateproduct?id=" + data.productId} className="my-link" >
        <Grid item sx={{display: "flex", flexDirection: "column"}}>
          <MySelect 
                            id="addproduct-overworktype"
                            url="OverWorkTypes"
                            title="Overwork type"
                            valueName="overWorkName"
                            labelStyle={labelStyle}
                            itemStyle={itemStyle1}
                            MenuProps={MySelectProps}
                            //valueVariable={overworkType}
                            //setValueFn={setOverworkType}

                              //value={data.details}
                              //onChange={ev => { setDetails(data.orderId, data.id, ev.target.value)}}

                            //addNewFn={(e) => { console.log('todo - add new track company') }}
                            //data={overworkTypes}
                          />
        </Grid>
        </Link>

        {/* Expand down area:
         <IconButton aria-label="expand" sx={{backgroundColor: "#fff", borderRadius: "8px", margin: "6px" }}>
          <KeyboardArrowDownIcon
            sx={{ color: "#888", fontSize: 26, transform: expand[index]==true ? "rotate(0.5turn)" : "none" }}
            onClick={(e)=>{ toggleExpand(index) }} >
          </KeyboardArrowDownIcon>
        </IconButton>

         <Box className="row-border" sx={{ display: expand[index]==true ? "flex" : "none", justifyContent: "end" }}  >
          <Box sx={{width: 500}}>
            <TextField label="Details"
                              margin="normal"
                              size="small" 
                              id={"valuedetails-" + index}
                              name={"valuedetails-" + index}
                              sx = {{ width: 160, mt: '-3px', ml: 2, mr: 0, mb: '-3px' }}
                              value={data.details}
                              onChange={ev => { setDetails(data.orderId, data.id, ev.target.value)}}
                              InputProps={{
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <Button onClick={(e)=>{}} edge="end" sx={{backgroundColor: "#777", color: "#fff", borderRadius: "2px", height: "26px", minWidth: "20px", fontSize: "14px", textTransform: "none"}}>set</Button>
                                  </InputAdornment>
                                ),
                              }} />
          </Box>
         </Box> */}

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
