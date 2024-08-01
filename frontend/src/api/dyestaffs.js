import axios from 'axios'
import config from "../config.json"

export const getDyeStaffs = (setFn) => {
    axios.get(config.api + '/DyeStaffs')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.dyeStaffName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getDyeStaffs error:' )
      console.log(error)
    })
  }
  
  