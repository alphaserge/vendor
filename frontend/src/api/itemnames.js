import axios from 'axios'
import config from "../config.json"

export const getItemNames = (setFn) => {
    axios.get(config.api + '/Products/ItemNames')
    .then(function (res) {
        let items = res.data
        setFn(items)
    })
    .catch (error => {
      console.log('getTextileTypes error:' )
      console.log(error)
    })
  }
  
  export const postItemName = async (name, productId) => {
  
      const responce = await fetch(config.api + '/Products/ItemName', {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: name,
          productId: parseInt(productId)
        })
      })
  
      return {
        ok: true,
        message: "The new item name has been added"
      }
  };