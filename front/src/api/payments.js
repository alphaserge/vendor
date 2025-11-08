import axios from 'axios'
import config from "../config.json"

export const getPayments = (setFn, orderId) => {
  axios.get(config.api + '/OrderPayments?orderId=' + orderId)
    .then(function (res) {
      setFn(res.data)
      })       
    .catch (error => {
      console.log(error)
    })
}

    