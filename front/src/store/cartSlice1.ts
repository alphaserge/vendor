import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface Product {
  id: bigint,
  itemName: string,
  refNo: string,
  artNo: string,
  design: string,
  composition: string,
  rollLenght: number 
}

interface CartItem {
  product: Product,
  quantity: number,
  isRolls: boolean 
}

const initialState: CartItem[] = [] // todo -read from ls
// omit state types

/*
const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    productAdded(state, action: PayloadAction<Post>) {
      state.push(action.payload)
    },
    postUpdated(state, action: PayloadAction<Post>) {
      const { id, title, content } = action.payload
      const existingPost = state.find(post => post.id === id)
      if (existingPost) {
        existingPost.title = title
        existingPost.content = content
      }
    }
  }
})

export const { postAdded, postUpdated } = postsSlice.actions

export default postsSlice.reducer */