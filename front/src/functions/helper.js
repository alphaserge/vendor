
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

export const computePrice = (price, amount) => {

    if (!price) {
        return null
    }

    if (!amount) {
        return price*1.1
    }

    if (amount > 500) {
        return price
    }

    if (amount > 300) {
        return price*1.05
    }

    return price*1.1
}

export const idFromUrl = () => {
    const search = window.location.search
    const params = new URLSearchParams(search)
    return params.get('id')
  }
