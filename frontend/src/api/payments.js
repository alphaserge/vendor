import axios from 'axios'
import config from "../config.json"

export const  postPayment = async (pay) => {

  //pay.date = "2025-11-14T11:26:57.057Z"
  const body = JSON.stringify(pay)

  const url = config.api + '/Payments/Pay';

  let rc = await fetch(config.api + '/Payments/Pay', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(pay)
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return { status: true, id: r.id };
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const orderPayments = (orderId, setFn) => {
    axios.get(config.api + '/Payments/OrderPayments', {
    params: {
      id: orderId
    }})
    .then(function (res) {
        const items = res.data.payments.map((item)=>({ date: item.date, currency : item.currency, amount : item.currencyAmount }))
        const total = res.data.total
         setFn(items,total)
    })
    .catch (error => {
      console.log('orderPayments error:' )
      console.log(error)
    })
  }
