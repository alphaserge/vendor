export const setShoppingCart = (c) => localStorage.setItem('shoppingCart', JSON.stringify(c));

export const addShoppingCart = (item) => {
    let cart = []
    let s_cart = localStorage.getItem('shoppingCart')
    if (s_cart) {
      cart = JSON.parse(s_cart)
    }     
    
    cart.push(item)
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
}

export const getShoppingCart = ()  => { 
const cart = localStorage.getItem('shoppingCart')
if (cart) {
  return { cart: JSON.parse(cart) }
} else {
  return { cart: [] };
}}
