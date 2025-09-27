import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Home from './pages/home/home';
import UpdateProduct from './pages/home/updateproduct';
import Product from './pages/home/product';
import BuySample from './pages/home/buysample';
import AddProduct from './pages/home/addproduct';
import ListProduct from './pages/home/listproduct';
import Orders from './pages/home/orders';
import ShoppingCart from './pages/home/shoppingcart';
import Menu from './pages/home/menu';
import Login from './pages/auth/login';
import Logout from './pages/auth/logout';
import Register from './pages/auth/register';
import Confirm from './pages/auth/confirm';
import Info from './pages/auth/info';
import Error from './pages/auth/error';
import Success from './pages/auth/success';
import PrimarySearchAppBar from './pages/home/header';
import { addShoppingCart, getShoppingCart, setShoppingCart } from './functions/shoppingcart';
import axios from 'axios'

import config from "./config.json"

import './App.css';
import './components/menu.css';
import { useEffect, useState } from 'react';

const emptyUser = {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phones: "",
    roles: [],
    isLocked: true,
    vendorId: 0,
    vendor: ""
}

const userInitialValue = () => {
  return JSON.parse(localStorage.getItem("user")) || emptyUser
};

const theme = createTheme({
  overrides: {
    MuiCheckbox: {
      colorSecondary: {
        color: '#aaa',
        '&$checked': {
          color: '#888',
        },
      },
    },
  },
  typography: {
      fontFamily: ['Poppins', 'Noto Sans Japanese', 'Arial'].join(','),
  },  
});

function App() {
  
  const [loggedIn, setLoggedIn] = useState(false)
  const [cart, setCart] = useState(getShoppingCart())

    const logOut = () => {
    setData({user: emptyUser, logOut: logOut})
    setLoggedIn(false)
    localStorage.setItem("user", JSON.stringify(emptyUser));
  }

  const [data, setData] = useState({user: userInitialValue(), logOut: logOut})

  const addToCart = (item) => {
    cart.push(item)
    setCart(cart)
    setShoppingCart(cart)
  }

  const updateCart = (cart) => {
    setCart(cart)
    setShoppingCart(cart)

    console.log('updateCart')
    console.log(cart)
  }

  const loadData = () => {
    var d = {...data}
    //--
    axios.get(config.api + '/Seasons')
    .then(function (res) {
        d.seasons = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/Colors')
    .then(function (res) {
        d.colors = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/DesignTypes')
    .then(function (res) {
        d.designTypes = res.data.map((item)=>({ id:item.id, value:item.designName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/OverworkTypes')
    .then(function (res) {
        d.overworkTypes = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/ProductTypes')
    .then(function (res) {
        d.productTypes = res.data.map((item)=>({ id:item.id, value:item.typeName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/ProductStyles')
    .then(function (res) {
        d.productStyles = res.data.map((item)=>({ id:item.id, value:item.styleName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/TextileTypes')
    .then(function (res) {
        d.textileTypes = res.data.map((item)=>({ id:item.id, value:item.textileTypeName }))
    })
    .catch (error => {
      console.log(error)
    })
    //--
    axios.get(config.api + '/PrintTypes')
    .then(function (res) {
        d.printTypes = res.data.map((item)=>({ id:item.id, value:item.typeName }))
    })
    .catch (error => {
      console.log(error)
    })

    axios.get(config.api + '/DesignTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.designName }))
        d.designTypes = items
        setData(d)

    })
    .catch (error => {
      console.log('App.js loadDesignTypes error:' )
      console.log(error)
    })

    setData(d)
  }

  useEffect(() => {

    loadData()

    const user = JSON.parse(localStorage.getItem("user"))

    if (!user || !user.token) {
      setLoggedIn(false)
      return
    }

    // If the token exists, verify it with the auth server to see if it is valid
    /*fetch("http://localhost:3080/Auth/verify", {
            method: "POST",
            headers: {
                'jwt-token': user.token
              }
        })
        .then(r => r.json())
        .then(r => {
            setLoggedIn('success' === r.message)
            setEmail(user.email || "")
        })*/
  }, [])

  return (
    <ThemeProvider theme={theme}>
    <div style={{ width: "100%" }} >
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home data={data} />} />
          <Route path="/login" element={<Login data={data} setData={setData} />} />
          <Route path="/logout" element={<Logout data={data} setData={setData} />} />
          <Route path="/register" element={<Register data={data} />} setData={setData} />
          <Route path="/confirm" element={<Confirm data={data} setData={setData} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<Error />} />
          <Route path="/addproduct" element={<AddProduct data={data} />} />
          <Route path="/updateproduct" element={<UpdateProduct data={data} />} />
          <Route path="/listproduct" element={<ListProduct data={data} />} />
          <Route path="/product" element={<Product data={data} />} />
          <Route path="/orders" element={<Orders data={data} />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/shoppingcart" element={<ShoppingCart data={data} />} />
          <Route path="/buysample" element={<BuySample data={data} />} />
          {/* <Route path="/header" element={<PrimarySearchAppBar />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
    </ThemeProvider>
  );
}

export default App;
