const cartReducer = (state, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      return {
        rotating: action.payload
      };
    default:
      return state;
  }
};