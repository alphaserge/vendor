import React, { useState, useEffect, useSyncExternalStore } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useTheme } from '@mui/material/styles';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import AddIcon from '@mui/icons-material/Add';
//import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MenuItem from '@mui/material/MenuItem';
import { HexColorPicker } from "react-colorful";
import CardMedia from '@mui/material/CardMedia';

import { v4 as uuid } from 'uuid'

import config from "../../config.json"
import ColorVariant from './colorvariant';
import MySelect from '../../components/myselect';
import MyAutocomplete from '../../components/myautocomplete';
import Composition from '../../components/composition';
import Header from '../../components/header';
import {APPEARANCE as ap} from '../../appearance';
import { getColors, postColor } from '../../api/colors'
import { getDesignTypes, postDesignType } from '../../api/designtypes'
import { getDyeStaffs, postDyeStaff } from '../../api/dyestaffs'
import { getFinishings, postFinishing } from '../../api/finishings'
import { getOverworkTypes, postOverworkType } from '../../api/overworktypes'
import { getPlainDyedTypes, postPlainDyedType } from '../../api/plaindyedtypes'
import { getPrintTypes, postPrintType } from '../../api/printtypes'
import { getProductStyles } from '../../api/productstyles'
import { getProductTypes, postProductType } from '../../api/producttypes'
import { getSeasons } from '../../api/seasons'
import { getTextileTypes, postTextileType } from '../../api/textiletypes'
import { 
  postProduct, 
  postFile,
  loadProduct, 
  addComposition, 
  saveComposition
} from '../../api/products'

import PageHeader from './pageheader'
import Footer from './footer'

import { APPEARANCE } from '../../appearance';

import Modal from '@mui/material/Modal'
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto'
import DoneIcon from '@mui/icons-material/Done'
import { styled } from '@mui/material/styles'
import { non, toFixed2, fined } from '../../functions/helper'
import axios from "axios"

const defaultTheme = createTheme()
const textStyle = { m: 0, mr: 1 }
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0  }
const itemStyle2 = { width: "calc( 100% + 1px )", mt: 0, ml: 0, mr: 0  }
const flexStyle = { display: "flex", flexDirection: "row", alignItems : "start", justifyContent: "space-between" }
const halfItemStyle = { width: "calc( 50% - 3px )", m: 0 }
const halfItemStyle1 = { width: "calc( 50% - 4px )", m: 0 }
const thirdItemStyle = { width: "calc( 33% - 5px )", m: 0 }
const labelStyle = { m: 0, ml: 0, mr: 4 }
const labelStyle1 = { m: 0, ml: 0, mr: 4 }
const buttonStyle = { backgroundColor: APPEARANCE.BUTTON_BG, color: APPEARANCE.BUTTON, margin: "5px 10px", width: 130, height: "40px", textTransform: "none", borderRadius: "0" }
const smallButtonStyle = { backgroundColor: APPEARANCE.BUTTON_BG, color: APPEARANCE.BUTTON, margin: "5px 10px 5px 0", width: 150, height: "30px", textTransform: "none", borderRadius: "0" }
const accordionStyle = { textAlign: "center", margin: "15px auto", justifyContent:"center", boxShadow: "none", border: "none", width: "100%" }
const accordionSummaryStyle = { maxWidth: "744px", margin: "0 auto 20px auto", padding: "0 10px",  backgroundColor: "#e4e4e4", textTransform: "none", border: "1px #ddd solid", borderRadius: "4px" }
const accordionDetailsStyle = { maxWidth: "744px", margin: "0 auto", padding: "0 0px" }
const accordionCaption = { width: "100%", fontWeight: "bold", fontSize: "11pt" };

const BUTTONS = ['1','2','3','4','5','6','7','8','9','X','0','ADD',]

const Input = styled('input')({
  display: 'none',
});

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const MySelectProps1 = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 160,
    },
  },
}

function getStyles(name, values, theme) {
  try 
  {
    if (Array.isArray(values)) {
      return {
        fontWeight:
        values.indexOf(name) === -1
            ? theme.typography.fontWeightRegular
            : theme.typography.fontWeightBold,
            /*backgroundColor: names.indexOf(name) === -1 ? "#F00" : "#F0F"*/
      }
    } else {
      return {}
    }
  }
  catch(exc)
  {
    let a = exc
  }
}

