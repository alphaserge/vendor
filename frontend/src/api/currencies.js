import axios from 'axios'
import config from "../config.json"

export const getCurrencies = (setFn) => {
    axios.get(config.api + '/Currencies')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.shortName }))
        //items.push({ id:-1, value:"All" })
        setFn(items)
    })
    .catch (error => {
      console.log('getCurrencies error:' )
      console.log(error)
    })
  }
  
  