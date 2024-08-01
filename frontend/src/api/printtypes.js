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
  
  