export default function UpdateProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [uid, setUid] = useState(uuid())
    const [productId, setProductId] = useState(uuid())
    const [dyeStaffId, setDyeStaffId] = useState(null)
    const [finishingId, setFinishingId] = useState(null)
    const [plainDyedTypeId, setPlainDyedTypeId] = useState(null)
    const [printTypeId, setPrintTypeId] = useState(null)
    const [productStyleId, setProductStyleId] = useState(null)
    const [productTypeId, setProductTypeId] = useState(null)
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [compositionValues, setCompositionValues] = useState([])

    const [artNo, setArtNo] = useState("")
    const [design, setDesign] = useState("")
    const [gsm, setGsm] = useState("")
    const [rollLength, setRollLength] = useState("")
    const [itemName, setItemName] = useState("")
    const [price, setPrice] = useState("")
    const [price2, setPrice2] = useState("")
    const [price3, setPrice3] = useState("")
    const [weight, setWeight] = useState("")
    const [width, setWidth] = useState("")
    const [colorFastness, setColorFastness] = useState("")
    const [fabricConstruction, setFabricConstruction] = useState("")
    const [fabricYarnCount, setFabricYarnCount] = useState("")
    const [findings, setFindings] = useState("")
    const [fabricShrinkage, setFabricShrinkage] = useState("")
    const [hsCode, setHsCode] = useState("")
    const [metersInKg, setMetersInKg] = useState("")
    const [refNo, setRefNo] = useState("")
    const [stock, setStock] = useState("")
    const [textileTypeValue, setTextileTypeValue] = useState("")
    const [composition, setComposition] = useState([])
    const [compositionSamples, setCompositionSamples] = useState([])

    const [newValue, setNewValue] = useState("")
    const [newColorRgb, setNewColorRgb] = useState("")

    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [productStyles, setProductStyles] = useState([])
    const [dyeStaffs, setDyeStaffs] = useState([])
    const [finishings, setFinishings] = useState([])
    const [plainDyedTypes, setPlainDyedTypes] = useState([])
    const [printTypes, setPrintTypes] = useState([])
    const [textileTypes, setTextileTypes] = useState([])
    const [productTextileTypes, setProductTextileTypes] = useState([])

    const [savingError, setSavingError] = useState(false)

    const [colorVariantsAdd, setColorVariantsAdd] = useState([])
    const [colorVariants, setColorVariants] = useState([])
    const [productPhotos, setProductPhotos] = useState([])
    const [productVideos, setProductVideos] = useState([])

    const [windowColorVariant, setWindowColorVariant] = useState(false)
    const [addColorIds, setAddColorIds] = useState([])
    const [addColorNo, setAddColorNo] = useState("")
    const [addQuantity, setAddQuantity] = useState("")
    const [addSelectedFile, setAddSelectedFile] = useState(null)
    const [colorVariantFile, setColorVariantFile] = useState(null)
        
    const [colorVariantUuid, setColorVariantUuid] = useState("")
    const [videoPath, setVideoPath] = useState("")
    const [photoPath, setPhotoPath] = useState("")

    let loc = useLocation()

    const idFromUrl = () => {
      const search = window.location.search
      const params = new URLSearchParams(search)
      return params.get('id')
    }


    const setColorVariantItem = (uuid, item) => {
      let cv = colorVariantsAdd.map(el=>el.uuid==uuid? item:el)
      setColorVariantsAdd(cv)
    }

    const setProductColorItem = (uuid, item) => {
      let cv = productPhotos.map(el=>el.uuid==uuid? item:el)
      //setProductColors(cv)
    }

    const weightChanged = (e) => {
      let value = e.target.value
      setWeight(value)
      wChanged(width, value)
    }

    const densityChanged = (e) => {
      let gs = e.target.value
      setGsm(gs)
      //wChanged(value, weight)
      if (width && !Number.isNaN(width) && gs && !Number.isNaN(gs)) {
        let iWidth = Number.parseInt(width)
        let iGsm = Number.parseInt(gs)
        let iWeight = iGsm*iWidth/100
        setWeight(iWeight.toFixed(2))
        let iMetersInKg = 1/(iWeight*0.001)
        setMetersInKg(iMetersInKg.toFixed(2))
    }
  }

    const widthChanged = (e) => {
      let value = e.target.value
      setWidth(value)
      let _width = Number.parseInt(value)
      let _weight = gsm*_width/100
      setWeight(_weight)
      let _metersInKg = (1000/_weight).toFixed(2)
      setMetersInKg(_metersInKg)
      //wChanged(value, weight)
    }

    const wChanged = (_width, _weight) => {
      if (_width && !Number.isNaN(_width) && _weight && !Number.isNaN(_weight)) {
          let iWidth = Number.parseInt(_width)
          let iWeight = Number.parseInt(_weight)
          let iGsm = iWeight/(iWidth/100)
          setGsm(iGsm.toFixed(2))
          let iMetersInKg = 1/(iWeight*0.001)
          setMetersInKg(iMetersInKg.toFixed(2))
      }
    }

    const priceChanged = (e) => {
      let value = e.target.value
      setPrice(value)
      setPrice2((value*1.05).toFixed(2))
      setPrice3((value*1.10).toFixed(2))
    }


    /*const productStyleChanged = (value) => {
      //setTimeout( function() { setProductStyle(value); }, 200 )
      setProductStyleId(value)

      //setWeight(value)
      //wChanged(width, value)
    }*/

    const addVariants = () => {
      let cv = [...colorVariantsAdd]
      cv = cv.concat(moreVariants(2))
      setColorVariantsAdd(cv)
    }

    const moreVariants = (add, max) => {
      let cv = [] 
      if (!max) {
        let cvNums = colorVariantsAdd.map(x => x.colorNo)
        max = cvNums.length > 0 ?  Math.max(...cvNums) : 0
      }
      let i=max+1
      while (i<=max+add){
        cv.push({
          uuid: uuid(),
          no: i,
          colorNo: null,
          colorIds: [],
          colorVariantId: null,
          productId: null,
          quantity: null,
          SelectedFile: null,
          isProduct: false,
          isVideo: false,
        })
        i++
      }
      return cv
    }
  
    const moreProductColors = (num, prodId) => {
      let cv = [] 
      let i=0
      while (i<num){
        cv.push({
          uuid: uuid(),
          colorNames: 'PRODUCT',
          colorNo: null,
          colorIds: null,
          colorVariantId: -1,
          productId: prodId,
          quantity: null,
          isProduct: true,
          isVideo: false,
        })
        i++
      }
      return cv
    }
  
    const handleRemoveCv = async (uuid) => {

      let cv = colorVariants.find((v)=> v.uuid == colorVariantUuid)
      if (!cv) {
        return
      }

      fetch(config.api + '/Products/ProductRemoveCV', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          Id: cv.colorVariantId,
          Uuid: cv.uuid,
          ProductId: cv.productId,
          IsProduct: cv.isProduct,
          IsVideo: cv.isVideo
        })
    })
    //.then(r => r.json())
    .then(r => {
  
      let id = idFromUrl()
      loadProduct(id, setProduct)
      
      props.setLastAction("Color variant has been removed")
      navigate(loc)
  })
    .catch (error => {
      console.log(error)
    })
  };
  
  const handleEditColor = async (uuid) => {
    setColorVariantUuid(uuid)
    setColorVariantFile(null)
    setOpenEditColor(true)
  };

  const fireChange = (last) => {
    if (last) {
      setTimeout( addVariants, 100)
    }
  }

  const fileChange = (file) => {
    setColorVariantFile(file)
  }

  const saveProduct = async (e) => {
    
    let cvars = colorVariants.concat(colorVariantsAdd)
    ///works fine without it: 
      cvars.forEach(cv => {
      if (typeof cv.price == "string") {
        var value = cv.price.replace(",", ".");
        const len = value.length
        if (len > 0) {
            if (value[len-1] == '.') 
                value = value.slice(0, -1)
        }
        cv.price = parseFloat(value)
      }
    }) 

    let prod = {
      vendorId: + props.user.vendorId, //!
      artNo: artNo,
      id: idFromUrl(),
      itemName: itemName,
      design: design,
      hsCode: hsCode,
      price: price,
      stock: stock,
      refNo: refNo,
      compositionValues: compositionValues.map((i) => { return {textileTypeId: i.id, value: parseInt(i.value)}}),
      season: season,
      weight: weight,
      width: width,
      rollLength: rollLength,
      colorFastness: colorFastness,
      fabricConstruction: fabricConstruction,
      fabricYarnCount: fabricYarnCount,
      fabricShrinkage: fabricShrinkage,
      findings: findings,
      metersInKg: metersInKg,
      gsm: gsm,
      uuid: uid,
      designType: designType,
      overworkType: overworkType,
      productStyleId: productStyleId,
      productTypeId: productTypeId,
      printTypeId: printTypeId,
      dyeStaffId: dyeStaffId,
      finishingId: finishingId,
      plainDyedTypeId: plainDyedTypeId,
      colorVariants: cvars,
      globalPhotos: productPhotos.filter(it => !!it.SelectedFile)
    }

    let id = idFromUrl()
    let r = await postProduct(prod, "ProductUpdate")
    let needUpdate = false
    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      needUpdate = true //navigate("/menu")
    } else {
      setSavingError(true)
    }

    if (colorVariantFile) {
      let cv = colorVariants.find(e => e.uuid === colorVariantUuid) 
      if (!!cv) {
        cv.SelectedFile = colorVariantFile
        let rf = await postFile(cv, id)
        needUpdate = true
      }
    }

    if (needUpdate) {
      loadProduct(id, setProduct)
    }
  }

  const saveColor = async (e) => {

    let r = await postColor(newValue, newColorRgb)

    if (!r.ok) {
      setErrorNewValue(r.message)
      return
    }
    if (r.ok == true) {
      props.setLastAction(r.message)
      getColors(setColors)
      handleClose()
    } else {
      setErrorNewValue(r.message)
    }
  };

  const addNewValue = async (e) => {

    setOpenedNewValue(false);

    var r = null
    switch(newValueEntity) {
      case 'overwork':
          r = await postOverworkType(newValue)
          break;
      case 'design type':
        r = await postDesignType(newValue)
        break;
      case 'textile type':
        r = await postTextileType(newValue)
        break;
      case 'finishing':
        r = await postFinishing(newValue)
        break;
      case 'plain dyed type':
        r = await postPlainDyedType(newValue)
        break;
      case 'print type':
        r = await postPrintType(newValue)
        break;
      case 'product type':
        r = await postProductType(newValue)
        break;
        case 'dye staff':
          r = await postDyeStaff(newValue)
          break;
        }

    if (!r.ok) {
      setErrorNewValue(r.message)
      return
    }

    if (r.ok == true) {
      props.setLastAction(r.message)
      switch(newValueEntity) {
        case 'overwork':
          getOverworkTypes(setOverworkTypes)
            break;
            case 'design type':
              getDesignTypes(setDesignTypes)
              break;
            case 'textile type':
              getTextileTypes(setTextileTypes)
              break;
            case 'finishing':
              getFinishings(setFinishings)
              break;
            case 'plain dyed type':
              getPlainDyedTypes(setPlainDyedTypes)
              break;
            case 'print type':
              getPrintTypes(setPrintTypes)
              break;
            case 'product type':
              getProductTypes(setPlainDyedTypes)
              break;
              case 'dye staff':
                getDyeStaffs(setDyeStaffs)
                break;
                }
    } else {
      setErrorNewValue(r.message)
    }
  };

