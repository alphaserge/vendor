import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useSelector } from 'react-redux'

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import axios from 'axios'

import config from "../../config.json"
import Footer from './footer';
import { APPEARANCE } from '../../appearance';
import { colors } from "@mui/material";

import MainSection from './mainsection';

const defaultTheme = createTheme()
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const entities = ['active orders', 'delivered orders']
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, color: APPEARANCE.WHITE, m: 1 }
const disableStyle = { width: 90, height: 40, backgroundColor: "#ccc", color: APPEARANCE.WHITE, m: 1 }

export default function Orders(props) {

  const navigate = useNavigate();
  const [orders, setOrders] = useState([])

    const cartCount = useSelector((state) => state.cart.items.length)
    const shopCart = useSelector((state) => state.cart.items)

    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [textileTypes, setTextileTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [printTypes, setPrintTypes] = useState([])
    const [productStyles, setProductStyles] = useState([])
    
    const [selectedTextileType, setSelectedTextileType] = useState([])
    const [selectedDesignType, setSelectedDesignType] = useState([])
    const [selectedSeason, setSelectedSeason] = useState([])
    const [selectedColor, setSelectedColor] = useState([])
    const [selectedPrintType, setSelectedPrintType] = useState([])
    const [selectedProductType, setSelectedProductType] = useState([])
    const [selectedOverworkType, setSelectedOverworkType] = useState([])

    const [products, setProducts] = useState([])
    const [search, setSearch] = useState("")

    const shoppingCartRef = useRef()
    
const handleShowShoppingCart = (event) => {
    if (shoppingCartRef.current) {
      shoppingCartRef.current.displayWindow(true);
    }
   }


    const searchProducts = async (e) => {

      setSearch(e)
      axios.get(config.api + '/Products/Products?id='+props.user.id,
        { params:
            {
              search: e
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
      })
      .catch (error => {
        console.log(error)
      })
    }


  const loadOrders = async (e) => {

    let api = config.api + '/ClientOrders'

      axios.get(api, { type: "client", value: props.user.email })
      .then(function (res) {
          var result = res.data.map((d) => 
          {
              return {
                id: d.id,
                created : d.created,
                number  : d.number,
                vendor  : d.vendorName,
                client  : d.clientName,
                phone   : d.clientPhone,
                shippedByVendor : d.shippedByVendor,
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
                  confirmByVendor: it.confirmByVendor,
                  status: it.confirmByVendor != null ? "confirmed" : (it.confirmByVendor != null ? "shipped" : (it.inStock != null ? "in stock" : (it.shippedToClient != null ? "shipped to client" : (it.recievedByClient != null ? "recieved" : "ordered"))))
                  }}) : [])
              }
          });

          result = result.filter((i)=> { return i.items.length > 0})

          /*if (entity == 'delivered orders'){
            result = result.filter((i)=> { return i.items.length > 0})
          }*/
          
          setOrders(result)
          //setFilter(false)
          //setModified(false)
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

    const dropFilters = (e) => {
      setSelectedTextileType([])
      setSelectedDesignType([])
      setSelectedSeason([])
      setSelectedColor([])
      setSelectedPrintType([])
      setSelectedProductType([])
      setSelectedOverworkType([])
    }


    const changeEntity = (e, index) => {
      //setEntity(e.target.value)
    }
        
    useEffect(() => {
      loadOrders()
    }, [])// [entity, toggle]);

  if (!props.user || props.user.Id === 0) {
    navigate("/")
  }

  const changes = orders.map(e => e.changes).indexOf(true) != -1
  console.log("changes: " + changes)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

       <MainSection
          user={props.user}
          title={props.title}
          searchProducts={searchProducts}
          textileTypes={textileTypes}
          designTypes={designTypes}
          seasons={seasons}
          colors={colors}
          printTypes={printTypes}
          productTypes={productTypes}
          cart={shopCart}
          openShoppingCart={handleShowShoppingCart}
          setSeason       = {(v)=>{ dropFilters(); setSelectedSeason(v)}}
          setTextileType  = {(v)=>{ dropFilters(); setSelectedTextileType(v)}}
          setDesignType   = {(v)=>{ dropFilters(); setSelectedDesignType(v)}}
          setColor        = {(v)=>{ dropFilters(); setSelectedColor(v)}}
          setPrintType    = {(v)=>{ dropFilters(); setSelectedPrintType(v)}}
          setOverworkType = {(v)=>{ dropFilters(); setSelectedOverworkType(v)}}
          />
      
              
    </ThemeProvider>
  );
}
