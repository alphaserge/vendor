import axios from 'axios'
import config from "../config.json"

export const getTextileTypes = (setFn) => {
    axios.get(config.api + '/TextileTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.textileTypeName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getTextileTypes error:' )
      console.log(error)
    })
  }
  
  