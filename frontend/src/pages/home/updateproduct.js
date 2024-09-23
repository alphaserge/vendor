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
import AddIcon from '@mui/icons-material/Add';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import MenuItem from '@mui/material/MenuItem';
import { HexColorPicker } from "react-colorful";
import InputMask from "react-input-mask";

import { v4 as uuid } from 'uuid'

import config from "../../config.json"
import ColorVariant from './colorvariant';
import MySelect from '../../components/myselect';
import ProductColor from './productcolor';
import { getColors, postColor } from '../../api/colors'
import { getDesignTypes } from '../../api/designtypes'
import { getDyeStaffs } from '../../api/dyestaffs'
import { getFinishings } from '../../api/finishings'
import { getOverworkTypes } from '../../api/overworktypes'
import { getPlainDyedTypes } from '../../api/plaindyedtypes'
import { getPrintTypes } from '../../api/printtypes'
import { getProductStyles } from '../../api/productstyles'
import { getProductTypes } from '../../api/producttypes'
import { getSeasons } from '../../api/seasons'
import { getTextileTypes } from '../../api/textiletypes'
import { postProduct, loadProduct, addComposition, removeComposition, finishComposition, sampleComposition } from '../../api/products'

import Header from './header';
import Footer from './footer';

import { APPEARANCE } from '../../appearance';

import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTheme = createTheme()
const itemStyle  = { width: "100%", mt: 3, ml: 0, mr: 0, mb: 0  }
const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0  }
const flexStyle = { display: "flex", flexDirection: "row", alignItems : "center", justifyContent: "space-between" }
const halfItemStyle = { width: "calc( 50% - 3px )", m: 0 }
const halfItemStyle1 = { width: "calc( 50% - 4px )", m: 0 }
const thirdItemStyle = { width: "calc( 33% - 5px )", m: 0 }
const labelStyle = { m: 0, ml: 0, mr: 4 }
const labelStyle1 = { m: 0, ml: 0, mr: 4 }
const buttonStyle = { width: 100, backgroundColor: APPEARANCE.BUTTON_BG, color: APPEARANCE.BUTTON, margin: "5px 10px", width: 130, height: "40px", textTransform: "none", borderRadius: "0" }
const accordionStyle = { textAlign: "center", margin: "15px auto", justifyContent:"center", boxShadow: "none", border: "none", width: "100%" }
const accordionSummaryStyle = { maxWidth: "744px", margin: "0 auto 20px auto", padding: "0 10px",  backgroundColor: "#e4e4e4", textTransform: "none", border: "1px #ddd solid", borderRadius: "4px" }
const accordionDetailsStyle = { maxWidth: "744px", margin: "0 auto", padding: "0 0px" }
const accordionCaption = { width: "100%", fontWeight: "bold", fontSize: "11pt" };

