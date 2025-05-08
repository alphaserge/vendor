import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import PropertyItem from './propertyitem';
import PropertyAmount from './propertyamount';
import { computePrice } from './../functions/helper';
import config from "./../config.json"
import useShoppingCartStore from "./../store/shoppingCartStore";

export default function ShoppingCart(props) {

const { cartItems } = useShoppingCartStore((state) => ({ items: state.items }));

const deleteFromCart = (productId, amount) => {

      /*let cart = [...getShoppingCart()]
      let i=0
      let ix=-1
      for(i=0; i<cart.length; i++) {
        if (cart[i].product.id == productId && cart[i].amount == amount) {
          ix=i
          break
        }
      }
      if (i!=-1) {
        cart.splice(ix, 1);
      }
      //setShoppingCart(cart)
      props.updateCart(cart)*/
    }

    const setAmount = (productId, amount) => {
      let changed = false
      for(let i=0; i<props.cart.length; i++) {
        if (props.cart[i].product.id == productId) {
          props.cart[i].amount = parseFloat(amount)
          changed = true
          break
        }
      }
      if (changed === true) {
        props.updateCart(props.cart)
      }
    }

    const setRolls = (productId, isRolls) => {
      let changed = false
      for(let i=0; i<props.cart.length; i++) {
        if (props.cart[i].product.id == productId) {
          props.cart[i].isRolls = isRolls
          changed = true
          break
        }
      }
      if (changed === true) {
        props.updateCart(props.cart)
      }
    }

    const setHelp = (productId, help) => {
      let changed = false
      for(let i=0; i<props.cart.length; i++) {
        if (props.cart[i].product.id == productId) {
          props.cart[i].help = help
          changed = true
          break
        }
      }
      if (changed === true) {
        props.updateCart(props.cart)
      }
    }

return <>
    <Box sx={{display: "flex", height: "60px", pt: 1}}>
      <Typography sx={{fontSize: "18px", fontWeight: 600, color: "#333", p:0, pb: 2, flexGrow: 1}}>
        Your shopping cart:&nbsp;{props.cart.length}&nbsp;items
      </Typography>
    </Box>

    <Box>
    <table class="shopping-cart" cellPadding={0} cellSpacing={0}>
    <tbody>
    {cartItems.map((data, index) => (
      <tr style={{ height : "100px"}}>
        <td >
          <img 
            src={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
            alt={"photo_00"}
            style={{ borderRadius: "6px" }} />
        </td>
        <td style={{wordBreak: "break-all", paddingLeft: "10px"}}>
          <table cellPadding={0} cellSpacing={0}>
            <tbody>
              <PropertyItem maxWidth={200} label="Item name" value={data.product.itemName} />
              <PropertyItem maxWidth={200} label="Design" value={data.product.design} />
              <PropertyItem maxWidth={200} label="Composition" value={data.product.composition} />
            </tbody>
          </table>
        </td>
        <td>
        <table>
            <tbody>
              <PropertyItem maxWidth={200} label="Price" value={computePrice(data.product, data.amount) + " $"} />
              <PropertyAmount maxWidth={200} label="Amount" product={data.product} amount={data.amount} isRolls={data.isRolls} setAmount={setAmount} setRolls={setRolls} setHelp={setHelp} />
              {/* <tr><td><span class="item-label">&nbsp;</span></td><td>{data.help}</td></tr> */}
            </tbody>
          </table>
          </td>
        <td>
        <IconButton aria-label="delete">
          <DeleteIcon 
            sx={{ color: "#18515E", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(data.product.id,data.amount)}} >
          </DeleteIcon>
        </IconButton> 
        </td>
        </tr>
        ))}
      </tbody>
    </table>
    </Box>
</>
}
