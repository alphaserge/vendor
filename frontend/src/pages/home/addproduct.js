import React, { useState, useEffect, useSyncExternalStore } from "react";
import { json, useNavigate } from "react-router-dom";

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
import OutlinedInput from '@mui/material/OutlinedInput';
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
import { postProduct } from '../../api/products'

import Header from './header';
import Footer from './footer';

import { APPEARANCE } from '../../appearance';

import Modal from '@mui/material/Modal';
import { Accordion, AccordionSummary, AccordionDetails, InputLabel } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

const defaultTheme = createTheme()
//const accordionStyle = { width: 340, m: 2, ml: 4, mr: 4 }
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

export default function AddProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

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
    const [fabricShrinkage, setFabricShrinkage] = useState("")
    const [hsCode, setHsCode] = useState("")
    const [metersInKg, setMetersInKg] = useState("")
    const [refNo, setRefNo] = useState("")
    const [stock, setStock] = useState("")
    
    const [uid, setUid] = useState(uuid())

    const [newColor, setNewColor] = useState("")
    const [newColorRgb, setNewColorRgb] = useState("#b32aa9")
    //const [color, setColor] = useState("#b32aa9");

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

    const [colorVariant, setColorVariant] = useState(
      [...Array(10)].map((elem, index) => {
        return {
          Id: uuid(),
          No: index + 1,
          ColorNo: null,
          ColorQuantity: null,
          ColorIds: [],
          ColorId: [],
          SelectedFile: null,
          };
      }))

    const [allColor, setAllColor] = useState([
      {
        Id: uuid(),
        No: 1,
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 2,
        SelectedFile: null,
      },
    ])

    const setColorProduct = (i, item) => {
      let cv = allColor.map(el=>el.Id==i? item:el)
      setAllColor(cv)
    }

    const setColorVariantItem = (i, item) => {
      let cv = colorVariant.map(el=>el.Id==i? item:el)
      setColorVariant(cv)
    }

    const weightChanged = (e) => {
      let value = e.target.value
      setWeight(Math.round(parseInt(value)))
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
        setWeight(Math.round(iWeight))
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

  const moreVariants = async (e) => {
    let cv = colorVariant.slice()
    let num = cv.length
    let i=num+1
    while (i<=num+6){
      cv.push({
        Id: uuid(),
        No: i,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      })
      i++
    }
    setColorVariant(cv)
  }

  const morePhotos = async (e) => {
    let cv = allColor.slice()
    let num = cv.length
    let i=num+1
    while (i<=num+2){
      cv.push({
        Id: uuid(),
        No: i,
        SelectedFile: null,
      })
      i++
    }
    setAllColor(cv)
  }

  const openMyProducts = async (e) => {
  }

  const saveProduct = async (e) => {
    
    let vendorId = props.user ? props.user.vendorId : -1;

    let prod = {
      vendorId: vendorId,
      artNo: artNo,
      itemName: itemName,
      design: design,
      hsCode: hsCode,
      refNo: refNo,
      price: price,
      season: season,
      stock: stock,
      weight: weight,
      width: width,
      colorFastness: colorFastness,
      fabricConstruction: fabricConstruction,
      fabricYarnCount: fabricYarnCount,
      fabricShrinkage: fabricShrinkage,
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
      colorVariants: colorVariant.filter(it => !!it.ColorNo),
      globalPhotos: allColor.filter(it => !!it.SelectedFile)
    }

    let r = await postProduct(prod, "ProductAdd")

    if (r) {
      props.setLastAction("Product has been added")
      setSavingError(false)
      navigate("/menu")
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

if (!props.user || props.user.Id == 0) {
  navigate("/")
}

useEffect(() => {
  
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

  /*setItemName('WINDSOR JAQUARD DYED')
  setArtNo('MP-22040')
  setRefNo('22040')
  setDesign('P/D (505-e)')
  setPrice('10')
  setWidth('150')
  setWeight('400')
  setColorFastness('3')
  setFabricConstruction('Simple 1')
  setFabricYarnCount('4')
  setFabricShrinkage('5')
  setFindings('test 1')
  setHsCode('HS 001')
  setDesignType([1,2])
  setProductType(1)
  setProductStyle(1)
  setSeason([1,2])
  setOverworkType([1,2])

  setDyeStaff(1)
  setPrintType(2)
  setPlainDyedType(2)*/

  }, []);

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
 
          <Typography component="h1" variant="h6" color={APPEARANCE.COLOR1}>
            Adding a product form
          </Typography>
          <Typography component="p" variant="subtitle1" sx={{mb:2}}  color={APPEARANCE.COLOR1}>
          Please fill out all fields and click the Save button
          </Typography>
          
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
          </Grid>
          </AccordionDetails>
          </Accordion>

          {/* Product photos */}
          <Accordion style={accordionStyle} className="header-menu" defaultExpanded={true} >

          <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={accordionSummaryStyle} >
            <Typography align="center" sx={accordionCaption}>Product photos</Typography>
          </AccordionSummary>

          <AccordionDetails sx={accordionDetailsStyle}>
          <Grid container spacing={2} >
          { allColor.map((cv) => (
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
                    <ProductColor cv={cv} setColorItem={setColorProduct}  />
               </Grid> ))}

          { colorVariant.map((cv) => (
              <Grid item xs={12} md={6} sx={{ ...flexStyle}} >
                  <ColorVariant cv={cv} setColorItem={setColorVariantItem} addNewFn={addNewColor} data={colors} />
              </Grid> ))}
          </Grid> 
          <FormControl sx = {{itemStyle}} > 
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                    <Button 
                    variant="contained"
                    style={buttonStyle}
                    onClick={morePhotos} >
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
            
              <Grid item xs={6} md={3} >
              <TextField
                  margin="normal"
                  size="small" 
                  id="gsm"
                  label="GSM"
                  name="gsm"
                  sx = {itemStyle1}
                  value={gsm}
                  onChange={densityChanged}
                />
                </Grid>

                <Grid item xs={6} md={3} >
                <TextField
                  margin="normal"
                  size="small" 
                  id="width"
                  label="Width"
                  name="width"
                  sx = {itemStyle1}
                  value={width}
                  onChange={widthChanged}
                />
              </Grid>

              <Grid item xs={6} md={3} >
                <TextField
                  margin="normal"
                  size="small" 
                  id="weight"
                  label="Weight G/M"
                  name="weight"
                  sx = {itemStyle1}
                  value={weight}
                  onChange={weightChanged}
                />

                </Grid>
                <Grid item xs={6} md={3} >
                <TextField
                  margin="normal"
                  size="small" 
                  id="metersInKg"
                  label="Meters in KG"
                  name="metersInKg"
                  sx = {itemStyle1}
                  value={metersInKg}
                  onChange={ev => setMetersInKg(ev.target.value)}
                />
              </Grid>


          <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="fabricConstruction"
                label="Fabric construction"
                name="fabricConstruction"
                sx = {itemStyle1}
                value={fabricConstruction}
                onChange={ev => setFabricConstruction(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} >
            <TextField
                margin="normal"
                size="small" 
                id="fabricYarnCount"
                label="Fabric Yarn Count"
                name="fabricYarnCount"
                sx = {itemStyle1}
                value={fabricYarnCount}
                onChange={ev => setFabricYarnCount(ev.target.value)}
              />
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

              <Grid item xs={12} md={6} >
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
                title="Dye Staff"
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
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={openMyProducts} >
                        View products
                  </Button>
                </Box>
          </FormControl>


        </main>
      </Container>
      <Footer sx={{ mt: 2, mb: 2 }} />
    </ThemeProvider>
  );
}
