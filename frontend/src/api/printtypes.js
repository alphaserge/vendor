import axios from 'axios'
import config from "../config.json"

export const getPrintTypes = (setFn) => {
    axios.get(config.api + '/PrintTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
        items.unshift({ id:-2, value:"add custom value" })
        setFn(items)
    })
    .catch (error => {
      console.log('getPrintTypes error:' )
      console.log(error)
    })
  }
  
  /* productId - not required, if not null - then backend
     set PrintTypeId field for product */
  export const postPrintType = async (name, productId) => {

    const responce = await fetch(config.api + '/PrintTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typeName: name,
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new print type has been added"
    }
};