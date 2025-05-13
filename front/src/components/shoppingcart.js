import * as React from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';

import { useSelector, useDispatch } from 'react-redux'

import PropertyItem from './propertyitem';
import PropertyQuantity from './propertyquantity';
import { computePrice } from './../functions/helper';
import config from "./../config.json"

import { addToCart, removeFromCart, updateQuantity, flushCart } from './../store/cartSlice'

export default function ShoppingCart(props) {

  const shopCart = useSelector((state) => state.cart.items)
  
  const dispatch = useDispatch();

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

  //  React.useEffect(() => {
  //     }, []);
  //console.log("shopCart:")
  //console.log(shopCart)

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
        <td>
        <IconButton aria-label="delete">
          <DeleteIcon 
            sx={{ color: "#18515E", fontSize: 26 }}
            onClick={(e)=>{deleteFromCart(index)}} >
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