const BUTTONS = ['1','2','3','4','5','6','7','8','9','X','0','ADD',]

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MySelectProps1 = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 160,
    },
  },
};

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
    const [dyeStaff, setDyeStaff] = useState("")
    const [finishing, setFinishing] = useState("")
    const [plainDyedType, setPlainDyedType] = useState("")
    const [printType, setPrintType] = useState("")
    const [productStyle, setProductStyle] = useState("")
    const [productType, setProductType] = useState("")
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [textileType, setTextileType] = useState("")

    const [artNo, setArtNo] = useState("")
    const [design, setDesign] = useState("")
    const [gsm, setGsm] = useState("")
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

    const [newColor, setNewColor] = useState("")
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

    const [colorVariants, setColorVariants] = useState([])
    const [productColors, setProductColors] = useState([])
    
    let loc = useLocation()

    const idFromUrl = () => {
      const search = window.location.search
      const params = new URLSearchParams(search)
      return params.get('id')
    }

    const setColorVariantItem = (uuid, item) => {
      let cv = colorVariants.map(el=>el.uuid==uuid? item:el)
      setColorVariants(cv)
    }

    const setProductColorItem = (uuid, item) => {
      let cv = productColors.map(el=>el.uuid==uuid? item:el)
      setProductColors(cv)
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

    const addVariants = () => {
      let cv = [...colorVariants]
      cv = cv.concat(moreVariants(6))
      setColorVariants(cv)
    }

    const moreVariants = (add, max) => {
      let cv = [] //colorVariants.slice()
      if (!max) {
        let cvNums = colorVariants.map(x => x.colorNo)
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
          selectedFile: null,
          isProduct: false
        })
        i++
      }
      return cv
    }
  
    const moreProductColors = (num, prodId) => {
      let cv = [] //productColors.slice()
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
          isProduct: true
        })
        i++
      }
      return cv
      //setProductColors(cv)
    }
  
    const handleRemoveCv = async (cv) => {

      fetch(config.api + '/Products/ProductRemoveCV', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          Id: cv.colorVariantId,
          Uuid: cv.uuid,
          ProductId: cv.productId,
          IsProduct: cv.isProduct
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
  
  const handleRemoveProductPhoto = async (id) => {

    fetch(config.api + '/Products/ProductRemoveProductPhoto', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        Id: id,
        ProductId: productId
      })
  })
  .then(r => r.json())
  .then(r => {
  
    loadProduct(id)
    
    props.setLastAction("Product photo variant has been removed")
    navigate(loc)
  })
  .catch (error => {
    console.log(error)
  })
  };
  
  const openMyProducts = async (e) => {
  }

  const saveProduct = async (e) => {
    
    let prod = {
      vendorId: 1, //!
      artNo: artNo,
      id: idFromUrl(),
      itemName: itemName,
      design: design,
      hsCode: hsCode,
      price: price,
      stock: stock,
      refNo: refNo,
      season: season,
      weight: weight,
      width: width,
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
      productStyle: productStyle,
      productType: productType,
      printType: printType,
      dyeStaff: dyeStaff,
      finishing: finishing,
      plainDyedType: plainDyedType,
      colorVariants: colorVariants,//.filter(it => !!it.colorNo),
      globalPhotos: productColors.filter(it => !!it.selectedFile)
    }

    let r = await postProduct(prod, "ProductUpdate")

    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      let id = idFromUrl()
      loadProduct(id, setProduct)

      //navigate("/menu")
    } else {
      setSavingError(true)
    }
  }

  const compositionAdd = async (e) => {
    
    if (!textileType || !textileTypeValue) {
      return
    }

    let r = await addComposition(idFromUrl(), textileType, textileTypeValue)

    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      setTextileTypeValue('')
      setTextileType('')
      loadProduct(idFromUrl(), setProduct)
    } else {
      setSavingError(true)
    }
  }

  const buttonClick = async (e) => {

    if (e==='X') {
      setTextileTypeValue('')
      return
    }

    if (e==='ADD') {
      compositionAdd()
    }

    setTextileTypeValue(textileTypeValue+e)
  }

  
  const compositionApplySample = async (productId) => {
    
    let r = await sampleComposition(idFromUrl(), productId)

    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      loadProduct(idFromUrl(), setProduct)
    } else {
      setSavingError(true)
    }
  }

  const compositionFinish = async (e) => {
    
    if (!textileType) {
      return
    }

    let r = await finishComposition(idFromUrl(), textileType)

    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      loadProduct(idFromUrl(), setProduct)
    } else {
      setSavingError(true)
    }
  }

  const compositionRemove = async (id) => {
    
    //let id = idFromUrl()

    let r = await removeComposition(id)

    if (r) {
      props.setLastAction("Product has been saved")
      setSavingError(false)
      let id = idFromUrl()
      loadProduct(id, setProduct)

      //navigate("/menu")
    } else {
      setSavingError(true)
    }
  }



  const saveColor = async (e) => {

    let r = await postColor(newColor, newColorRgb)

    if (!r.ok) {
      setErrorNewColor(r.message)
      return
    }
    if (r.ok == true) {
      props.setLastAction(r.message)
      getColors(setColors)
      handleClose()
    } else {
      setErrorNewColor(r.message)
    }
};

