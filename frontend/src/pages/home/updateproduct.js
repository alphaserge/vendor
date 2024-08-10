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
import MenuItem from '@mui/material/MenuItem';
import { HexColorPicker } from "react-colorful";

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
import { postProduct, loadProduct } from '../../api/products'

import Header from './header';
import Footer from './footer';

import { APPEARANCE } from '../../appearance';

import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTheme = createTheme()
//const accordionStyle = { width: 340, m: 2, ml: 4, mr: 4 }
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }
const halfItemStyle = { width: 180, ml: 0, mr: 2 }
const selectStyle = { width: 290, m: 2, ml: 4, mr: 4 }
const boxStyle = { display: 'inline-flex', flexDirection: 'row', alignItems: 'center', width: '360px', ml:4, mr:2 }
const labelStyle = { m: 2, ml: 4, mr: 4 }
const labelStyle1 = { m: 2, ml: 0, mr: 4 }
const buttonStyle = { width: 100, m: 2, backgroundColor: APPEARANCE.BUTTON_BG, color: APPEARANCE.BUTTON, margin: "0 10px", width: 130, height: "40px", textTransform: "none", borderRadius: "0" }
const accordionStyle = { textAlign: "center", margin: "15px auto", justifyContent:"center", boxShadow: "none", border: "none" }
const accordionSummaryStyle = { maxWidth: "744px", margin: "0 auto", padding: "0 10px",  backgroundColor: "#e4e4e4", textTransform: "none", border: "1px #ddd solid", borderRadius: "4px" }
const accordionCaption = { width: "100%", fontWeight: "bold", fontSize: "11pt" };

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

    const [savingError, setSavingError] = useState(false)

    const [colorVariantPlus, setColorVariantPlus] = useState([])
    const [productColorsPlus, setProductColorsPlus] = useState([])
    const [colorVariant, setColorVariant] = useState([])
    const [productColors, setProductColors] = useState([])
    
    let loc = useLocation()

    const idFromUrl = () => {
      const search = window.location.search
      const params = new URLSearchParams(search)
      return params.get('id')
    }

    const setColorVariantItem = (i, item) => {
      let cv = colorVariantPlus.map(el=>el.Id==i? item:el)
      setColorVariantPlus(cv)
    }

    const setProductColorItem = (i, item) => {
      let cv = productColorsPlus.map(el=>el.Id==i? item:el)
      setProductColorsPlus(cv)
    }

    const [selectedFile, setSelectedFile] = useState(null)

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
      wChanged(value, weight)
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

    const moreVariants = async (e, max) => {
      let cv = colorVariantPlus.slice()
      if (max === null || max === undefined) {
        let num = cv.length
        let cvNums = colorVariantPlus.map(x => x.No)
        max = cvNums.length > 0 ?  Math.max(...cvNums) : 0
      }
      let i=max+1
      while (i<max+7){
        cv.push({
          Id: uuid(),
          No: i,
          ColorNo: null,
          ColorIds: [],
          ColorId: [],
          SelectedFile: null,
          IsProduct: false
        })
        i++
      }
      setColorVariantPlus(cv)
    }
  
    const moreProductColors = async (e) => {
      let cv = productColorsPlus.slice()
      let num = cv.length
      let cvNums = productColorsPlus.map(x => x.No);
      let max = cvNums.length > 0 ? Math.max(...cvNums) : 0
      let i=max+1
      while (i<max+3){
        cv.push({
          Id: uuid(),
          No: i,
          SelectedFile: null,
          IsProduct: true
        })
        i++
      }
      setProductColorsPlus(cv)
    }
  
    const handleRemoveCv = async (cv) => {

      fetch(config.api + '/Products/ProductRemoveCV', {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({
          Id: cv.cvId,
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
      uid: uid,
      designType: designType,
      overworkType: overworkType,
      productStyle: productStyle,
      productType: productType,
      printType: printType,
      dyeStaff: dyeStaff,
      finishing: finishing,
      plainDyedType: plainDyedType,
      colorVariants: colorVariantPlus.filter(it => !!it.ColorNo && it.ColorIds.length > 0 && !!it.SelectedFile), 
      globalPhotos: productColorsPlus.filter(it => !!it.No && !!it.SelectedFile)
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
  setColorVariant(prod.colors)

  wChanged(prod.width, prod.weight)

  if (colorVariantPlus.length == 0) {
    let cvNums = prod.colors.map(x => x.cvNum)
    let max = cvNums.length > 0 ?  Math.max(...cvNums) : 0
    moreVariants(null, max)
  }

  if (productColorsPlus.length == 0) {
    moreProductColors()
  }
  //setProductColors()
  //setGramm_pm( parseInt(prod.weight)*parseInt(prod.width)/100)
}

useEffect(() => {

  let id = idFromUrl()
  loadProduct(id, setProduct)

  //const prod = fetchData(id)


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

  }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Modal
        open={openNewColor}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
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
          
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Main properties</Typography>
          </AccordionSummary>

          <AccordionDetails>
          <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="itemName"
                label="Item name"
                name="itemName"
                sx = {itemStyle}
                value={itemName}
                onChange={ev => setItemName(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="design"
                label="Design"
                name="design"
                sx = {itemStyle}
                value={design}
                onChange={ev => setDesign(ev.target.value)}
              />

            <Box sx={boxStyle}>
            <TextField
                margin="normal"
                size="small" 
                id="refNo"
                label="Ref No"
                name="refNo"
                sx = {halfItemStyle}
                value={refNo}
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
            </Box>  
            <Box sx={boxStyle}>
            <TextField
                margin="normal"
                size="small" 
                id="price"
                label="Price > 500m"
                name="price"
                sx = {{width: 122, ml: 0, mr: 1}}
                value={price}
                onChange={priceChanged}
              />
            <TextField
                margin="normal"
                size="small" 
                id="price2"
                label="301-500m"
                name="price2"
                sx = {{width: 104, ml: 0, mr: 1}}
                value={price2}
                InputProps={{ readOnly: true, }}
              />
            <TextField
                margin="normal"
                size="small" 
                id="price3"
                label="< 301m"
                name="price3"
                sx = {{width: 98, ml: 0, mr: 1}}
                value={price3}
                InputProps={{ readOnly: true, }}
              />
              </Box>
              <Box sx={boxStyle}>
                <MySelect 
                  id="addproduct-producttype"
                  url="ProductTypes"
                  title="Product Type"
                  valueName="typeName"
                  labelStyle={labelStyle1}
                  itemStyle = {{width: 163, m: 2, ml: 0, mr: 4}}
                  MenuProps={MySelectProps1}
                  valueVariable={productType}
                  setValueFn={setProductType}
                  data={productTypes}
                />

                <MySelect 
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Product Style"
                  valueName="styleName"
                  labelStyle={labelStyle1}
                  itemStyle = {{width: 163, m: 2, ml: 0, mr: 4}}
                  MenuProps={MySelectProps1}
                  valueVariable={productStyle}
                  setValueFn={setProductStyle}
                  data={productStyles}
                />
                </Box>

                <MySelect 
                  id="addproduct-season"
                  url="Seasons"
                  title="Season"
                  valueName="seasonName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MySelectProps}
                  valueVariable={season}
                  setValueFn={setSeason}
                  data={seasons}
                />

                <MySelect 
                  id="addproduct-designtype"
                  url="DesignTypes"
                  title="Design type"
                  valueName="designName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MySelectProps}
                  valueVariable={designType}
                  setValueFn={setDesignType}
                  data={designTypes}
                />

              <MySelect 
                  id="addproduct-overworktype"
                  url="OverWorkTypes"
                  title="Overwork type"
                  valueName="overWorkName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MySelectProps}
                  valueVariable={overworkType}
                  setValueFn={setOverworkType}
                  data={overworkTypes}
                />
          </Grid>
          </AccordionDetails>

          {/* </Box> */}
          </Accordion>

          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} elevation={0} sx={{ '&:before':{height:'0px'}}} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Weight / Width / GSM</Typography>
          </AccordionSummary>

          <AccordionDetails>
          <Grid item xs={12} md={6} >
            <Box sx={boxStyle}>
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
              </Box>
              <Box sx={boxStyle}>
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
              </Box>
          </Grid>
          </AccordionDetails>
          </Accordion>

          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true}  elevation={0} sx={{ '&:before':{height:'0px'}}} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Product photos</Typography>
          </AccordionSummary>

          <AccordionDetails>
        <Box component={"div"} display={"flex"} justifyContent={"left"} alignItems={"left"} 
          marginBottom={3} marginLeft={6} marginRight={6} 
          paddingBottom={1} sx={accordionSummaryStyle} >
            {colorVariant.map((cv, index) => {
              return <Box className="product-img-holder-item">
                <Box className="product-img-holder-thumb" >

                <Box 
                  component={"img"} 
                  key={index} 
                  src={"https://localhost:3080/"+cv.imagePath} 
                  alt={"photo"+(index+1)} 
                  className="product-img" />
                  <br/>
                  </Box>
                  <Box component={"div"} 
                    sx={{ mt: 1, ml: 1, height: "36px", width: "125px", wordBreak: "break-all", wordWrap: "break-word", alignItems: "center" }} 
                    textAlign={"center"} fontSize={"11px"} fontWeight={"600"} > { (cv.cvNum?cv.cvNum+' - ':'') + cv.color} </Box>

          <IconButton
          color="success"
          aria-label="upload picture"
          sx={{color: APPEARANCE.BLACK2, pt: 0}}
          component="span"
          onClick={ function() { handleRemoveCv(cv)}}
          >
              {<DeleteIcon />}
              </IconButton>
        </Box>
      })}
      </Box>


          <Grid item xs={12} md={6} >
                { productColorsPlus.map((cv) => (
                    <ProductColor cv={cv} setColorItem={setProductColorItem}  />
                 ))}

                { colorVariantPlus.map((cv) => (
                    <ColorVariant cv={cv} setColorItem={setColorVariantItem} addNewFn={addNewColor} data={colors} />
                 ))}
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
                    onClick={moreVariants} >
                        Add colors
                    </Button>
                    </Box>
          </FormControl>
          </AccordionDetails>
          </Accordion>

          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true}  elevation={0} sx={{ '&:before':{height:'0px'}}} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Additional properties</Typography>
          </AccordionSummary>

          <AccordionDetails>
          <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="fabricConstruction"
                label="Fabric construction"
                name="fabricConstruction"
                sx = {itemStyle}
                value={fabricConstruction}
                onChange={ev => setFabricConstruction(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="fabricYarnCount"
                label="Fabric Yarn Count"
                name="fabricYarnCount"
                sx = {itemStyle}
                value={fabricYarnCount}
                onChange={ev => setFabricYarnCount(ev.target.value)}
              />
            {/* <TextField
                margin="normal"
                size="small" 
                id="fabricShrinkage"
                label="Fabric Shrinkage"
                name="fabricShrinkage"
                sx = {itemStyle}
                value={fabricShrinkage}
                onChange={ev => setFabricShrinkage(ev.target.value)}
              /> */}

              <Box sx={boxStyle}>
              <FormControl >
              <InputLabel id="fabric-shrinkage-label" sx={labelStyle1} size="small" >Fabric Shrinkage</InputLabel>
              <Select
                size="small" 
                labelId="fabric-shrinkage-label"
                id="fabric-shrinkage"
                value={fabricShrinkage}
                label="Fabric Shrinkage"
                sx = {{width: 163, m: 2, ml: 0, mr: 4}}
                onChange={ev => setFabricShrinkage(ev.target.value)} >
                   { [...Array(11).keys()].map((elem, ix) => (
                      <MenuItem key={"shr_"+ix} value={elem}
                      style={getStyles(elem, fabricShrinkage, theme)}> { elem + "%"} </MenuItem> ))}
              </Select>
              </FormControl>

              <FormControl >
              <InputLabel id="color-fastness-label" sx={labelStyle1} size="small" >Color Fastness</InputLabel>
              <Select
                size="small" 
                labelId="color-fastness-label"
                id="color-fastness"
                value={colorFastness}
                label="Color Fastness"
                sx = {{width: 163, m: 2, ml: 0, mr: 4}}
                onChange={ev => setColorFastness(ev.target.value)} >
                   {  [...Array(6).keys()].map((elem, ix) => (
                      <MenuItem key={"shr_"+ix} value={elem}
                      style={getStyles(elem, fabricShrinkage, theme)}> { elem } </MenuItem> ))}
              </Select>
              </FormControl>
              </Box>

            {/* <TextField
                margin="normal"
                size="small" 
                id="colorFastness"
                label="Color Fastness"
                name="colorFastness"
                sx = {itemStyle}
                value={colorFastness}
                onChange={ev => setColorFastness(ev.target.value)}
              /> */}
            <MySelect 
                id="addproduct-dyestaff"
                url="Finishings"
                title="Finishing"
                valueName="finishingName"
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                MenuProps={MySelectProps}
                valueVariable={finishing}
                setValueFn={setFinishing}
                data={finishings}
              />
            <TextField
                margin="normal"
                size="small" 
                id="hsCode"
                label="HS Code"
                name="hsCode"
                sx = {itemStyle}
                value={hsCode}
                onChange={ev => setHsCode(ev.target.value)}
              />

              <MySelect 
                id="addproduct-printttype"
                url="PrintTypes"
                title="Print Type"
                valueName="typeName"
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                MenuProps={MySelectProps}
                valueVariable={printType}
                setValueFn={setPrintType}
                data={printTypes}
              />

              <MySelect 
                id="addproduct-plaindyedtype"
                url="PlainDyedTypes"
                title="Plain Dyed Type"
                valueName="plainDyedTypeName"
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                MenuProps={MySelectProps}
                valueVariable={plainDyedType}
                setValueFn={setPlainDyedType}
                data={plainDyedTypes}
              />

              <MySelect 
                id="addproduct-dyestaff"
                url="DyeStaffs"
                title="Dye Staff"
                valueName="dyeStaffName"
                labelStyle={labelStyle}
                itemStyle={itemStyle}
                MenuProps={MySelectProps}
                valueVariable={dyeStaff}
                setValueFn={setDyeStaff}
                data={dyeStaffs}
              />

          </Grid>
          </AccordionDetails>

          {/* </Box> */}
          </Accordion>

          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} elevation={0} sx={{ '&:before':{height:'0px'}}} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Logistic</Typography>
          </AccordionSummary>

          <AccordionDetails>
          <Grid item xs={12} md={6} >
            <Box sx={boxStyle}>
              <TextField
                  margin="normal"
                  size="small" 
                  id="stock"
                  label="Stock value"
                  name="stock"
                  sx = {halfItemStyle}
                  value={stock}
                  onChange={ev => setStock(ev.target.value)}
                />
               </Box>
               <Box sx={boxStyle}>
              
               </Box>
           </Grid>
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