const addColorVariant = async (cv) => {

  await axios.post(config.api + '/Products/ProductAddCV', 
    {
      Uuid: cv.uuid,
      Num: cv.colorNo,
      productId: cv.productId,
      isProduct: false,
      isVideo: false,
    })
    .then(function (response) {
      console.log(response);
      return response;
    })
    .catch(function (error) {
      console.log(error);
      return null;
    })
};

const uploadProductColor = async (event, type) => {


  const file = event.target.files[0]
  const id = idFromUrl()
  const cv = 
  {
    uuid: uuid(),
    colorNames: type,
    colorNo: null,
    colorIds: null,
    colorVariantId: -1,
    productId: id,
    quantity: null,
    isProduct: type == 'PRODUCT',
    isVideo: type == 'VIDEO',
    SelectedFile: file,
  }
  await postFile(cv, id, type)
  loadProduct(id, setProduct)
  //navigate(loc)
}

const uploadColorVariant = async (event) => {

  const file = event.target.files[0]
  let cvNums = colorVariants.map(x => x.colorNo)
  let max = cvNums.length > 0 ?  Math.max(...cvNums)+1 : 1
  const id = idFromUrl()

  const cv = {
    uuid: uuid(),
    no: null,
    colorNo: max,
    colorIds: [],
    colorVariantId: 0,
    productId: id,
    quantity: null,
    SelectedFile: file,
    isProduct: false,
    isVideo: false
  }

  await postFile(cv, null)
  await addColorVariant(cv)
  axios.get(config.api + '/Products/Product', {
    params: {
      id: id
    }})
  .then(function (response) {
    let prod = response.data
    setProduct(prod)
    setColorVariantUuid(cv.uuid)
    setColorVariantFile(null)
    setOpenEditColor(true)
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });
}

const setColorNo = (value) => {
  setAddColorNo(parseInt(value))
}

const setQuantity = (value) => {
  setAddQuantity(parseInt(value))
}


//?
const setColorIds = (value) => {
  setAddColorIds(value)
}

//?
const setSelectedFile = (value) => {
  setAddSelectedFile(value)
}

const onFileChange = (event) => {
  setSelectedFile(event.target.files[0])
}

const [openNewColor, setOpenNewColor] = React.useState(false);
const [openEditColor, setOpenEditColor] = React.useState(false);
const [openedNewValue, setOpenedNewValue] = React.useState(false);
const [errorNewValue, setErrorNewValue] = React.useState("");
const [newValueEntity, setNewValueEntity] = React.useState("");
const [openConfirmDelete, setOpenConfirmDelete] = React.useState(false);
const [openVideo, setOpenVideo] = React.useState(false);
const [openPhoto, setOpenPhoto] = React.useState(false);
const handleOpen = () => { setErrorNewValue(""); setOpenNewColor(true); }
const handleClose = () => setOpenNewColor(false);

const addNewColor = () => {
  handleOpen();
}

const setProduct = (prod) => {
  setItemName(non(prod.itemName))
  setArtNo(non(prod.artNo))
  setRefNo(non(prod.refNo))
  setDesign(non(prod.design))
  setPrice(non(prod.price))
  setPrice2((prod.price*1.05).toFixed(2))
  setPrice3((prod.price*1.10).toFixed(2))
  setStock(non(prod.stock))
  setWidth(non(prod.width))
  setGsm(non(prod.gsm))
  setRollLength(non(prod.rollLength))
  setWeight(non(prod.weight))
  setColorFastness(non(prod.colorFastness))
  setFabricConstruction(non(prod.fabricConstruction))
  setFabricYarnCount(non(prod.fabricYarnCount))
  setFabricShrinkage(non(prod.fabricShrinkage))
  setFindings(non(prod.findings))
  setHsCode(non(prod.hsCode))
  setProductStyleId(prod.productStyleId)
  setProductTypeId(non(prod.productTypeId))
  setPrintTypeId(non(prod.printTypeId))
  setPlainDyedTypeId(non(prod.plainDyedTypeId))
  setDyeStaffId(non(prod.dyeStaffId))
  setFinishingId(non(prod.finishingId))
  setSeason(non(prod.seasonIds))
  setOverworkType(non(prod.overWorkTypeIds))
  setDesignType(non(prod.designTypeIds))
  setCompositionSamples(non(prod.compositionsSamples))

  if (!!gsm) {
    densityChanged({target: {value: gsm}})
  }

  let comps = defaultComposition(textileTypes)

  prod.compositionValues.forEach(c => {
    let index = comps.findIndex(e => e.id == c.textileTypeId)
    if (index != -1) {
      comps.splice(index, 1)
    }
  })

  let vals = [...prod.compositionValues]
  vals = []

  for (let i=0; i<prod.compositionValues.length; i++) {
    vals.push({id: prod.compositionValues[i].textileTypeId, value: prod.compositionValues[i].value})
  }

  for (let j=0; j<comps.length; j++) {
    vals.push(comps[j])
  }

  let d = 5 - vals.length
  if (d < 2) { d = 2}

  for (let k=0; k<d; k++) {
    vals.push({id: null, value: null})
  }

  /*for (let i=0; i<5; i++) {
    vals.push(i<prod.compositionValues.length ?
        {id: prod.compositionValues[i].textileTypeId, value: prod.compositionValues[i].value} : {id: null, value: null})
  }*/
  setCompositionValues(vals)
  setProductTextileTypes(prod.textileTypes)

  if (!prod.colors) {
    prod.colors = []
  }

  let cvNums = prod.colors.filter(it => (!it.isProduct && !it.isVideo)).map(x => x.colorNo)
  let max = cvNums.length > 0 ?  Math.max(...cvNums) : 0

  //setProductColors(moreProductColors(2,prod.id))
  prod.colors = prod.colors
  setColorVariants(prod.colorPhotos)
  setColorVariantsAdd(moreVariants(2/*add*/,max))
  setProductPhotos(prod.productPhotos)
  setProductVideos(prod.productVideos)

  wChanged(prod.width, prod.weight)
}

  const compositionIdChanged = (value, index) => {
    let vals = [...compositionValues]
    vals[index].id = value
    setCompositionValues(vals)
  }

  const compositionValueChanged = (value, index) => {
    let vals = [...compositionValues]
    vals[index].value = parseInt(value)
    setCompositionValues(vals)
  }

  const compositionDelete = (index) => {
    let vals = [...compositionValues]
    // Remove 1 element starting from index
    //const removedElements = vals.splice(index, 1);
    vals[index].id = null
    vals[index].value = ''
    setCompositionValues(vals)
  }

  const defaultComposition = (items) => {

    var comps = []
    try {
    items.forEach(it => {
      if (it.value.toLowerCase() == 'cotton') { comps.push({id: it.id, value: null}) }
    })
    items.forEach(it => {
      if (it.value.toLowerCase() == 'polyester') { comps.push({id: it.id, value: null}) }
    })
    items.forEach(it => {
      if (it.value.startsWith('rayon')) { comps.push({id: it.id, value: null}) }
    })
    items.forEach(it => {
      if (it.value.toLowerCase() == 'spandex') { comps.push({id: it.id, value: null}) }
    })
  } catch (e) {
    const ee = e
  }

  return comps
  }


