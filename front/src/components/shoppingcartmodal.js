import React, { useState, useEffect, useImperativeHandle } from 'react';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";

import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Modal from '@mui/material/Modal';

import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useLocation } from "react-router-dom";
import { v4 as uuid } from 'uuid'

import PropertyItem from './propertyitem';
import PropertyQuantity from './propertyquantity';
import { computePrice } from '../functions/helper';
import { postOrder } from '../api/orders'
import config from "../config.json"

import { addToCart, removeFromCart, updateQuantity, flushCart } from '../store/cartSlice'

const ShoppingCartModal = React.forwardRef((props, ref) => {

    const [showShoppingCart, setShowShoppingCart] = React.useState(false);
    const [clientAddress, setClientAddress] = useState("")
    const [clientName, setClientName] = useState("")
    const [clientPhone, setClientPhone] = useState("")
    const [clientEmail, setClientEmail] = useState("")

    const [orderError, setOrderError] = useState(false)

  const shopCart = useSelector((state) => state.cart.items)
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const textStyle = { m: 0, mb: 2 }

  const modalSx = {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      width: "800px",
      boxShadow: 24,
      padding: "20px 40px 40px 40px", 
      outline: "none",
      bgcolor: 'background.paper',
    }

  useImperativeHandle(ref, () => ({
    displayWindow(show) {
      displayWindow(show)
    }
  }))

  const displayWindow = (show) => {
    setShowShoppingCart(show);
  }

  const changeQuantity = (index, quantity) => { 
    dispatch(updateQuantity({ index, quantity }));
  };

  const deleteFromCart = (index) => {
    dispatch(removeFromCart({index}));
  }

  const setQuantity = (index, quantity) => {
    changeQuantity(index, quantity);
  }

  const setRolls = (index, isRolls) => {
    shopCart[index].isRolls = isRolls
  }

  const setHelp = (index, help) => {
    shopCart[index].help = help
  }

const makeOrder = async (event) => {

    if (!clientAddress || !clientEmail || !clientName || !clientPhone) {
      setOrderError(true)
      return
    }

    let items = shopCart.map((it) => { return {
      productId: it.product.id,
      quantity: it.quantity,
      itemName: it.product.itemName,
      refNo: it.product.refNo,
      artNo: it.product.artNo,
      design: it.product.design,
      price: (it.quantity > 500 ? it.product.price : ( it.quantity > 300 ? it.product.price1 : it.product.price2 ))
    }} )

    let order = {
      uuid : uuid(),
      clientName : clientName,
      clientPhone : clientPhone,
      clientEmail : clientEmail,
      clientAddress : clientAddress,
      items : items
    }

    let r = await postOrder(order)

    if (r && r.ok == true) {
      setOrderError(false)
      props.closeDialog("Your order has been successfully created. Please check the email address you provided when placing your order.");
      dispatch(flushCart());
    } else {
      setOrderError(true)
    }
  }

return <>

      {/* Shopping cart modal */}
      <Modal
        open={showShoppingCart}
        onClose={function() { setShowShoppingCart(false); }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        id="shoppingCartModal"
        sx={{ width: "auto", outline: "none", overflow: "scroll", p: 0 }} >

        <Box sx={{...modalSx, ...{borderRadius: "10px"}}} >

    <Box sx={{display: "flex", height: "60px", pt: 1}}>
      <Typography sx={{fontSize: "18px", fontWeight: 600, color: "#333", p:0, pb: 2, flexGrow: 1}}>
        {/* Your shopping items:&nbsp;{items.length}&nbsp;items */}
      </Typography>
    </Box>

    <Box>
    <table class="shopping-items" cellPadding={0} cellSpacing={0}>
    <tbody>
    {shopCart.map((data, index) => (
      <tr style={{ height : "100px", cursor: "pointer"}} onClick={(e) => { navigate("/product?id=" + data.product.id) }}>
        <td>
          <img 
            src={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
            alt={"photo_"+data.product.id}
            style={{ borderRadius: "6px", maxWidth: "90px" }} />
        </td>
        <td style={{wordBreak: "break-all", paddingLeft: "15px"}}>
          <table cellPadding={0} cellSpacing={4}>
            <tbody>
              <PropertyItem maxWidth={200} label="Item name" value={data.product.itemName} />
              <PropertyItem maxWidth={200} label="Design" value={data.product.design} />
              <PropertyItem maxWidth={200} label="Composition" value={data.product.composition} />
            </tbody>
          </table>
        </td>
        <td>
        <table style={{paddingLeft: "10px"}}>
            <tbody>
              <PropertyItem maxWidth={200} label="Price" value={computePrice(data.product, data.quantity) + " $"} />
              <PropertyQuantity 
                maxWidth={200} 
                label="Quantity" 
                index={index} 
                product={data.product} 
                quantity={data.quantity} 
                isRolls={data.isRolls} 
                setQuantity={setQuantity} 
                setRolls={setRolls} 
                setHelp={setHelp} />
              
            </tbody>
          </table>
          </td>
        <td style={{paddingLeft: "10px"}}>
        <IconButton aria-label="delete" sx={{backgroundColor: "#ddd", borderRadius: "8px", margin: "6px" }}>
          <DeleteIcon 
            sx={{ color: "#3d694a", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(index)}} >
          </DeleteIcon>
        </IconButton> 
        </td>
        </tr>
        ))}
      </tbody>
    </table>
    </Box>

        <Typography sx={{fontSize: "16px", fontWeight: 500, color: "#3d694a", p:0, pb: 2, pt: 2}}> Delivery information </Typography>
        <Grid container spacing={1} >
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientName"
                  name="clientName"
                  label="Client name"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientName}
                  onChange={ev => setClientName(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientPhone"
                  name="clientPhone"
                  label="Client phone"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientPhone}
                  onChange={ev => setClientPhone(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={4} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientEmail"
                  name="clientEmail"
                  label="Client email"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientEmail}
                  onChange={ev => setClientEmail(ev.target.value) }
                />
          </Grid>
          <Grid item xs={12} md={12} >
                <TextField
                  margin="normal"
                  size="small"
                  id="clientAddress"
                  name="clientAddress"
                  label="Client address"
                  sx = {{...textStyle, ...{width: "100%"}}}
                  value={clientAddress}
                  onChange={ev => setClientAddress(ev.target.value) }
                />
          </Grid>
        </Grid>

        { orderError &&
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> }

        <Box sx={{ display:"flex", flexDirection:"row", justifyContent: "right"}}>
        <Button
            variant="contained"
            //sx={{...roundButtonStyle, ...{ml: 3}}}
            className="add-to-cart-button"
            onClick={makeOrder} >
                Make order
        </Button>
        <Button
            variant="contained"
            //sx={{...roundButtonStyle, ...{ml: 3}}}
            className="add-to-cart-button"
            sx={{ml: 1}}
            onClick={() => {
              props.closeDialog();
              setShowShoppingCart(false);
              }}>
                Close
        </Button>
        </Box>


        </Box>
      </Modal>
</>
})

export default ShoppingCartModal;
