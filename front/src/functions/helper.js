
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

export const computePrice = (product) => {

    if (!product.price) {
        return null
    }

    if (!product.amount) {
        return product.price*1.1
    }

    if (product.orderRolls == true) {
        product.amount *= product.rollLength
    }

    if (product.amount > 500) {
        return product.price
    }

    if (product.amount > 300) {
        return product.price*1.05
    }

    return product.price*1.1
}

export const idFromUrl = () => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    return params.get('id')
  }
