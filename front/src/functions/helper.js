
export const non = (s) => {
    return s ? s : "";
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