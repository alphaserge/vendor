import axios from 'axios'
import config from "../config.json"

export const getProductStyles = (setFn) => {
    axios.get(config.api + '/ProductStyles')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.styleName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getProductStyles error:' )
      console.log(error)
    })
  }
  
  