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
  
  export const postDyeStaff = async (name) => {

    const responce = await fetch(config.api + '/DyeStaffs', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dyeStaffName: name,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new dye staff has been added"
    }
};