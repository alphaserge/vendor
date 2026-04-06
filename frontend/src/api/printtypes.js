import axios from 'axios'
import config from "../config.json"

export const getPrintTypes = (setFn) => {
    axios.get(config.api + '/PrintTypes')
    .then(function (res) {
        let items = res.data
        items.push({ id:-2, value:"Add new.." })
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