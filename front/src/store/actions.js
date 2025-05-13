/*
 * типы экшенов
 */
export const GET_ITEMS = 'GET_ITEMS';
export const ADD_TO_CART = 'ADD_TO_CART';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const FLUSH_CART = 'FLUSH_CART';
export const UPDATE_QUANTITY = 'UPDATE_QUANTITY';

/*
 * генераторы экшенов
 */
export function getItems() {
    return { type: GET_ITEMS };
}

export function addToCart(item) {
    return { type: ADD_TO_CART, item };
}

export function removeFromCart(index) {
    return { type: REMOVE_FROM_CART, index };
}

export function flushCart() {
    return { type: FLUSH_CART };
}

export function updateQuantity(index, quantity) {
    return { type: UPDATE_QUANTITY, index, quantity };
}
