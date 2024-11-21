import axios from 'axios'
import config from "../config.json"

export const getPrintTypes = (setFn) => {
    axios.get(config.api + '/PrintTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getPrintTypes error:' )
      console.log(error)
    })
  }
  
  export const postPrintType = async (name) => {

    const responce = await fetch(config.api + '/PrintTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        typeName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new print type has been added"
    }
};