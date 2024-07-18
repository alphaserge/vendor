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
  
  