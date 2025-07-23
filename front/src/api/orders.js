import axios from 'axios'
import config from "../config.json"

export const getOrders = (setFn) => {
    axios.get(config.api + '/Orders')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.orderName, rgb:item.rgb }))
        setFn(items)
    })
    .catch (error => {
      console.log('getOrders error:' )
      console.log(error)
    })
  }

  export const postOrder = async (order) => {

    const error = {
      ok: true,
      message: "Order has been added"
    }
  
    //console.log(order)
    
    const responce = await fetch(config.api + '/Create', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order)
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new order has been added"
    }
};

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

