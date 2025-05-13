
export const non = (s) => {
    return s ? s : "";
}

export const formattedDate = (value, empty) => {
    
    let nullWord = ''

    if (empty) {
        nullWord = empty
    }

    if (!value) {
        return nullWord
    }
    
    const today = new Date(value);

    const yyyy = today.getFullYear();
    let mm = today.getMonth() + 1 // Months start at 0!
    let dd = today.getDate()

    if (dd < 10) dd = '0' + dd
    if (mm < 10) mm = '0' + mm

    const formattedToday = dd + '.' + mm + '.' + yyyy

    return formattedToday
}


export const isInteger = (x) => { return typeof x === "number" && isFinite(x) && Math.floor(x) === x; }
export const isFloat = (x) => { return !!(x % 1); }

export const isNumber = (value) => {
    if (typeof value === 'string') {
        value = parseFloat(value)
    }
    
    return typeof value === 'number' && isFinite(value);
}

export function toFixed2(value) {
    
    if (value === undefined || value === null) { return "-"}

    return value.toFixed(2)
}

export const validDecimal = (value) => {
    return isNumber(value)
}

export const computePrice = (product, quantity, isRolls) => {

    if (!product.price) {
        return null
    }

    if (!quantity) {
        return toFixed2(product.price*1.1)
    }

    if (isRolls == true) {
        quantity *= product.rollLength
    }

    if (quantity > 500) {
        return toFixed2(product.price)
    }

    if (quantity > 300) {
        return toFixed2(product.price*1.05)
    }

    return toFixed2(product.price*1.1)
}

export const idFromUrl = () => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    return params.get('id')
  }