useEffect(() => {

  // >>> moved to setTextileTypesFunc()
  //let id = idFromUrl()
  //loadProduct(id, setProduct)

  getColors(setColors)
  getDesignTypes(setDesignTypes)
  getOverworkTypes(setOverworkTypes)
  getProductStyles(setProductStyles)
  getProductTypes(setProductTypes)
  getSeasons(setSeasons)
  // in bottom part of page, so can load later:
  getDyeStaffs(setDyeStaffs)
  getFinishings(setFinishings)
  getPlainDyedTypes(setPlainDyedTypes)
  getPrintTypes(setPrintTypes)
  getTextileTypes(setTextileTypes)

  }, []);

useEffect(() => {

  let id = idFromUrl()
  loadProduct(id, setProduct)

  }, [textileTypes]);




  const existingStyle = {} // (props.cv.colorVariantId != null ? {backgroundColor: "#eee"} : {})

  console.log('plain_dyed_type:')
  console.log(plainDyedTypeId)
   console.log(config.product.plain_dyed_type)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Modal
        open={openEditColor}
        onClose={()=>{setOpenEditColor(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 475, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: "center", m: 2, mb: 3}}>
            Change color variant
          </Typography>
          <Box sx={{display: "flex", flexDirection: 'column', alignItems: "center"}} >
          <ColorVariant 
            cv={colorVariants.find((v)=> v.uuid == colorVariantUuid)} 
            setColorItem={setColorVariantItem} 
            addNew={addNewColor}
            fireChange={fireChange}
            fileChange={fileChange}
            values={colors.map(e => { return e.colorName})} 
            keys={colors.map(e => { return e.id})} 
            last={false} />
          <Box sx={{display: "flex", flexDirection: 'row', justifyContent: "center", m: 2, mt: 3}} >
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={()=> { setOpenEditColor(false); saveProduct(); }} >
                  Save
          </Button>
          <Button 
              variant="contained"
              style={buttonStyle}
              onClick={()=> {setOpenEditColor(false)}} >
                  Cancel
          </Button>
          </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openConfirmDelete}
        onClose={()=>{setOpenConfirmDelete(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 475, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: "center", m: 2, mb: 3}}>
            Delete item?
          </Typography>
          <Box sx={{display: "flex", flexDirection: 'row', justifyContent: "center", m: 2, mt: 3}} >
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={()=> { setOpenConfirmDelete(false); handleRemoveCv(); }} >
                  Delete
          </Button>
          <Button 
              variant="contained"
              style={buttonStyle}
              onClick={()=> {setOpenConfirmDelete(false)}} >
                  Cancel
          </Button>
          </Box>
        </Box>
      </Modal>


      <Modal
        open={openVideo}
        onClose={()=>{setOpenVideo(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: "auto", bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: "center", m: 2, mb: 3}}>
            Change color variant
          </Typography> */}
          <Box sx={{display: "flex", flexDirection: 'column', alignItems: "center"}} >
          <CardMedia 
              component={"video"}
              autoPlay={"autoplay"}
              muted
              key={"card-video"} 
              src={videoPath} 
              alt={"Product video"} 
              sx={{ width: "auto", height:"auto"}}
              // className="product-img"
              
                />
          <Box sx={{display: "flex", flexDirection: 'row', alignItems: "center", m: 2, mt: 3}} >
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={()=> { setOpenVideo(false) }} >
                  Close
          </Button>
          </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openPhoto}
        onClose={()=>{setOpenPhoto(false)}}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: "auto", bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2" sx={{textAlign: "center", m: 2, mb: 3}}>
            Change color variant
          </Typography> */}
          <Box sx={{display: "flex", flexDirection: 'column', alignItems: "center"}} >
          <Box 
                      component={"img"} 
                      key={"photoView"} 
                      src={photoPath} 
                      alt={"photo"} 
                      className="product-img" />
          <Box sx={{display: "flex", flexDirection: 'row', alignItems: "center", m: 2, mt: 3}} >
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={()=> { setOpenPhoto(false) }} >
                  Close
          </Button>
          </Box>
          </Box>
        </Box>
      </Modal>

      <Modal
        open={openNewColor}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 475, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding a new color
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
            <TextField
                  margin="normal"
                  size="small" 
                  id="newColor"
                  label="Color value"
                  name="newColorRgb"
                  value={newColorRgb}
                  InputProps={{ readOnly: true }}
                  // onChange={ev => setNewColorRgb(ev.target.value)}
                /> 
                <HexColorPicker color={newColorRgb} onChange={setNewColorRgb} />
                <InputLabel
                component={"div"}
                  shrink={true}
                  sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }} >
                    {errorNewValue}
                  </InputLabel>
          </Box>
          <Box sx={{flex: 2, ml: 2, mr: 2, display: "flex", flexDirection: 'column', alignItems: "center"}} >
          <TextField
                  margin="normal"
                  size="small" 
                  id="newColor"
                  label="Color name"
                  name="newColor"
                  value={newValue}
                  sx={{ width: "200px", mb: 6}}
                  onChange={ev => setNewValue(ev.target.value)}
                />
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={saveColor} >
                  Save
          </Button>
          <Button 
              variant="contained"
              style={buttonStyle}
              onClick={handleClose} >
                  Cancel
          </Button>
          </Box>
          </Box>
        </Box>
      </Modal>


      {/* what is a window ??? */}
      {/* <Modal
        open={windowColorVariant}
        onClose={function() { setWindowColorVariant(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto"}} >

      <Box component="div" style={flexStyle}>
      <TextField
        margin="normal"
        size="small" 
        id="colorNo"
        name="colorNo"
        label="No."
        sx = {{...textStyle, ...{width: "85px"}, ...existingStyle}}
        value={addColorNo}
        onChange={ev => setColorNo(ev.target.value) }
        InputLabelProps={{ shrink: true }}
      />
      <TextField
        margin="normal"
        size="small" 
        id="colorQuantity"
        name="colorQuantity"
        label="Qty."
        sx = {{...textStyle, ...{width: "120px"}, ...existingStyle}}
        value={addQuantity}
        onChange={ev => setQuantity(ev.target.value) }
        InputLabelProps={{ shrink: true }} />

      <MySelect 
        id="addproduct-colorvariant"
        url="Colors"
        title="Color"
        labelStyle={labelStyle}
        itemStyle={{...itemStyle, ...existingStyle}}
        MenuProps={MySelectProps}
        value={addColorIds}
        setValue={setAddColorIds}
        addNew={props.addNew}
        values={props.data} /> 

//</ThemeProvider> values={designTypes.map(e => { return e.designName})}
  //  keys={designTypes.map(e => { return e.id})}  }

      <label htmlFor={"icon-button-file-111"}>
      <Input accept="image/*" id={"icon-button-file-111"} type="file" onChange={onFileChange} />
      <IconButton
        color="success"
        aria-label="upload picture"
        sx={{color: APPEARANCE.BLACK2}}
        component="span">
            {!addSelectedFile && <AddAPhotoIcon />}
            { addSelectedFile && <DoneIcon />}
      </IconButton>
      </label>      
      </Box>
      </Modal>*/}

      <Modal
        open={openedNewValue}
        onClose={(e)=>{ setOpenedNewValue(false); }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description" >

        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                width: 475, bgcolor: 'background.paper', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding a new {newValueEntity}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
            <TextField
                  margin="normal"
                  size="small" 
                  id="newValue"
                  label={"New value of " + newValueEntity}
                  name="newValue"
                  value={newValue}
                  onChange={ev => setNewValue(ev.target.value)}
                /> 
                <InputLabel
                component={"div"}
                  shrink={true}
                  sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }} >
                    {errorNewValue}
                  </InputLabel>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'top' }}>
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{marginTop: "40px"}}
              onClick={addNewValue} >
                  Save
          </Button>
          <Button 
              variant="contained"
              style={buttonStyle}
              onClick={(e)=>{ setOpenedNewValue(false); }} >
                  Cancel
          </Button>
          </Box>
          </Box>
        </Box>
      </Modal>

      <Container sx={{maxWidth: "100%", padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        <main>
 
          <Typography component="h6" variant="h6" color={APPEARANCE.COLOR1}>
          Change a product art. {artNo} - {itemName}
          </Typography>
          {/* <Typography component="p" variant="subtitle1" sx={{mb:2}}  color={APPEARANCE.COLOR1}>
          Please fill out all fields and click the Save button
          </Typography> */}
          
          {/* Main properties */}
          {/* General */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>General</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>
          <Grid container spacing={2} >
          <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="itemName"
                label="Item name"
                name="itemName"
                sx = {itemStyle1}
                value={itemName}
                onChange={ev => setItemName(ev.target.value)}
              />
            </Grid>
            <Grid item xs={12} md={6}  >
            <TextField
                margin="normal"
                size="small" 
                id="design"
                label="Design No"
                name="design"
                sx = {itemStyle1}
                value={design}
                onChange={ev => setDesign(ev.target.value)}
              />
              </Grid>

            <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="refNo"
                label="Ref No"
                name="refNo"
                value={refNo}
                sx = {halfItemStyle}
                onChange={ev => setRefNo(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="artNo"
                label="Art No"
                name="artNo"
                sx = {halfItemStyle}
                value={artNo}
                onChange={ev => setArtNo(ev.target.value)}
              />
            </Grid>

            <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="price"
                label="Price 500m+"
                name="price"
                sx = {thirdItemStyle}
                value={price}
                onChange={priceChanged}
              />
            <TextField
                margin="normal"
                size="small" 
                id="price2"
                label="301-500m"
                name="price2"
                sx = {thirdItemStyle}
                value={price2}
                InputProps={{ readOnly: true, }}
              />
            <TextField
                margin="normal"
                size="small" 
                id="price3"
                label="300m-"
                name="price3"
                sx = {thirdItemStyle}
                value={price3}
                InputProps={{ readOnly: true, }}
              />
              </Grid>

              <Grid item xs={12} md={6} sx={{...flexStyle}} >
              <TextField
                  margin="normal"
                  size="small" 
                  id="width"
                  label="Width"
                  name="width"
                  sx = {halfItemStyle}
                  value={width}
                  onChange={widthChanged}
                />
              
              <TextField
                  margin="normal"
                  size="small" 
                  id="gsm"
                  label="GSM"
                  name="gsm"
                  sx = {halfItemStyle}
                  value={gsm}
                  onChange={densityChanged}
                />
                </Grid>

              <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <TextField
                  margin="normal"
                  size="small" 
                  id="weight"
                  label="Weight G/M"
                  name="weight"
                  sx = {halfItemStyle}
                  value={weight}
                  onChange={weightChanged}
                />
                <TextField
                  margin="normal"
                  size="small" 
                  id="metersInKg"
                  label="Meters in KG"
                  name="metersInKg"
                  sx = {halfItemStyle}
                  value={metersInKg}
                  onChange={ev => setMetersInKg(ev.target.value)}
                />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <TextField
                  margin="normal"
                  size="small" 
                  id="rollLength"
                  label="Roll length"
                  name="rollLength"
                  sx = {halfItemStyle}
                  value={rollLength}
                  onChange={ev => setRollLength(ev.target.value)}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Plain or Print"
                  valueName="styleName"
                  labelStyle={labelStyle1}
                  itemStyle = {halfItemStyle}
                  sx={itemStyle1}
                  MenuProps={MySelectProps1}
                  value={productStyleId}
                  setValue={setProductStyleId}
                  values={productStyles.map(e => { return e.styleName})}
                  keys={productStyles.map(e => { return e.id})}/>

                </Grid>
              </Grid>


          </AccordionDetails>
          </Accordion>

          {/* Product photos */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true}  elevation={0} sx={{ '&:before':{height:'0px'}}} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Product photos</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>
            <Box sx={{...accordionSummaryStyle, ...{height: "auto"}}}>
            
            <Grid container spacing={2} sx={{padding: "10px 20px"}}>
              { productPhotos && productPhotos.map((cv, index) => {
                return <React.Fragment> 
                  {index==0 && <Box sx={{flexBasis: "100%", 
                    height: 0, /* Optional: keeps the break from adding visible vertical space */
                    margin: "20px 20px 30px 20px", /* Optional: removes default margins */
                    display: "flex",
                    fontWeight: "600"}}> 
                    <Box className="photos-title">General product photos:</Box> 
                    <Box sx={{marginLeft: "10px"}}>
                      <label htmlFor={"icon-button-file-global"} sx={{ ml: 2 }}>
                      <Input accept="image/*" id={"icon-button-file-global"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e,'PRODUCT'); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}} />
                      </Button>
                      </label>
                    </Box>
                  </Box> }
                  <Grid item xs={4} md={3} sx={{}} className="product-img-holder-item" key={"color-item-"+index} >
                  <Box className="product-img-holder-thumb" key={"color-item-1-"+index}>
                  <Box 
                      component={"img"} 
                      key={index} 
                      src={config.api + "/" + cv.imagePath} 
                      alt={"photo"+(index+1)} 
                      className="product-img" 
                      onClick={(e)=>{ setOpenPhoto(true); setPhotoPath(config.api + "/" + cv.imagePath); }}
                  />

                    <Box 
                      key={"toolbox" + index} 
                      className="product-img-buttons" >
                          <Button
                            variant="contained"
                            component={"div"}
                            aria-label="delete picture"
                            sx={{color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, pl: 1.5, ml: 1}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}
                            onClick={ function() { setOpenConfirmDelete(true); setColorVariantUuid(cv.uuid)}} 
                            startIcon={<DeleteIcon/>}>  
                          </Button>
                    </Box>
                    <br/>
                  </Box>
                  <Box component={"div"} 
                    sx={{ m: 0, mt: 1, ml: 0, p: 0, height: "auto", width: "135px", 
                    wordBreak: "normal", wordWrap: "break-word", 
                    display: "flex", fontSize:"12px", fontWeight: "600"}} > 
                    <Box sx={{width: "100%", height: "auto", padding: "5px 3px", borderRadius: 3, textAlign: "center"}}>
                    General photo {index+1}
                    </Box>
                  </Box>
                    </Grid>    
                    </React.Fragment>
            })}
            </Grid>

            { productPhotos && productPhotos.length == 0 && <Box className="photos-title" sx={{padding: "30px 16px", textAlign: "left"}}> The product does not have global photo <label htmlFor={"icon-button-file-global"} sx={{ ml: 2 }}>
                      <Input accept="image/*" id={"icon-button-file-global"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e,'PRODUCT'); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}} />
                      </Button>
                      </label></Box> }
              <Grid container spacing={2} sx={{padding: "0 20px"}}>
              { colorVariants && colorVariants.map((cv, index) => {
                return <React.Fragment> 
                  {index==0 && <Box sx={{flexBasis: "100%", 
                    height: 0, /* Optional: keeps the break from adding visible vertical space */
                    margin: "30px 20px 30px 20px", /* Optional: removes default margins */
                    display: "flex",
                    fontWeight: "600"}}> 
                    <Box className="photos-title"> Photos of product colors:</Box> 
                    <Box sx={{marginLeft: "10px"}}>
                      <label htmlFor={"icon-button-file-cv"} sx={{ ml: 2 }}>
                      <Input accept="image/*" id={"icon-button-file-cv"} type="file" onChange={(e) => { saveProduct(); uploadColorVariant(e); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}} />
                      </Button>
                      </label>
                    </Box>
                  </Box> }
                  <Grid item xs={4} md={3} sx={{}} className="product-img-holder-item" key={"color-item-"+index} >
                  <Box className="product-img-holder-thumb" key={"color-item-1-"+index} >
                  <Box 
                      component={"img"} 
                      key={index} 
                      src={config.api + "/" + cv.imagePath} 
                      alt={"photo"+(index+1)} 
                      className="product-img" 
                      onClick={(e)=>{ setOpenPhoto(true); setPhotoPath(config.api + "/" + cv.imagePath); }}
                      />

                    <Box 
                      key={"toolbox" + index} 
                      className="product-img-buttons" >
                          <Button
                            variant="contained"
                            component={"div"}
                            aria-label="upload picture"
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, pl: 2}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}
                            onClick={ function() { handleEditColor(cv.uuid)}}
                            startIcon={<EditNoteIcon/>}>
                            {/* <EditNoteIcon sx={{color: APPEARANCE.BLACK2, pt: 0, m: 0}}/> */}
                          </Button>
                        
                          <Button
                            variant="contained"
                            component={"div"}
                            aria-label="delete picture"
                            sx={{color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, pl: 1.5, ml: 1}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}
                            onClick={ function() { setOpenConfirmDelete(true); setColorVariantUuid(cv.uuid)}} 
                            startIcon={<DeleteIcon/>}>  
                          </Button>
                    </Box>
                    <br/>
                  </Box>
                  <Box component={"div"} 
                    sx={{ m: 0, mt: 1, ml: 0, pb: 1, height: "auto", width: "135px", 
                    wordBreak: "normal", wordWrap: "break-word", 
                    display: "flex", fontSize:"11px", fontWeight: "600"}} > 
                    
                    
                    <Box sx={{ width: "100%", height: "auto", padding: "5px 3px", borderRadius: 3, textAlign: "left"}}>
                      { 'COLOR ' + (cv.colorNo ? cv.colorNo + ': ' : '? ') + fined(cv.quantity,"-") + ' m ' + fined(toFixed2(cv.price),"-") + '$'}
                      <br/>{ cv.colorNames }
                    </Box>
                    
                    </Box>
                    </Grid>    
                    </React.Fragment>
            })}
            </Grid>

            { colorVariants && colorVariants.length == 0 && <Box className="photos-title" sx={{padding: "30px 16px", textAlign: "left"}}> The product does not have a color's photo <label htmlFor={"icon-button-file-cv"} sx={{ ml: 2 }}>
                      <Input accept="image/*" id={"icon-button-file-cv"} type="file" onChange={(e) => { saveProduct(); uploadColorVariant(e); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}} />
                      </Button>
                      </label></Box> }

              <Grid container spacing={2} sx={{padding: "0 20px"}}>
              { productVideos && productVideos.map((cv, index) => {
                return <React.Fragment> 
                  {index==0 && <Box sx={{flexBasis: "100%", 
                    height: 0, /* Optional: keeps the break from adding visible vertical space */
                    margin: "30px 20px 30px 20px", /* Optional: removes default margins */
                    display: "flex",
                    fontWeight: "600"}}> 
                    <Box className="photos-title"> Product videos:</Box> 
                    <Box sx={{marginLeft: "10px"}}>
                      <label htmlFor={"icon-button-file-video"} sx={{ ml: 2 }}>
                      <Input accept="video/*" id={"icon-button-file-video"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e, 'VIDEO'); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}}  />
                      </Button>
                      </label>
                    </Box>
                  </Box> }
                  <Grid item xs={4} md={3} sx={{}} className="product-img-holder-item" key={"color-item-"+index} >
                  <Box className="product-img-holder-thumb" key={"color-item-1-"+index}>
                  
                  <CardMedia 
                      component={"video"}
                      autoPlay={"autoplay"}
                      muted
                      key={index} 
                      src={config.api + "/" + cv.imagePath} 
                      alt={"photo"+(index+1)} 
                      sx={{ width: "180%", height:"auto"}}
                      className="product-img"
                      onClick={(e)=>{ setOpenVideo(true); setVideoPath(config.api + "/" + cv.imagePath); }}
                       />

                    <Box 
                      key={"toolbox" + index} 
                      className="product-img-buttons" >
                        
                          <Button
                            variant="contained"
                            component={"div"}
                            aria-label="delete picture"
                            sx={{color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, pl: 1.5, ml: 1}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}
                            onClick={ function() { setOpenConfirmDelete(true); setColorVariantUuid(cv.uuid)}} 
                            startIcon={<DeleteIcon/>}>  
                          </Button>
                    </Box>
                    <br/>
                  </Box>
                  <Box component={"div"} 
                    sx={{ m: 0, mt: 1, ml: 0, pb: 1, height: "auto", width: "135px", 
                    wordBreak: "normal", wordWrap: "break-word", 
                    display: "flex", fontSize:"12px", fontWeight: "600"}} > 
                    <Box sx={{width: "100%", height: "auto", padding: "5px 3px", borderRadius: 3, textAlign: "center"}}>Product video {index+1}</Box>
                    </Box>
                </Grid>    
                </React.Fragment>    
            })}
            </Grid>

            { productVideos && productVideos.length == 0 && <Box className="photos-title" sx={{padding: "30px 16px", textAlign: "left"}}> The product does not have a video <label htmlFor={"icon-button-file-video"} sx={{ ml: 2 }}>
                      <Input accept="video/*" id={"icon-button-file-video"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e, 'VIDEO'); }} />
                      <Button 
                            aria-label="upload color photo" 
                            variant="contained"
                            component={"div"}
                            sx={{ color: APPEARANCE.BLACK2, backgroundColor: APPEARANCE.WHITE2, p: 0, m: 0, ml: 1, pl: 1, textAlign: "center"}}
                            style={{maxWidth: '30px', maxHeight: '24px', minWidth: '30px', minHeight: '24px'}}>
                              <AddIcon sx={{ml: 0, mr: 1}}  />
                      </Button>
                      </label></Box> }

            <React.Fragment>

            <Box sx={{flexBasis: "100%", p: 2}}>
            <Box sx={{mb: 3, mt: 0, textAlign: "left", fontWeight: "600"}}>Quick add a photos of product colors:</Box>
            <Grid container spacing={2} >
                { colorVariantsAdd && colorVariantsAdd.map((cv,index) => (
                  <Grid item xs={12} md={6} sx={{ ...flexStyle}} key={"color-var-"+index} >
                    {(cv.isProduct !== true) && (cv.isVideo !== true) &&
                    <ColorVariant 
                      cv={cv} 
                      setColorItem={setColorVariantItem} 
                      addNew={addNewColor} 
                      fireChange={fireChange} 
                      values={colors.map(e => { return e.colorName})} 
                      keys={colors.map(e => { return e.id})} 
                      last={index == colorVariantsAdd.length-1} />
                    }
                    </Grid> ))}
            </Grid>
             </Box>
            </React.Fragment>


            </Box>

            {/* <Box sx={{mb: 3}}>
            <label htmlFor={"icon-button-file-prod"}>
              <Input accept="image/*" id={"icon-button-file-prod"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e,'PRODUCT');}} />
              <Button aria-label="upload global photo" style={smallButtonStyle} component="span">
                    <AddAPhotoIcon sx={{ml: 0, mr: 1}} /> 
                    Add photo
              </Button>
            </label>
            </Box> */}

            

            <br/>

              <Grid container spacing={2} sx={{...accordionSummaryStyle, ...{height: "auto"}}}>
            
            </Grid>

            {/* <Box sx={{mb: 3}}>
            <label htmlFor={"icon-button-file-video"}>
              <Input accept="video/*" id={"icon-button-file-video"} type="file" onChange={(e) => { saveProduct(); uploadProductColor(e,'VIDEO');}} />
              <Button aria-label="upload video" style={smallButtonStyle} component="span">
                    <AddAPhotoIcon sx={{ml: 0, mr: 1}} /> 
                    Add video
              </Button>
            </label>
            </Box> */}


          </AccordionDetails>
          </Accordion>

          {/* Additional information */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Additional information</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>
          <Grid container spacing={2} sx={{pt: 2}} >

              <Grid item xs={12} md={6} >
                <MySelect 
                  id="addproduct-producttype"
                  url="ProductTypes"
                  title="Fabric type"
                  valueName="typeName"
                  labelStyle={labelStyle1}
                  itemStyle = {itemStyle1}
                  MenuProps={MySelectProps1}
                  value={productTypeId}
                  setValue={setProductTypeId}
                  addNew={(e) => { setNewValueEntity("product type"); setOpenedNewValue(true); }}
                  values={productTypes.map(e => { return e.typeName})}
                  keys={productTypes.map(e => { return e.id})}
                />
                </Grid>

                <Grid item xs={12} md={6}  >
                <MySelect 
                  id="addproduct-season"
                  url="Seasons"
                  title="Season"
                  valueName="seasonName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  value={season}
                  setValue={setSeason}
                  values={seasons.map(e => { return e.seasonName})}
                  keys={seasons.map(e => { return e.id})} />
                </Grid>

                { (productStyleId != config.product.plain_dyed_type) && 
                (<Grid item xs={12} md={6}  >
                <MySelect 
                  id="addproduct-designtype"
                  url="DesignTypes"
                  title="Design type"
                  valueName="designName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  value={designType}
                  setValue={setDesignType}
                  addNew={(e) => { setNewValueEntity("design type"); setOpenedNewValue(true); }}
                  values={designTypes.map(e => { return e.designName})}
                  keys={designTypes.map(e => { return e.id})} />
              </Grid>)}
              
              { (productStyleId == config.product.plain_dyed_type) && (
                <Grid item xs={12} md={6} >
                <MySelect 
                  id="addproduct-plaindyedtype"
                  url="PlainDyedTypes"
                  title="Plain Dyed Type"
                  valueName="plainDyedTypeName"
                  labelStyle={labelStyle}
                  itemStyle={halfItemStyle}
                  MenuProps={MySelectProps}
                  value={plainDyedTypeId}
                  setValue={setPlainDyedTypeId}
                  addNew={(e) => { setNewValueEntity("plain dyed type"); setOpenedNewValue(true); }}
                  values={plainDyedTypes.map(e => { return e.plainDyedTypeName})}
                  keys={plainDyedTypes.map(e => { return e.id})}
                /> </Grid> )}

                <Grid item xs={12} md={6}  >
                <MySelect 
                  id="addproduct-overworktype"
                  url="OverWorkTypes"
                  title="Overwork type"
                  valueName="overWorkName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  value={overworkType}
                  setValue={setOverworkType}
                  addNew={(e) => { setNewValueEntity("overwork"); setOpenedNewValue(true); }}
                  values={overworkTypes.map(e => { return e.overWorkName})}
                  keys={overworkTypes.map(e => { return e.id})}
                />
            </Grid>
          </Grid>
          </AccordionDetails>

          {/* </Box> */}
          </Accordion>

          {/* Technical information */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Technical information</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>

          <Grid container spacing={2} sx={{pt: 2}} >

            <Grid item xs={12} md={6} sx={{...flexStyle}} >
              <TextField
                margin="normal"
                size="small" 
                id="fabricConstruction"
                label="Fabric construction"
                helperText="Example: 112*110"
                name="fabricConstruction"
                sx = {halfItemStyle}
                value={fabricConstruction}
                onChange={ev => setFabricConstruction(ev.target.value)}
              />
              <TextField
                margin="normal"
                size="small" 
                id="fabricYarnCount"
                label="Fabric Yarn Count"
                name="fabricYarnCount"
                helperText="Example: 40s+32s"
                sx = {halfItemStyle}
                onChange={ev => setFabricYarnCount(ev.target.value)}
                value={fabricYarnCount}
              />
            </Grid>

              <Grid item xs={12} md={6} >
              <FormControl sx = {halfItemStyle1}>
              <InputLabel id="fabric-shrinkage-label" sx={labelStyle1} size="small" >Fabric Shrinkage</InputLabel>
              <Select
                size="small" 
                labelId="fabric-shrinkage-label"
                id="fabric-shrinkage"
                value={fabricShrinkage}
                label="Fabric Shrinkage"
                sx = {itemStyle1}
                onChange={ev => setFabricShrinkage(ev.target.value)} >
                   { [...Array(11).keys()].map((elem, ix) => (
                      <MenuItem key={"shr1_"+ix} value={elem}
                      style={getStyles(elem, fabricShrinkage, theme)}> { elem + "%"} </MenuItem> ))}
              </Select>
              </FormControl> &nbsp;
              <FormControl sx = {halfItemStyle1}>
              <InputLabel id="color-fastness-label" sx={labelStyle1} size="small" >Color Fastness</InputLabel>
              <Select
                size="small" 
                labelId="color-fastness-label"
                id="color-fastness"
                value={colorFastness}
                label="Color Fastness"
                sx = {itemStyle1}
                onChange={ev => setColorFastness(ev.target.value)} >
                   {  [...Array(6).keys()].map((elem, ix) => (
                      <MenuItem key={"shr2_"+ix} value={elem}
                      style={getStyles(elem, fabricShrinkage, theme)}> { elem } </MenuItem> ))}
              </Select>
              </FormControl>
              </Grid>

            <Grid item xs={12} md={6} sx={{...flexStyle}} >
              <FormControl sx = {halfItemStyle1}>
                <MySelect 
                  id="addproduct-finishing"
                  url="Finishings"
                  title="Finishing"
                  valueName="finishingName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle2}
                  MenuProps={MySelectProps}
                  value={finishingId}
                  setValue={setFinishingId}
                  addNew={(e) => { setNewValueEntity("finishing"); setOpenedNewValue(true); }}
                  values={finishings.map(e => { return e.finishingName})}
                  keys={finishings.map(e => { return e.id})} 
                />
              </FormControl> &nbsp;
                
              <FormControl sx = {halfItemStyle1}>
                <TextField
                    margin="normal"
                    size="small" 
                    id="hsCode"
                    label="HS Code"
                    helperText="Example: 6400 0120 300"
                    name="hsCode"
                    sx = {{...itemStyle1, ...{ ml: "3px" }}}
                    value={hsCode}
                    onChange={ev => setHsCode(ev.target.value)}
                  />
              </FormControl> &nbsp;
            </Grid>

            <Grid item xs={12} md={6} sx={{...flexStyle}} >
              <FormControl sx = {halfItemStyle1}>
               <MySelect 
                id="addproduct-printttype"
                url="PrintTypes"
                title="Print Type"
                valueName="typeName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                value={printTypeId}
                setValue={setPrintTypeId}
                addNew={(e) => { setNewValueEntity("print type"); setOpenedNewValue(true); }}
                values={printTypes.map(e => { return e.typeName})}
                keys={printTypes.map(e => { return e.id})} 
              />
              </FormControl>

              <FormControl sx = {halfItemStyle1}>
              <MySelect 
                id="addproduct-dyestaff"
                url="DyeStaffs"
                title="Dye Stuff"
                valueName="dyeStaffName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                value={dyeStaffId}
                setValue={setDyeStaffId}
                addNew={(e) => { setNewValueEntity("dye staff"); setOpenedNewValue(true); }}
                values={dyeStaffs.map(e => { return e.dyeStaffName})}
                keys={dyeStaffs.map(e => { return e.id})} 
              />
              </FormControl> 
              </Grid>

              {/* <Grid item xs={12} md={6} >
              <MyAutocomplete
                  title="Composition"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  value={textileTypeId}
                  setValue={setTextileTypeId}
                  addNew={(e) => { setNewValueEntity("textile type"); setOpenedNewValue(true); }}
                  values={ textileTypes.map((e) => { return e.value }) }
                />
              </Grid> */}

            <Grid item xs={12} md={6} >
              <Composition 
                value={compositionValues} 
                idChanged={compositionIdChanged} 
                valueChanged={compositionValueChanged} 
                setComposition={setCompositionValues} 
                //valueList={textileTypes}
                values={textileTypes.map(e => { return e.value})}
                keys={textileTypes.map(e => { return e.id})} 

                delete={compositionDelete}/>
                {/* <Box 
                            sx={{ 
                              display: "grid",
                              gridTemplateColumns: "1fr 90px",
                              columnGap: "5px",
                              rowGap: "5px",
                              color: "#222", 
                              fontFamily: ap.FONTFAMILY,
                              fontSize: ap.FONTSIZE
                              }}>
                              <div style={{gridColumn: "span 2"}}><Header text="Composition" /></div>
                              { compositionValues.map((data, index) => (  
                              <React.Fragment>
                                 <MySelect 
                                    id={"comps-" + index}
                                    url="TextileTypes"
                                    title="Textile type"
                                    valueName="value"
                                    labelStyle={labelStyle}
                                    //itemStyle={halfItemStyle}
                                    MenuProps={MySelectProps}
                                    value={compositionValues[index].textileTypeId}
                                    setValue={compositionIdChanged}
                                    values={textileTypes}
                                    option={index}
                                    //addNew={props.addNew}
                                  />
                                  <TextField
                                    margin="normal"
                                    size="small" 
                                    id={"compv-" + index}
                                    label="%"
                                    name={"compv-" + index}
                                    value={compositionValues[index].value}
                                    sx = {{ m: 0 }}
                                    onChange={ev => compositionValueChanged(ev.target.value, index)}
                                  />
                               </React.Fragment>  ))} 
                        </Box> */}

            </Grid>
          </Grid>
          </AccordionDetails>

          {/* </Box> */}
          </Accordion>

          <FormControl sx = {itemStyle} > 
          { savingError && 
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> 
          }
                <Box sx={{ textAlign: "center", mt: 0, mb: 3 }}>
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={saveProduct} >
                        Save
                  </Button>
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={(e) => { navigate("/listproduct?new=1") }} >
                        Add Next
                  </Button>
                </Box>
          </FormControl>
        </main>

      </Container>
      <Footer />
    </ThemeProvider>
  );
}
