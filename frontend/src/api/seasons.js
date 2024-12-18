import axios from 'axios'
import config from "../config.json"

export const getSeasons = (setFn) => {
    axios.get(config.api + '/Seasons')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
        items.push({ id:-1, value:"All" })
        setFn(items)
    })
    .catch (error => {
      console.log('getSeasons error:' )
      console.log(error)
    })
  }
  
  