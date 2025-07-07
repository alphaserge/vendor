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
      state.items.push({quantity: item.payload.cartQuantity, unit: item.payload.cartUnit, product: item.payload.product, colorVar: item.payload.cartColor})
      localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));

    },
    removeFromCart: (state, item) => {
      if (item.payload.index > -1 && item.payload.index <= state.items.length) {
        state.items.splice(item.payload.index, 1);
        localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
      }
    },

    updateQuantity: (state, item) => {
      /*return state.map(todo =>
                (todo.product.id === item.payload.product.id)
                    ? { ...todo, quantity: item.payload.quantity }
                    : todo
            )*/
      
      if (item.payload.index > -1 && item.payload.index < state.items.length) {
          state.items[item.payload.index].quantity = parseFloat(item.payload.quantity);
          localStorage.setItem($LOCALSTORAGE_CART_KEY, JSON.stringify(state.items));
      }
    },

    updateUnit: (state, item) => {
      if (item.payload.index > -1 && item.payload.index <= state.items.length) {
          state.items[item.payload.index].unit = parseFloat(item.payload.unit);
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
export const { addToCart, removeFromCart, updateQuantity, updateUnit, flushCart } = cartSlice.actions

const { actions, reducer } = cartSlice;

export default cartSlice.reducer