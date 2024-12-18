import axios from 'axios'
import config from "../config.json"

export const getProductTypes = (setFn) => {
    axios.get(config.api + '/ProductTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getProductTypes error:' )
      console.log(error)
    })
  }
  
  export const postProductType = async (name) => {

    const responce = await fetch(config.api + '/ProductTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typeName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new product type has been added"
    }
};