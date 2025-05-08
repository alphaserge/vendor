import { create } from 'zustand'


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

  export default useShoppingCartStore;

/*const useCartStore = create((set) => ({
    items: 0,
    addItem: (newItem) => set((state) => ({ items: state.items.push(newItem) })),
    removeAll: () => set({ items: [] }),
  }))*/