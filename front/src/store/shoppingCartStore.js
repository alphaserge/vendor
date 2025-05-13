import { create } from 'zustand'
//import { persist, createJSONStorage } from 'zustand/middleware'

const $LOCAL_LOGGEDIN_KEY = "my_app_logged_in";

const getInitialCart = () => {
  const crt = JSON.parse(localStorage.getItem($LOCAL_LOGGEDIN_KEY)) || [];
  return crt;
};

export const useMessageStore = create((set) => ({
  message: "",
  addMessage: (str) => set({ message: str }),
  resetMessage: () => set({ message: "" }),
}));


export const useCartStore = create((set) => ({
    loaded: false,
    items: [],
    load: () => set((state) => {
      if(state.loaded!==true) {
        state.items = getInitialCart();
        state.loaded = true;
      }
    }),
    addItem: (item) => set((state) => { 
      console.log('state.items:')
      console.log(state.items)
      state.items.push(item); 
      localStorage.setItem($LOCAL_LOGGEDIN_KEY, JSON.stringify(state.items));
    }),
    //!!addItem: (item) => set({ items: get().items.push(item) }),
    //incrCounter: () => set((state) => ({ counter: state.counter + 1 })),
}))

const shoppingCartStore = (set, get) => ({

    items: [],

    //load:       (items) => { set((     ) => ({ items: {...items} })) },
    addItem:    (item ) => { set((state) => ({ items: state.items.push(item) })) },
    removeAll:  (     ) => { set((     ) => ({ items: [] })) },
    
    removeItem: (id) => {
      var items = get().items
      var index = items.findIndex(it => it.product.id == id);
      if (index > -1) {
          set((state) => ({
              items: items.splice(index, 1),
          }));
      }
    },

    updateItem: (id, item) => {
      const updatedItems = get().items;
      for(let i=0; i<updatedItems.length; i++) {
        if (updatedItems[i].product.id == id) {
            updatedItems[i] = item;
            break;
        }
      }
      set((state) => ({ items: updatedItems }));
    },

    updateQuantity: (id, quantity, isRolls ) => {
        const updatedItems = get().items;
        for(let i=0; i<updatedItems.length; i++) {
          if (updatedItems[i].product.id == id) {
              updatedItems[i].quantity = quantity;
              updatedItems[i].isRolls = isRolls;
              break;
          }
        }
        set((state) => ({ items: updatedItems }));
    },
  });
  
  const useShoppingCartStore = create(shoppingCartStore);

  export default useCartStore;// useShoppingCartStore;

/*const useCartStore = create((set) => ({
    items: 0,
    addItem: (newItem) => set((state) => ({ items: state.items.push(newItem) })),
    removeAll: () => set({ items: [] }),
  }))*/