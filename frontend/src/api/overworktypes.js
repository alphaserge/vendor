import axios from 'axios'
import config from "../config.json"

export const getOverworkTypes = (setFn) => {
    axios.get(config.api + '/OverworkTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
        items.unshift({ id:-2, value:"add custom value" })
        setFn(items)
    })
    .catch (error => {
      console.log('getOverworkTypes error:' )
      console.log(error)
    })
  }
  
  /* productId - not required, if not null - then backend
     adding record to ProductsInOverwork with productId value */
  export const postOverworkType = async (name, productId) => {

    const responce = await fetch(config.api + '/OverWorkTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overWorkName: name,
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new overwork type has been added"
    }
};
