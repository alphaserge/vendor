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
import Blog from './pages/home/blog/Blog';

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

  useEffect(() => {
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

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home user={user} loggedIn={loggedIn} setLoggedIn={setLoggedIn}/>} />
          <Route path="/login" element={<Login setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/logout" element={<Logout setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/register" element={<Register setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/confirm" element={<Confirm setLoggedIn={setLoggedIn} setUser={setUser} />} />
          <Route path="/info" element={<Info />} />
          <Route path="/success" element={<Success />} />
          <Route path="/error" element={<Error />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/addproduct" element={<AddProduct user={user} lastAction={lastAction} setLastAction={setLastAction} />} />
          <Route path="/updateproduct" element={<UpdateProduct user={user} lastAction={lastAction} setLastAction={setLastAction} />} />
          <Route path="/listproduct" element={<ListProduct user={user} lastAction={lastAction} setLastAction={setLastAction} />} />
          <Route path="/menu" element={<Menu lastAction={lastAction} setLastAction={setLastAction} />} />
          {/* <Route path="/header" element={<PrimarySearchAppBar />} /> */}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
