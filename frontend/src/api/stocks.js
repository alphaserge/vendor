import axios from 'axios'
import config from "../config.json"
import { Email, Phone } from '@mui/icons-material'

export const getStocks = (setFn) => {
    axios.get(config.api + '/Stocks')
    .then(function (res) {
        let items = res.data.map((item)=>({ 
          id    : item.id, 
          vendorName  : item.vendorName,
          vendorType  : item.vendorType,
          email       : item.email,
          phone       : item.phone,
          contacts    : item.contacts,
         }))
        items.push({ id:-1, value:"All" })
        setFn(items)
        //return items;
    })
    .catch (error => {
      console.log('getStocks error:' )
      console.log(error)
    })
  }
  