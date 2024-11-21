import axios from 'axios'
import config from "../config.json"

export const getSeasons = (setFn) => {
    axios.get(config.api + '/Seasons')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
        setFn(items)
    })
    .catch (error => {
      console.log('getSeasons error:' )
      console.log(error)
    })
  }
  
  