const [errorNewColor, setErrorNewColor] = React.useState("");
const [openNewColor, setOpenNewColor] = React.useState(false);
const handleOpen = () => { setErrorNewColor(""); setOpenNewColor(true); }
const handleClose = () => setOpenNewColor(false);

const addNewColor = () => {
  handleOpen();
}

const setProduct = (prod) => {
  setItemName(prod.itemName)
  setArtNo(prod.artNo)
  setRefNo(prod.refNo)
  setDesign(prod.design)
  setPrice(prod.price)
  setPrice2((prod.price*1.05).toFixed(2))
  setPrice3((prod.price*1.10).toFixed(2))
  setStock(prod.stock)
  setWidth(prod.width)
  setWeight(prod.weight)
  setColorFastness(prod.colorFastness)
  setFabricConstruction(prod.fabricConstruction)
  setFabricYarnCount(prod.fabricYarnCount)
  setFabricShrinkage(prod.fabricShrinkage)
  setFindings(prod.findings)
  setHsCode(prod.hsCode)
  setProductStyle(prod.productStyle)
  setProductType(prod.productType)
  setPrintType(prod.printType)
  setPlainDyedType(prod.plainDyedType)
  setDyeStaff(prod.dyeStaff)
  setFinishing(prod.finishing)
  setSeason(prod.seasonIds)
  setOverworkType(prod.overWorkTypeIds)
  setDesignType(prod.designTypeIds)
  setComposition(prod.composition)
  setCompositionSamples(prod.compositionsSamples)

  setProductTextileTypes(prod.textileTypes)

  if (!prod.colors) {
    prod.colors = []
  }

  let cvNums = prod.colors.filter(it => !it.isProduct).map(x => x.colorNo)
  let max = cvNums.length > 0 ?  Math.max(...cvNums) : 0

  /*let lengthProd = prod.colors.filter(function(item){
    return item.isProduct;
  }).length;*/

  /*while(lengthProd<2) {
    prod.colors.splice(lengthProd,0,moreProductColors(1,prod.id)[0])
    lengthProd++
  }
  //prod.colors = prod.colors.concat(moreProductColors(2))*/
  setProductColors(moreProductColors(2,prod.id))
  let add = max % 2 == 1 ? 5 : 6

  prod.colors = prod.colors.concat(moreVariants(add,max))
  setColorVariants(prod.colors)

  wChanged(prod.width, prod.weight)
}

