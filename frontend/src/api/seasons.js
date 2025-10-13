import axios from 'axios'
import config from "../config.json"

export const getSeasons = (setFn) => {
    axios.get(config.api + '/Seasons')
    .then(function (res) {
        let items = res.data
        items.push({ id:-1, value:"All" })
        setFn(items)
    })
    .catch (error => {
      console.log('getSeasons error:' )
      console.log(error)
    })
  }
  
  