import axios from 'axios'
import config from "../config.json"

export const getColors = (setFn) => {
    axios.get(config.api + '/Colors')
    .then(function (res) {
        let items = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
        setFn(items)
    })
    .catch (error => {
      console.log('getColors error:' )
      console.log(error)
    })
  }

  export const postColor = async (colorName, colorRgb) => {

    const error = {
      ok: true,
      message: "Color has been added"
    }

    //colorRgb = colorRgb.substring(1)

    const matched = colorRgb.match("^#([0-9a-fA-F]{2}){3}$")
  
    if (!matched) {
      return {
        ok: false,
        message: "Incorrect RGB value.\n Should be as example: FA240C, DD34CC"
      }
    }
  
    const responce = await fetch(config.api + '/Colors', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        colorName: colorName,
        rgb: colorRgb,
      })
    })

    console.log(responce);

    return {
      ok: true,
      message: "The new color has been added"
    }
    //let r = await responce.json();

  /*.then(r => r.json())
  .then(r => {
      return {
        ok: true,
        message: "The new color has been added"
      }
  })
  .catch (err => {
    return error
  })*/
};
