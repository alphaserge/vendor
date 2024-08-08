import axios from 'axios'
import config from "../config.json"

export const getFinishings= (setFn) => {
    axios.get(config.api + '/Finishings')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.finishingName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getFinishings error:' )
      console.log(error)
    })
  }
  
  