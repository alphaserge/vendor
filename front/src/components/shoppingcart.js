import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector, useDispatch } from 'react-redux'

import PropertyItem from './propertyitem';
import PropertyAmount from './propertyamount';
import { computePrice } from './../functions/helper';
import config from "./../config.json"
import { useCartStore, useMessageStore } from "./../store/shoppingCartStore";
import { addShoppingCart, getShoppingCart, setShoppingCart } from './../functions/shoppingcart';
import { shallow, useShallow } from "zustand/shallow";

export default function ShoppingCart(props) {

  const shopCart = useSelector((state) => state.cart.items)

/* const { message, addMessage } = useCartStore(
    useShallow(
    (state) => ({
      message: state.message,
      addMessage: state.addMessage,
    }),
    //shallow
  ));

  let m = message;
  
const { items, loaded, addItem } = useCartStore(
    useShallow(
    (state) => ({
      items: state.items,
      loaded: state.loaded,
      addItem: state.addItem,
    }),
    //shallow
  ));
*/
  const deleteFromCart = (productId, quantity) => {

      /*let items = [...getShoppingCart()]
      let i=0
      let ix=-1
      for(i=0; i<items.length; i++) {
        if (items[i].product.id == productId && items[i].quantity == quantity) {
          ix=i
          break
        }
      }
      if (i!=-1) {
        items.splice(ix, 1);
      }
      //setShoppingCart(items)
      props.updateCart(items)*/
    }
    const setAmount = (productId, quantity) => {
      let changed = false
      for(let i=0; i<shopCart.length; i++) {
        if (shopCart[i].product.id == productId) {
          shopCart[i].quantity = parseFloat(quantity)
          changed = true
          break
        }
      }
      if (changed === true) {
        //props.updateCart(items)
      }
    }

    const setRolls = (productId, isRolls) => {
      let changed = false
      for(let i=0; i<shopCart.length; i++) {
        if (shopCart[i].product.id == productId) {
          shopCart[i].isRolls = isRolls
          changed = true
          break
        }
      }
      if (changed === true) {
        //props.updateCart(items)
      }
    }

    const setHelp = (productId, help) => {
      let changed = false
      for(let i=0; i<shopCart.length; i++) {
        if (shopCart[i].product.id == productId) {
          shopCart[i].help = help
          changed = true
          break
        }
      }
      if (changed === true) {
        //props.updateCart(items)
      }
    }

    //  React.useEffect(() => {
    //     }, []);

    //addItem({quantity: 2, product: { id: 3, itemName: "item 4"}})

    console.log("shopCart:")
    console.log(shopCart)
return <>
    <Box sx={{display: "flex", height: "60px", pt: 1}}>
      <Typography sx={{fontSize: "18px", fontWeight: 600, color: "#333", p:0, pb: 2, flexGrow: 1}}>
        {/* Your shopping items:&nbsp;{items.length}&nbsp;items */}
      </Typography>
    </Box>

    <Box>
    <table class="shopping-items" cellPadding={0} cellSpacing={0}>
    <tbody>
    {shopCart.map((data, index) => (
      <tr style={{ height : "100px"}}>
        <td >
          <img 
            src={data.product.colors[0].imagePath ? (config.api + "/" + data.product.colors[0].imagePath[0]) : ""}
            alt={"photo_"+data.product.id}
            style={{ borderRadius: "6px", maxWidth: "90px" }} />
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
              <PropertyItem maxWidth={200} label="Price" value={computePrice(data.product, data.quantity) + " $"} />
              <PropertyAmount maxWidth={200} label="Amount" product={data.product} quantity={data.quantity} isRolls={data.isRolls} setAmount={setAmount} setRolls={setRolls} setHelp={setHelp} />
              
            </tbody>
          </table>
          </td>
        <td>
        <IconButton aria-label="delete">
          <DeleteIcon 
            sx={{ color: "#18515E", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(data.product.id,data.quantity)}} >
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
