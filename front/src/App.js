import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/home/home';
import UpdateProduct from './pages/home/updateproduct';
import AddProduct from './pages/home/addproduct';
import ListProduct from './pages/home/listproduct';
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
import { useEffect, useState } from 'react';

const userInitialValue = () => {
  return JSON.parse(localStorage.getItem("user")) || {
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phones: "",
    roles: [],
    isLocked: true,
    vendorId: 0,
    vendor: ""
  };
};

function App() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState(userInitialValue)
  const [seasons, setSeasons] = useState([])
  const [colors, setColors] = useState([])
  const [designTypes, setDesignTypes] = useState([])
  const [overworkTypes, setOverworkTypes] = useState([])
  const [productTypes, setProductTypes] = useState([])
  const [productStyles, setProductStyles] = useState([])
  const [cart, setCart] = useState(getShoppingCart())

  /*useState({
    id: 0,
    firstName: "",
    lastName: "",
    email: "",
    phones: "",
    roles: [],
    isLocked: true,
    vendorId: 0,
    vendor: ""
  })*/

  const [lastAction, setLastAction] = useState("")

  const addToCart = (item) => {
    cart.push(item)
    setCart(cart)
  }

  const loadSeasons = () => {
    axios.get(config.api + '/Seasons')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
        setSeasons(items)
    })
    .catch (error => {
      console.log('Addproduct loadSeasons error:' )
      console.log(error)
    })
  }

  const loadColors = () => {
    axios.get(config.api + '/Colors')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
        setColors(items)
    })
    .catch (error => {
      console.log('Addproduct loadColors error:' )
      console.log(error)
    })
  }
  
  const loadDesignTypes = () => {
    axios.get(config.api + '/DesignTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.designName }))
        setDesignTypes(items)
    })
    .catch (error => {
      console.log('Addproduct loadDesignTypes error:' )
      console.log(error)
    })
  }
  
  const loadOverworkTypes = () => {
    axios.get(config.api + '/OverworkTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
        setOverworkTypes(items)
    })
    .catch (error => {
      console.log('Addproduct loadDesignTypes error:' )
      console.log(error)
    })
  }
  
  const loadProductTypes = () => {
    axios.get(config.api + '/ProductTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
        setProductTypes(items)
    })
    .catch (error => {
      console.log('Addproduct loadProductTypes error:' )
      console.log(error)
    })
  }
  
  const loadProductStyles = () => {
    axios.get(config.api + '/ProductStyles')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.styleName }))
        setProductStyles(items)
    })
    .catch (error => {
      console.log('Addproduct loadProductStyles error:' )
      console.log(error)
    })
  }

  useEffect(() => {
    //...
  }, [cart])

  useEffect(() => {

    loadColors()
    loadSeasons()
    loadDesignTypes()
    loadOverworkTypes()
    loadProductTypes()
    loadProductStyles()

    // Fetch the user email and token from local storage
    const user = JSON.parse(localStorage.getItem("user"))

    // If the token/email does not exist, mark the user as logged out
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


  console.log("cart::")
  console.log(cart.length)

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn} cart={cart} addToCart={addToCart} />} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/confirm" element={<Confirm setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<Error />} />
          <Route path="/addproduct" element={<AddProduct user={user} lastAction={lastAction} setLastAction={setLastAction} />} />
          <Route path="/updateproduct" element={<UpdateProduct user={user} lastAction={lastAction} setLastAction={setLastAction} />} />
          <Route path="/listproduct" element={<ListProduct user={user} lastAction={lastAction} setLastAction={setLastAction} seasons={seasons} />} />
          <Route path="/menu" element={<Menu lastAction={lastAction} setLastAction={setLastAction} />} />
          {/* <Route path="/header" element={<PrimarySearchAppBar />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