useEffect(() => {

  let id = idFromUrl()
  loadProduct(id, setProduct)

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

  console.log(productStyle)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

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
                    {errorNewColor}
                  </InputLabel>
          </Box>
          <Box sx={{flex: 2, ml: 2, mr: 2, display: "flex", flexDirection: 'column', alignItems: "center"}} >
          <TextField
                  margin="normal"
                  size="small" 
                  id="newColor"
                  label="Color name"
                  name="newColor"
                  value={newColor}
                  sx={{ width: "200px", mb: 6}}
                  onChange={ev => setNewColor(ev.target.value)}
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

      <Container sx={{maxWidth: "100%", padding: 0 }} className="header-container" >
        <Header user={props.user} title={props.title} />
        <main>
 
          <Typography component="h7" variant="h7" color={APPEARANCE.COLOR1}>
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
                label="Design"
                name="design"
                sx = {itemStyle1}
                value={design}
                onChange={ev => setDesign(ev.target.value)}
              />
              </Grid>

            <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
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

            <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
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

              <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
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

              <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
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
              <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Product Style"
                  valueName="styleName"
                  labelStyle={labelStyle1}
                  itemStyle = {itemStyle1}
                  sx={itemStyle1}
                  MenuProps={MySelectProps1}
                  valueVariable={productStyle}
                  setValueFn={setProductStyle}
                  data={productStyles}
                />
                </Grid>
                <Grid item xs={12} md={6} spacing={12} sx={{...flexStyle}} >
                <></>
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
          {/* <Box component={"div"} display={"flex"} justifyContent={"left"} alignItems={"left"} 
            marginBottom={3} marginLeft={6} marginRight={6} 
            paddingBottom={1} sx={accordionSummaryStyle} > */}
            <Grid container spacing={2} sx={accordionSummaryStyle}>
            
              { colorVariants && colorVariants.filter((el)=> el.colorVariantId != null).map((cv, index) => {
                return <Grid item xs={6} md={3} sx={{}} className="product-img-holder-item" >
                {/* <Box > */}
                  <Box className="product-img-holder-thumb" >
                  <Box 
                    component={"img"} 
                    key={index} 
                    src={config.api + "/" + cv.imagePath} 
                    alt={"photo"+(index+1)} 
                    className="product-img" />
                    <br/>
                    </Box>
                  <Box component={"div"} 
                    sx={{ m: 0, mt: 2, ml: 0, pb: 1, height: "22px", width: "135px", wordBreak: "break-all", wordWrap: "break-word", display: "flex", justifyContent: "space-between" }} 
                    textAlign={"center"} fontSize={"11px"} fontWeight={"600"} > 
                    
                    { cv.isProduct==false &&
                    <Box sx={{textAlign: "left"}}>
                    <span style={{backgroundColor: "rgb(251 178 96)", padding: "5px 3px", borderRadius: 3}}> 
                      { 'COLOR ' + (cv.colorNo ? cv.colorNo + ' : ' : ' ? ') + (cv.quantity ? cv.quantity : ' -') + ' m'} </span>
                    </Box>
                    }
                    { cv.isProduct==true &&
                    <Box sx={{textAlign: "left"}}>
                    <span style={{backgroundColor: "rgb(108 255 145)", padding: "5px 3px", borderRadius: 3 }}> GLOBAL PHOTO </span>                    
                    </Box>
                    }
                    <IconButton
                  color="success"
                  aria-label="upload picture"
                  sx={{color: APPEARANCE.BLACK2, p: 0, m: 0}}
                  component="span"
                  onClick={ function() { handleRemoveCv(cv)}} >
                    {<DeleteIcon sx={{color: APPEARANCE.BLACK2, pt: 0, m: 0}}/>}
                </IconButton>
                    </Box>

                    </Grid>    
              {/* </Box> */}
            })}
            </Grid>
            {/* </Box> */}

            <Grid container spacing={2} >
              { productColors.map((cv) => (
                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                    <ProductColor cv={cv} setColorItem={setProductColorItem}  />
                 </Grid> ))}

                { colorVariants && colorVariants.filter(it => !it.isProduct).map((cv) => (
                  <Grid item xs={12} md={6} sx={{ ...flexStyle}} >
                    {/* { (cv.isProduct == true) &&
                    <ProductColor cv={cv} setColorItem={setProductColorItem}  />
                    } */}
                    { (cv.isProduct !== true) &&
                    <ColorVariant cv={cv} setColorItem={setColorVariantItem} addNewFn={addNewColor} data={colors} />
                    }
                    </Grid> ))}
            </Grid>
          <FormControl sx = {{itemStyle}} > 
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <Button 
                    variant="contained"
                    style={buttonStyle}
                    onClick={moreProductColors} >
                        Add photos
                    </Button>
                    <Button 
                    variant="contained"
                    style={buttonStyle}
                    onClick={addVariants} >
                        Add colors
                    </Button>
                    </Box>
          </FormControl>
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
                  title="Product Type"
                  valueName="typeName"
                  labelStyle={labelStyle1}
                  itemStyle = {itemStyle1}
                  MenuProps={MySelectProps1}
                  valueVariable={productType}
                  setValueFn={setProductType}
                  data={productTypes}
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
                  valueVariable={season}
                  setValueFn={setSeason}
                  data={seasons}
                />
                </Grid>

                <Grid item xs={12} md={6}  >
                <MySelect 
                  id="addproduct-designtype"
                  url="DesignTypes"
                  title="Design type"
                  valueName="designName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  valueVariable={designType}
                  setValueFn={setDesignType}
                  data={designTypes}
                />
              </Grid>

                <Grid item xs={12} md={6}  >
                <MySelect 
                  id="addproduct-overworktype"
                  url="OverWorkTypes"
                  title="Overwork type"
                  valueName="overWorkName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  valueVariable={overworkType}
                  setValueFn={setOverworkType}
                  data={overworkTypes}
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

          <Grid item xs={12} md={6} >

          <InputMask
            mask="999 \* 999"
            value={fabricConstruction}
            disabled={false}
            onChange={ev => setFabricConstruction(ev.target.value)}
            maskChar=" " >

            {() => <TextField
              margin="normal"
              size="small" 
              id="fabricConstruction"
              label="Fabric construction"
              name="fabricConstruction"
              sx = {itemStyle1}
              value={fabricConstruction}
            />}

          </InputMask>

          </Grid>

          <Grid item xs={12} md={6} >

          <InputMask
            mask="999s \+ 999s"
            value={fabricYarnCount}
            disabled={false}
            onChange={ev => setFabricYarnCount(ev.target.value)}
            maskChar=" " >
            {() => <TextField
              margin="normal"
              size="small" 
              id="fabricYarnCount"
              label="Fabric Yarn Count"
              name="fabricYarnCount"
              sx = {itemStyle1}
              //value={fabricYarnCount}
            />}
          </InputMask>
          </Grid>

              <Grid item xs={12} md={6} spacing={2} >
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
                      <MenuItem key={"shr_"+ix} value={elem}
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
                      <MenuItem key={"shr_"+ix} value={elem}
                      style={getStyles(elem, fabricShrinkage, theme)}> { elem } </MenuItem> ))}
              </Select>
              </FormControl>
              </Grid>

              <Grid item xs={12} md={6} >
            <MySelect 
                id="addproduct-dyestaff"
                url="Finishings"
                title="Finishing"
                valueName="finishingName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                valueVariable={finishing}
                setValueFn={setFinishing}
                data={finishings}
              />
              </Grid>
              <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="hsCode"
                label="HS Code"
                name="hsCode"
                sx = {itemStyle1}
                value={hsCode}
                onChange={ev => setHsCode(ev.target.value)}
              />
              </Grid>

            <Grid item xs={12} md={6} >
               <MySelect 
                id="addproduct-printttype"
                url="PrintTypes"
                title="Print Type"
                valueName="typeName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                valueVariable={printType}
                setValueFn={setPrintType}
                data={printTypes}
              />
              </Grid>

              <Grid item xs={12} md={6} sx={{display: config.product.plain_dyed_types.includes(productStyle) ? "block" : "none" }} >
              <MySelect 
                id="addproduct-plaindyedtype"
                url="PlainDyedTypes"
                title="Plain Dyed Type"
                valueName="plainDyedTypeName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                valueVariable={plainDyedType}
                setValueFn={setPlainDyedType}
                data={plainDyedTypes}
                
              />
              </Grid>

              <Grid item xs={12} md={6} >
              <MySelect 
                id="addproduct-dyestaff"
                url="DyeStaffs"
                title="Dye Stuff"
                valueName="dyeStaffName"
                labelStyle={labelStyle}
                itemStyle={itemStyle1}
                MenuProps={MySelectProps}
                valueVariable={dyeStaff}
                setValueFn={setDyeStaff}
                data={dyeStaffs}
              />

          </Grid>
          </Grid>
          </AccordionDetails>

          {/* </Box> */}
          </Accordion>

          {/* Composition */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Composition</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'top' }}>
          <Box>
          { productTextileTypes && productTextileTypes.map((tt, ix) => (
            <>
             <IconButton
              onClick={  function() { compositionRemove(tt.id) } }> <RemoveCircleOutlineIcon/>
              </IconButton>
              <span>{tt.value}%&nbsp;{tt.textileType};&nbsp;&nbsp;</span>
              </>
          ))}
            
          </Box>
          <Box sx={{ mt: 1, width: "340px", display: 'flex', flexDirection: 'row', alignItems: 'top'}}>
          <Box sx={{ mt: 1, width: "340px", display: 'flex', flexDirection: 'column', alignItems: 'top'}}>
            <MySelect 
                  id="addproduct-textiletype"
                  url="TextileTypes"
                  title="Textile type"
                  valueName="textileTypeName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  valueVariable={textileType}
                  setValueFn={setTextileType}
                  data={textileTypes}
                />
          <Box sx={{ mt: 1, width: "340px", display: 'flex', flexDirection: 'row', alignItems: 'top'}}>
          <TextField
                  margin="normal"
                  size="small" 
                  id="textile-type-value"
                  label="Value"
                  name="textileTypeValue"
                  sx = {{...itemStyle1, ...{width: "73px"}}}
                  value={textileTypeValue}
                  onChange={ev => setTextileTypeValue(ev.target.value)}
                /> 
            {/* <Button
                variant="contained"
                aria-label="add to composition"
                size="small"
                sx={{backgroundColor: "#888", width: "60px", height: "36px", ml: 1}}
                onClick={compositionAdd}
                >
                  Add
            </Button> */}
            <Button
                variant="contained"
                aria-label="finish composition"
                size="small"
                sx={{backgroundColor: "#888", width: "90px", height: "36px", ml: 1}}
                onClick={compositionFinish}
                >
                  Make 100%
            </Button>
            </Box>
            <Box sx={{ mt: 0, display: 'flex', flexDirection: 'column'}}>
            <Box sx={{ mt: 0, display: 'flex', flexDirection: 'row', flexWrap: "wrap"}}>
            { BUTTONS.map((el, ix) => (
            
            (<>
            {ix % 3 == 0 && <div class="line-break"></div>}
            <Button
                variant="contained"
                aria-label="add to composition"
                size="small"
                sx={{backgroundColor: "#888", width: "60px", height: "36px", mr: 1, mt: 1}}
                onClick={function() { buttonClick(el) }}
                >
                  {el}
            </Button>
            </>)
            ))}
            </Box>
            </Box>
            </Box>
            <Box sx={{ mt: 1, ml: 1, minWidth: "340px", display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
              <Box sx={{backgroundColor: "#ddd", width: "100%", fontWeight: "555", p: 1, ml: 0, mt: 0, mb: 1}}>Similar compositions:</Box>
              <Box sx={{ mt: 1, ml: 1, textAlign: "left" }}>
              { compositionSamples && compositionSamples.map((el, ix) => (
            (<>
            <Box
                sx={{backgroundColor: "#fff", width: "100%", ml: 0, mt: 0, fontSize: "10pt", cursor: "pointer"}}
                onClick={function() { compositionApplySample(el.productId) }}
                >
                  {el.composition}
            </Box>
            </>)
            ))}
            </Box>
            </Box>
            </Box>
            </Box>
            </AccordionDetails>
          </Accordion>


          <FormControl sx = {{itemStyle}} > 
          { savingError && 
            <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
            An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
            </Box> }
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={saveProduct} >
                        Save
                  </Button>
                  {/* <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={openMyProducts} >
                        View products
                  </Button> */}
                </Box>
          </FormControl>
        </main>

      </Container>
      <Footer sx={{ mt: 2, mb: 2 }} />
    </ThemeProvider>
  );
}
