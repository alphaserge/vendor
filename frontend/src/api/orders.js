import axios from 'axios'
import config from "../config.json"

export const getOrders = (setFn) => {
    axios.get(config.api + '/Orders')
    .then(function (res) {
        //let items = res.data.map((item)=>({ id:item.id, value:item.orderName, rgb:item.rgb }))
        //items.push({ id:-2, value:"Add new.." })
        //setFn(items)
        setFn(res)
    })
    .catch (error => {
      console.log('getOrders error:' )
      console.log(error)
    })
  }

  export const postOrder = async (orderName, orderRgb) => {

    const responce = await fetch(config.api + '/Orders', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        orderName: orderName,
        rgb: orderRgb,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new order has been added"
    }
  }

  export const sendToVendor = async (vendorId) => {

    const responce = await fetch(config.api + '/VendorOrders/SendToVendor/' + vendorId, {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      /*body: JSON.stringify({
        vendorId: vendorId,
      })*/
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new order has been sended"
    }
  }
  