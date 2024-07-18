import axios from 'axios'
import config from "../config.json"

export const getDesignTypes = (setFn) => {
    axios.get(config.api + '/DesignTypes')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.designName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getDesignTypes error:' )
      console.log(error)
    })
  }
  
  