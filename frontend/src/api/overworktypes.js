import axios from 'axios'
import config from "../config.json"

export const getOverworkTypes = (setFn) => {
    axios.get(config.api + '/OverworkTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getOverworkTypes error:' )
      console.log(error)
    })
  }
  
  export const postOverworkType = async (name) => {

    const responce = await fetch(config.api + '/OverWorkTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        overWorkName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new overwork type has been added"
    }
};
