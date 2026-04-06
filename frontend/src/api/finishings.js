import axios from 'axios'
import config from "../config.json"

export const getFinishings= (setFn) => {
    axios.get(config.api + '/Finishings')
    .then(function (res) {
        let items = res.data
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getFinishings error:' )
      console.log(error)
    })
  }
  
  
  /* productId - not required, if not null - then backend
     set FinishingId field for product */
  export const postFinishing = async (name, productId) => {

    const responce = await fetch(config.api + '/Finishings', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        finishingName: name,
        productId: parseInt(productId)
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new finishing has been added"
    }
};
  