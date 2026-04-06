import axios from 'axios'
import config from "../config.json"

export const getDyeStaffs = (setFn) => {
    axios.get(config.api + '/DyeStaffs')
    .then(function (res) {
        let items = res.data
        items.push({ id:-2, value:"Add new.." })
        setFn(items)
    })
    .catch (error => {
      console.log('getDyeStaffs error:' )
      console.log(error)
    })
  }
  
  /* productId - not required, if not null - then backend
     set PrintTypeId field for product */
  export const postDyeStaff = async (name, productId) => {

    const responce = await fetch(config.api + '/DyeStaffs', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dyeStaffName: name,
        productId: parseInt(productId)
      })
    })

    return {
      ok: true,
      message: "The new dye staff has been added"
    }
};