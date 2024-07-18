import axios from 'axios'
import config from "../config.json"

export const getProductTypes = (setFn) => {
    axios.get(config.api + '/ProductTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getProductTypes error:' )
      console.log(error)
    })
  }
  
  