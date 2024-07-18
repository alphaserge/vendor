import axios from 'axios'
import config from "../config.json"

export const getColors = (setFn) => {
    axios.get(config.api + '/Colors')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
        setFn(items)
    })
    .catch (error => {
      console.log('getColors error:' )
      console.log(error)
    })
  }
  
  