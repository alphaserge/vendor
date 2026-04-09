import axios from 'axios'
import config from "../config.json"

export const getPlainDyedTypes = (setFn) => {
    axios.get(config.api + '/PlainDyedTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.plainDyedTypeName }))        
        items.unshift({ id:-2, value:"add custom value" })
        setFn(items)
    })
    .catch (error => {
      console.log('getPlainDyedTypes error:' )
      console.log(error)
    })
  }
  
  
    /* productId - not required, if not null, then backend
     adding record to ProductsInDesignTypes with productId value */
    export const postPlainDyedType = async (name, productId) => {

    const responce = await fetch(config.api + '/PlainDyedTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plainDyedTypeName: name,
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new plain dyed type has been added"
    }
};