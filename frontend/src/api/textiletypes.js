import axios from 'axios'
import config from "../config.json"

export const getTextileTypes = (setFn) => {
    axios.get(config.api + '/TextileTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.textileTypeName }))
        items.unshift({ id:-2, value:"add custom value" })
        setFn(items)
    })
    .catch (error => {
      console.log('getTextileTypes error:' )
      console.log(error)
    })
  }
  
  /* productId - not required, if not null - then backend
     adding record to ProductsInDesignTypes with productId value */
  export const postTextileType = async (name, productId) => {

    const responce = await fetch(config.api + '/TextileTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textileTypeName: name,
        textileTypeNameRu: "",
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new textile type has been added"
    }
};
