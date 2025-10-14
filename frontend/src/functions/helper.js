
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

export function safeFixed(value, digits) {
    
    if (value === undefined || value === null) { return ""}

    return value.toFixed(digits)
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

export const percent = (value1, value2) => {
    return (!!value1!=null && value1!=undefined && value2!=null && value2!=undefined && (value2 > 0)) ? toFixed2(100*value1 / value2) : "?"
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

export const notNull = (text) => {
    return fined2(text)
}

export const quantityInfo = (item) => {
    if (!item.unit) return item.quantity
    return item.quantity + ' ' + item.unit.replace('rolls','r').replace('meters','m')// + ")"
}

export const orderStatusString = (item, order) => {
    
    if (!!item.delivered) return "delivered to client"

    if (!!item.clientDeliveryNo && !!item.clientDeliveryCompany  ) return "shipping to client"

    if (!!item.deliveryNo && !!item.deliveryCompany  ) return "shipping to stock"

    if (!!order && order.paySumm >= 0.0001) {
        if (order.paySumm - order.total >=0) { return "paid" }
        else { return "partially paid" }
    }

    if (!!item.details   ) return "confirmed by vendor"

    if (!!item.stockName ) return "stock " + item.stockName

    return "waiting of vendor"
}

export const sampleStatusString = (item, order) => {
    
    if (!!item.delivered) return "delivered to client"

    if (!!item.clientDeliveryNo && !!item.clientDeliveryCompany  ) return "shipping to client"

    if (!!order && order.paySumm >= 0.0001) {
        if (order.paySumm - order.total >=0) { return "paid" }
        else { return "partially paid" }
    }

    return "waiting"
}

export const orderStatusString2 = (item) => {
    
    if (!!item.delivered) return "delivered to client"

    if (!!item.clientDeliveryNo && !!item.clientDeliveryCompany) return "shipping to client"

    if (!!item.deliveryNo && !!item.deliveryCompany) return "shipping to stock"

    if (!!item.paid) return "paid"

    if (!!item.details) return "confirmed by vendor"

    if (!!item.stockName) return "stock " + item.stockName

    return "waiting of vendor"
}
