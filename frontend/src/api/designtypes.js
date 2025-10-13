import axios from 'axios'
import config from "../config.json"

export const getDesignTypes = (setFn) => {
    axios.get(config.api + '/DesignTypes')
    .then(function (res) {
        let items = res.data
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getDesignTypes error:' )
      console.log(error)
    })
  }
  
  export const postDesignType = async (name) => {

    const responce = await fetch(config.api + '/DesignTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        designName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new design type has been added"
    }
};