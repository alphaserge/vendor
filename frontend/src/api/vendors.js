import axios from 'axios'
import config from "../config.json"
import { Email, Phone } from '@mui/icons-material'

export const getVendors = (setFn) => {
    axios.get(config.api + '/Vendors')
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
      console.log('getVendors error:' )
      console.log(error)
    })
  }
  
export const getTransportCompanies = (vendorId, setFn) => {
    if (!vendorId) vendorId = -1;
    axios.get(config.api + '/Vendors/Transports?vendorId=' + vendorId)
    .then(function (res) {
        let items = res.data.map((item)=>({ 
          id    : item.vendorName,//item.id, 
          vendorName  : item.vendorName,
          value       : item.vendorName,
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
      console.log('getTransportCompanies error:' )
      console.log(error)
    })
  }
