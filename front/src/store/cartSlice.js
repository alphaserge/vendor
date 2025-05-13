import { createSlice, configureStore } from '@reduxjs/toolkit'

const $LOCALSTORAGE_CART_KEY = "ShoppingCart";

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: JSON.parse(localStorage.getItem($LOCALSTORAGE_CART_KEY)) || [] 
  },
  reducers: {
    addToCart: (state, item) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.items.push({quantity: item.payload.cartAmount, product: item.payload.quickViewProduct})
      localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
    },
    removeFromCart: (state, id) => {
      var index = state.items.findIndex(it => it.product.id == id);
      if (index > -1) {
          state.items.splice(index, 1);
          localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
      }
    },
    updateQuantity: (state, index, quantity) => {
      if (index > -1 && index <= state.items.length) {
          state.items[index].quantity = quantity;
          localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
      }
    },
    flushCart: (state) => {
      state.items = []
      localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
    },
  },
})


const store = configureStore({
  reducer: cartSlice.reducer
})

// Action creators are generated for each case reducer function
export const { addToCart, removeFromCart, updateQuantity, flushCart } = cartSlice.actions

const { actions, reducer } = cartSlice;

export default cartSlice.reducer