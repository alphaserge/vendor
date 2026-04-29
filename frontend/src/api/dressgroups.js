import axios from 'axios'
import config from "../config.json"

export const getDressGroups = (setFn) => {
    axios.get(config.api + '/DressGroups')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.dressGroupName }))
        items.unshift({ id:-2, value:"add custom value" })
        setFn(items)
    })
    .catch (error => {
      console.log('getDressGroups error:' )
      console.log(error)
    })
  }
  
  /* productId - not required, if not null - then backend
     adding record to ProductsInOverwork with productId value */
  export const postDressGroup = async (name, productId) => {

    const responce = await fetch(config.api + '/DressGroups', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dressGroupName: name,
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new dress group has been added"
    }
};
