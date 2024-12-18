import axios from 'axios'
import config from "../config.json"

export const getPlainDyedTypes = (setFn) => {
    axios.get(config.api + '/PlainDyedTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.plainDyedTypeName }))
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getPlainDyedTypes error:' )
      console.log(error)
    })
  }
  
  
  export const postPlainDyedType = async (name) => {

    const responce = await fetch(config.api + '/PlainDyedTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        plainDyedTypeName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new plain dyed type has been added"
    }
};