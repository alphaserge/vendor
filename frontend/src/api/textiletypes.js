import axios from 'axios'
import config from "../config.json"

export const getTextileTypes = (setFn) => {
    axios.get(config.api + '/TextileTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.textileTypeName }))
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getTextileTypes error:' )
      console.log(error)
    })
  }
  
  export const postTextileType = async (name) => {

    const responce = await fetch(config.api + '/TextileTypes', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        textileTypeName: name,
        textileTypeNameRu: "",
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new textile type has been added"
    }
};
