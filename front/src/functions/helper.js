
export const non = (s) => {
    return s ? s : "";
}

export const getYearsApproximate = (date1, date2) => {
  const diffMilliseconds = Math.abs(date2 - date1);
  const millisecondsInYear = 1000 * 60 * 60 * 24 * 365.25; // Average days in a year
  return diffMilliseconds / millisecondsInYear;
}

export const  getYearsFull = (date1, date2) => {
  const year1 = date1.getFullYear();
  const year2 = date2.getFullYear();
  return Math.abs(year2 - year1);
}

export const formattedDate = (value, empty='') => {
    
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

export const formattedPrice = (value, empty) => {
    
    let nullWord = '-'

    if (empty) {
        nullWord = empty
    }

    if (!value) {
        return nullWord
    }
    
    return value.toFixed(2);// + ' $'
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

export const fromUrl = (paramName) => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    return params.get(paramName)
}

export const idFromUrl = () => {
    return fromUrl('id')
}

export const fined = (text, placeholder="") => {
    return text ? text : placeholder
}

export const fined2 = (text) => {
    return text ? text : ""
}

export const status = (item) => {
    
    if (!!item.details  ) return "confirmed by vendor"
    if (!!item.delivered) return "delivered to client"
    if (!!item.shipped  ) return "shipping to client"
    //if (!!item.paidByClient    ) return "paid"
    //if (!!item.shippedToClient ) return "delivered"
    //if (!!item.inStock         ) return "in stock"
    return "waiting of vendor"
}

export const quantityInfo = (item) => {
    if (!item.unit) return item.quantity
    return item.quantity + "(" + item.unit.replace('rolls','r').replace('meters','m') + ")"
}
