import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import TuneIcon from '@mui/icons-material/Tune';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import InputAdornment from '@mui/material/InputAdornment';
import Link from '@mui/material/Link';
import TextField from '@mui/material/TextField';
import GridViewIcon from '@mui/icons-material/GridView';
import TableRowsIcon from '@mui/icons-material/TableRows';
import Tooltip from '@mui/material/Tooltip';
import Modal from '@mui/material/Modal';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Autocomplete from '@mui/material/Autocomplete';
import axios from 'axios'

import config from "../../config.json"

import PageHeader from './pageheader';
import Footer from './footer';

import ItemProduct from './itemproduct';
import ItemProductRow from './itemproductrow';
import SimpleCombo from '../../components/simplecombo';
import StyledSelect from '../../components/styledselect';
import MySelect from '../../components/myselect';
import StTextField from '../../components/sttextfield';
import MyAutocomplete from '../../components/myautocomplete';
import AddProductModal from '../../components/AddProductModal';
import { postProduct, productsImport } from '../../api/products'
import { getItemNames, postItemName } from "../../api/itemnames";
import { getTextileTypes, postTextileType } from '../../api/textiletypes'

import { APPEARANCE } from '../../appearance';
import { Button } from "@mui/material";
import { styled } from '@mui/material/styles'
import { Label } from "@mui/icons-material";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 330, mt: 0 }
const smallItemStyle = { width: 161, m: 0, mr: 1 }
const labelStyle1 = { m: 0, mt: 1, ml: 0, mr: 4 }
const buttonStyle = { width: 90, height: 40, backgroundColor: APPEARANCE.BLACK3, m: 1 }
const outboxStyle = { maxWidth: "744px", margin: "80px auto 20px auto", padding: "0 10px" }
const findBoxStyle = { width: "calc(100% - 80px)" }
const findTextStyle = { width: "100%", border: "none" }
//const findTextStyle = { width: "100%", border: "none", border: "solid 1px #888", borderRadius: 1 }
const toolButtonStyle = { width: "26px", height: "26px", marginTop: "5px" }
const flexStyle = { display: "flex", flexDirection: "row", alignItems : "center", justifyContent: "space-between" }

const itemStyle1 = { width: "calc( 100% - 0px )", mt: 0, ml: 0, mr: 0  }
const labelStyle = { m: 0, ml: 0, mr: 4 }


const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const MySelectProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
}

const fromUrl = (name) => {
  const search = window.location.search
  const params = new URLSearchParams(search)
  return params.get(name)
}

const Input = styled('input')({
  display: 'none',
});

export default function ListProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [products, setProducts] = useState([])
    const [filter, setFilter] = useState(false)
    const [search, setSearch] = useState("")
    const [addProduct, setAddProduct] = useState(false)
    
    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [productStyles, setProductStyles] = useState([])

    const [productStyle, setProductStyle] = useState("")
    const [productType, setProductType] = useState("")
    const [color, setColor] = useState([])
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [itemName, setItemName] = useState("")
    const [refNo, setRefNo] = useState("")
    const [artNo, setArtNo] = useState("")
    const [design, setDesign] = useState("")
    const [view, setView] = useState("grid")
    
    const [itemNames, setItemNames] = useState([])
    const [addItemName, setAddItemName] = useState("")
    const [existingItemName, setExistingItemName] = useState(null)
    const [addRefNo, setAddRefNo] = useState("")
    const [addArtNo, setAddArtNo] = useState("")
    const [addDesign, setAddDesign] = useState("")
    const [existingDyeStaff, setExistingDyeStaff] = useState("")
    const [existingFabricConstruction, setExistingFabricConstruction] = useState("")
    const [existingFabricShrinkage, setExistingFabricShrinkage] = useState("")
    const [existingFabricYarnCount, setExistingFabricYarnCount] = useState("")
    const [existingFindings, setExistingFindings] = useState("")
    const [existingGsm, setExistingGsm] = useState(null)
    const [existingHsCode, setExistingHsCode] = useState("")
    const [existingProductStyle, setExistingProductStyle] = useState("")
    const [existingProductType, setExistingProductType] = useState("")
    const [existingPlainDyedType, setExistingPlainDyedType] = useState("")
    const [existingSeason, setExistingSeason] = useState("")
    const [existingWeight, setExistingWeight] = useState(null)
    const [existingWidth, setExistingWidth] = useState(null)
    const [existingColorFastness, setExistingColorFastness] = useState(null)
    const [existingProductStyleId, setExistingProductStyleId] = useState(null)
    const [existingProductTypeId, setExistingProductTypeId] = useState(null)
    const [existingPlainDyedTypeId, setExistingPlainDyedTypeId] = useState(null)
    const [existingSeasonsId, setExistingSeasonsId] = useState([])
    const [existingDyeStaffId, setExistingDyeStaffId] = useState(null)
    const [existingFinishingId, setExistingFinishingId] = useState(null)

    const [savingError, setSavingError] = useState(false)
    const [waiting, setWaiting] = useState(false)
    const [itemNameNewFocus, setItemNameNewFocus] = useState(false)
    const [compositionText, setCompositionText] = useState([])
    const [composition, setComposition] = useState("")
    const [textileType, setTextileType] = useState("")
    const [textileTypes, setTextileTypes] = useState([])
    
    const headStyle = { maxWidth: "744px", width: "auto", margin: "0", padding: "0 10px" }

    const handleImport = async (event) => {
      showWaiting(true)
      await productsImport(event.target.files[0], props.user.vendorId); 
      loadProducts();
      showWaiting(false)
    };

    const showWaiting = (show) => {
      setWaiting(show)
    }
    
    const handleShowHideFilter = (event) => {
      setFilter(!filter)
    };

    const clearFilter = (e) => {
      setProductStyle("")
      setProductType("")
      setColor([])
      setDesignType([])
      setOverworkType([])
      setSeason([])
      setItemName("")
      setRefNo("")
      setArtNo("")
      setDesign("")
      setSearch("")

      axios.get(config.api + '/Products/Products?id='+props.user.id, 
        { params: 
            { 
              vendorId: null,
              shownullprice: "true",
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
          setFilter(false)
        })
      .catch (error => {
        console.log(error)
      })
   }

   const handleAddProductShow = (event) => {
    setAddProduct(true)
  };

  const handleAddProductSave = (event) => {
    saveProduct()
    setAddProduct(false)
    setItemNameNewFocus(true)
  };

  const handleAddProductCancel = (event) => {
    setAddProduct(false);
  };

    const url = require('url');

    const searchProducts = async (e) => {

      setSearch(e)
      axios.get(config.api + '/Products/Products?id='+props.user.id, 
        { params: 
            { 
              search: e,
              shownullprice: "true",
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
      })
      .catch (error => {
        console.log(error)
      })
    }

    const loadProducts = async (e) => {
      //const params = new URLSearchParams();
      //params.append(color, [1,2]);

      //const params = new url.URLSearchParams({ foo: 'bar' });      

      axios.get(config.api + '/Products/Products?id='+props.user.id, 
        { params: 
            { 
              name: itemName,
              artno: artNo,
              refno: refNo,
              design: design,
              colors: JSON.stringify(color),
              seasons: JSON.stringify(season),
              overworks: JSON.stringify(overworkType),
              designtypes: JSON.stringify(designType),
              search: search,
              shownullprice: "true",
            }})
      .then(function (res) {
          var result = res.data;
          setProducts(result)
          setFilter(false)
      })
      .catch (error => {
        console.log(error)
      })
    }
    
    const loadColors = () => {
      axios.get(config.api + '/Colors')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.colorName, rgb:item.rgb }))
          setColors(items)
      })
      .catch (error => {
        console.log('Addproduct loadColors error:' )
        console.log(error)
      })
    }
    
    const loadSeasons = () => {
      axios.get(config.api + '/Seasons')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.seasonName }))
          setSeasons(items)
      })
      .catch (error => {
        console.log('Addproduct loadSeasons error:' )
        console.log(error)
      })
    }
    
    const loadDesignTypes = () => {
      axios.get(config.api + '/DesignTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.designName }))
          setDesignTypes(items)
      })
      .catch (error => {
        console.log('Addproduct loadDesignTypes error:' )
        console.log(error)
      })
    }
    
    const loadOverworkTypes = () => {
      axios.get(config.api + '/OverworkTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.overWorkName }))
          setOverworkTypes(items)
      })
      .catch (error => {
        console.log('Addproduct loadDesignTypes error:' )
        console.log(error)
      })
    }
    
    const loadProductTypes = () => {
      axios.get(config.api + '/ProductTypes')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.typeName }))
          setProductTypes(items)
      })
      .catch (error => {
        console.log('Addproduct loadProductTypes error:' )
        console.log(error)
      })
    }
    
    const loadProductStyles = () => {
      axios.get(config.api + '/ProductStyles')
      .then(function (res) {
          let items = res.data.map((item)=>({ id:item.id, value:item.styleName }))
          setProductStyles(items)
      })
      .catch (error => {
        console.log('Addproduct loadProductStyles error:' )
        console.log(error)
      })
    }
        
    const saveProduct = async (e) => {
    
      let vendorId = props.user ? props.user.vendorId : -1;
  
      let prod = {
        vendorId: vendorId,
        artNo: addArtNo,
        itemName: itemNameNewFocus==true ? addItemName : existingItemName,
        design: addDesign,
        refNo: addRefNo,
        dyeStaffId: itemNameNewFocus==true ? null : existingDyeStaffId,
        fabricConstruction: itemNameNewFocus==true ? null : existingFabricConstruction,
        fabricShrinkage: itemNameNewFocus==true ? null : existingFabricShrinkage,
        fabricYarnCount: itemNameNewFocus==true ? null : existingFabricYarnCount,
        fabricYarnCount: itemNameNewFocus==true ? null : existingFabricYarnCount,
        finishingId: itemNameNewFocus==true ? null : existingFindings,
        gsm: itemNameNewFocus==true ? null : existingGsm,
        hsCode: itemNameNewFocus==true ? null : existingHsCode,
        productStyleId: itemNameNewFocus==true ? null : existingProductStyleId,
        productTypeId: itemNameNewFocus==true ? null : existingProductTypeId,
        plainDyedTypeId: itemNameNewFocus==true ? null : existingPlainDyedTypeId,
        seasonsId: itemNameNewFocus==true ? null : existingSeasonsId,
        weight: itemNameNewFocus==true ? null : existingWeight,
        width: itemNameNewFocus==true ? null : existingWidth,
        colorFastness: itemNameNewFocus==true ? null : existingColorFastness,
        compositionValues: itemNameNewFocus==true ? [] : composition.map( c => { return { textileTypeId: c.textileTypeId, value: c.value}})
      }
  
      //let pr = {...prod, ...{composition: composition.map( c => { return { textileTypeId: c.textileTypeId, value: c.value}})}}
      let r = await postProduct(prod, "ProductAdd")
  
      if (r && r.status == true) {
        props.setLastAction("Product has been added")
        setSavingError(false)
        navigate("/updateproduct?id=" + r.id)
      } else {
        setSavingError(true)
      }
    }
  
    useEffect(() => {
      loadProducts()
      loadColors()
      loadSeasons()
      loadDesignTypes()
      loadOverworkTypes()
      loadProductTypes()
      loadProductStyles()
      getItemNames(setItemNames)
      getTextileTypes(setTextileTypes)

      if (fromUrl("new")==1) {
        setAddProduct(true)
      }
  
  
    }, []);

  if (!props.user || props.user.Id == 0) {
    navigate("/")
  }

  console.log('compositionText:')
  console.log(compositionText)

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />

      <Modal
        open={waiting}
        onClose={function() { setWaiting(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto", outline: "none" }} >

        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: "330px",
          boxShadow: 24,
          padding: "45px 40px 40px 40px",
          outline: "none",
          bgcolor: 'background.paper',
           }}>
          
          <Typography sx={{fontSize: "16px", color: "#333" , textAlign: "center" }}>Please waiting</Typography>
        </Box>
      </Modal>

      {/* <AddProductModal 
        open={addProduct}
        onClose={function() { setAddProduct(false) }}
        user={props.user} /> */}

      <Modal
        open={addProduct}
        onClose={function() { setAddProduct(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{ width: "auto"}} >

        <Box sx={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: "auto", 
          bgcolor: 'background.paper', 
          border: '2px solid #000', 
          boxShadow: 24, 
          p: "20px",
          display: "flex",
          flexDirection: 'column' }}>
          <Box id="modal-modal-title" component="h3" sx={{textAlign: "center", mb: "25px"}} >
            Adding a new product
          </Box>

          <Box sx={{display:'grid', gridTemplateColumns: itemNameNewFocus==false && !!existingItemName ? '1fr 1fr' : '1fr 0', p:0, m:0}}>

          <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'left' }}>

          <Typography sx={{mt: "10px", mb: "6px"}}>Select existing name:</Typography>
          <FormControl error={false} size="small" sx={{ ...itemStyle,  ...{width: "100%", display: "flex" } }} > 
           {/* <InputLabel id="iname-lab" size="small" > Existing item name </InputLabel>  */}
              <StyledSelect 
                id="iname"
                labelId="iname-lab"
                size="small"
                //title="Existing item name"
                //label="Existing item name"
                sx={{...itemStyle, ...{ m: 0}}}
                MenuProps={MySelectProps}
                value={existingItemName}
                onFocus={() => { setAddItemName(""); setItemNameNewFocus(false); }}
                onChange={ (event, i) => {
                  const { target: { id, value } } = event;
                  const ind = i.props.index;
                  setExistingItemName(value)
                  if (itemNames[ind] != null) {
                    setExistingDyeStaff(itemNames[ind].dyeStaff)
                    setExistingFabricConstruction(itemNames[ind].fabricConstruction)
                    setExistingFabricShrinkage(itemNames[ind].fabricShrinkage)
                    setExistingFabricYarnCount(itemNames[ind].fabricYarnCount)
                    setExistingFindings(itemNames[ind].findings)
                    setExistingGsm(itemNames[ind].gsm)
                    setExistingHsCode(itemNames[ind].hsCode)
                    setExistingProductStyle(itemNames[ind].productStyle)
                    setExistingProductType(itemNames[ind].productType)
                    setExistingPlainDyedType(itemNames[ind].plainDyedType)
                    setExistingSeason(itemNames[ind].season)
                    setExistingWeight(itemNames[ind].weight)
                    setExistingWidth(itemNames[ind].width)
                    setExistingColorFastness(itemNames[ind].colorFastness)
                    setExistingSeasonsId(itemNames[ind].seasonsId)
                    setExistingProductStyleId(itemNames[ind].productStyleId)
                    setExistingProductTypeId(itemNames[ind].productTypeId)
                    setExistingPlainDyedTypeId(itemNames[ind].plainDyedTypeId)
                    setExistingFinishingId(itemNames[ind].finishingId)
                  }
                  setItemNameNewFocus(false)
                  console.log( 'itemNames[ind]:' )
                  console.log( itemNames[ind] )
                  setComposition(itemNames[ind].composition)
                  setCompositionText(itemNames[ind].composition)//.map(a => a.value + '% ' + a.textileName))
                }}
                values={itemNames.map( e => e.itemName )}
                fontColor={ itemNameNewFocus==true ? '#ccc' : '#222' } >
                { itemNames && itemNames.map((it, index) => (
                    <MenuItem sx = {{}}
                        key={"mi_"+index} 
                        value={it.itemName}
                        data-index={index}
                        index={index}>
                          {it.itemName}
                    </MenuItem>
                ))}
              </StyledSelect>
              </FormControl>

            <Typography sx={{mt: "10px", mb: "0px"}}>or enter new name:</Typography>
             <StTextField
                margin="normal"
                size="small" 
                id="itemName"
                //label="New item name"
                name="itemName"
                sx={{ ...itemStyle, ...{ mt: 1}}}
                fontColor={ itemNameNewFocus==true ? '#222' : '#ccc' }
                value={addItemName}
                onChange={(ev) => {setAddItemName(ev.target.value); setExistingItemName(""); setItemNameNewFocus(true);}}
              />

              {/* <MyAutocomplete
                  title="Composition1"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle1}
                  MenuProps={MySelectProps}
                  valueVariable={textileType}
                  setValueFn={setTextileType}
                  //addNewFn={(e) => { setNewValueEntity("textile type"); setOpenedNewValue(true); }}
                  data={ textileTypes.map((e) => { return e.value }) }
                /> */}

                {/* <Autocomplete
                  size="small" 
                  disablePortal
                  options={textileTypes.map((e) => { return e.value })}
                  sx={{ ...itemStyle, ...{ mt: 1}}}
                  renderInput={(params) => <TextField {...params} label="Movie" />} /> */}

              <Typography sx={{mt: "10px", mb: "6px"}}>Design:</Typography>
                <TextField
                margin="normal"
                size="small" 
                id="design"
                //label="Design"
                name="design"
                sx = {itemStyle}
                value={addDesign}
                onChange={ev => setAddDesign(ev.target.value)} />
              <Box sx={{ 
                display: "flex",
                flexDirection: 'row', 
                alignItems: 'left' }}>
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Typography sx={{mt: "10px", mb: "6px"}}>Ref no:</Typography>
                  <TextField
                    margin="normal"
                    size="small" 
                    id="refNo"
                    //label="Ref No"
                    name="refNo"
                    value={addRefNo}
                    sx = {smallItemStyle}
                    onChange={ev => setAddRefNo(ev.target.value)} />
                  </Box>
                  <Box sx={{display: 'flex', flexDirection: 'column'}}>
                  <Typography sx={{mt: "10px", mb: "6px"}}>Art no:</Typography>
                  <TextField
                    margin="normal"
                    size="small" 
                    id="artNo"
                    //label="Art No"
                    name="artNo"
                    sx = {smallItemStyle}
                    value={addArtNo}
                    onChange={ev => setAddArtNo(ev.target.value)} />
                  </Box>
                  </Box>

                  { savingError && 
                    <Box sx={{ textAlign: "center", marginTop: 2, fontSize: "12pt", color: "red" }}>
                    An error has occurred. Please check that all fields are filled in correctly and completely and try saving again.
                    </Box> }

            </Box>
          { itemNameNewFocus==false && !!existingItemName && <Box sx={{ display: "flex", flexDirection: 'column', alignItems: 'left' }}>
            <Box sx={{ml: 3}}>
                        <Box sx={{display: "grid", gridTemplateColumns:"137px 10px 150px", rowGap: "8px"}}>
                        {!!existingProductType        && <><div>Product type       </div><div>:</div><div>{existingProductType} </div></>}
                        {!!existingProductStyle       && <><div>Product style      </div><div>:</div><div>{existingProductStyle} </div></>}
                        {!!existingPlainDyedType      && <><div>Product style      </div><div>:</div><div>{existingPlainDyedType} </div></>}
                        {!!existingWeight             && <><div>Weight             </div><div>:</div><div>{existingWeight} </div></>}
                        {!!existingWidth              && <><div>Width              </div><div>:</div><div>{existingWidth} </div></>}
                        {!!existingGsm                && <><div>Gsm                </div><div>:</div><div>{existingGsm} </div></>}
                        {!!existingSeason             && <><div>Season             </div><div>:</div><div>{existingSeason} </div></>}
                        {!!existingDyeStaff           && <><div>DyeStaff           </div><div>:</div><div>{existingDyeStaff} </div></>}
                        {!!existingFindings           && <><div>Finishing          </div><div>:</div><div>{existingFindings} </div></>}
                        {!!existingFabricConstruction && <><div>Fabric construction</div><div>:</div><div>{existingFabricConstruction} </div></>}
                        {!!existingFabricShrinkage    && <><div>Fabric shrinkage   </div><div>:</div><div>{existingFabricShrinkage} </div></>}
                        {!!existingFabricYarnCount    && <><div>Fabric yarn count  </div><div>:</div><div>{existingFabricYarnCount} </div></>}
                        {!!existingColorFastness      && <><div>Gsm                </div><div>:</div><div>{existingColorFastness} </div></>}
                        {!!existingHsCode             && <><div>Hs code            </div><div>:</div><div>{existingHsCode} </div></>}

                      {compositionText.map((c, index) => (  
                        <React.Fragment>
                        <div>{index==0 ? "Fabric composition" : ""}</div><div>{index==0 ? ":":""}</div><div>{c.value + "% " + c.textileName}</div>
                        </React.Fragment>
                        ))}
                   </Box>
            </Box>
          </Box> }
        </Box>

                  <Box sx={{ 
                    mt: "10px",
                    display: "flex",
                    flexDirection: 'row', 
                    justifyContent: 'center' }}>
                      <Button 
                          variant="contained"
                          style={buttonStyle}
                          sx={buttonStyle}
                          onClick={handleAddProductSave} >
                              Next
                      </Button>
                      <Button 
                          variant="contained"
                          sx={buttonStyle}
                          onClick={handleAddProductCancel} >
                              Cancel
                      </Button>
                  </Box>


        </Box>
        
      </Modal>

      <Container sx={{padding: 0 }} className="header-container" >
        <PageHeader user={props.user} title={props.title} />
        {/* <MainBanner user={props.user} title={props.title} /> */}
        <div>
        
          {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography> */}

          

          <Box component="form" noValidate style={outboxStyle}>

          <Box style={headStyle} sx={{ display: "flex", justifyContent:"left", margin: "0", alignItems: "center" }}  >
            <Tooltip title="Rows interface">
            <IconButton onClick={ (e) => { setView("rows")} } style={toolButtonStyle} sx={{mr: 0}} >
              <TableRowsIcon sx={{color: view=="grid" ? APPEARANCE.BLACK : APPEARANCE.GREY }} />
            </IconButton>
            </Tooltip>
            <Tooltip title="Grid interface">
            <IconButton onClick={ (e) => { setView("grid")} } style={toolButtonStyle} sx={{mr: 1}} >
              <GridViewIcon sx={{color: view=="grid" ? APPEARANCE.GREY : APPEARANCE.BLACK }} />
            </IconButton>
            </Tooltip>
            {/* <Box sx={{ display: "flex", alignItems:"center", justifyContent: "center", width: "100%", mt: 2, mb: 2}}>
            <Typography component="h7" variant="h7" color={APPEARANCE.COLOR1} sx={{fontWeight: "bold"}} >
              {props.user && ( "Products") } 
            </Typography>
            </Box> */}
          <Box style={findBoxStyle}>
          <TextField
                margin="normal"
                size="small" 
                id="search-value"
                label="Find products"
                name="search"
                style = {findTextStyle}
                sx={{borderRadius: "0"}}
                value={search}
                onChange={ev => searchProducts(ev.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
          </Box>

            <Tooltip title="Filters">
            <IconButton onClick={handleShowHideFilter} style={toolButtonStyle} sx={{mr: 1, ml: 1}} >
              <TuneIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
            </Tooltip>

            <Button
              variant="text"
               startIcon={<AddCircleOutlineIcon sx={{color: APPEARANCE.BLACK}} />}
               sx={{ backgroundColor: "#fff", color: APPEARANCE.BLACK, textTransform: "none", width: "180px", height: "26px", marginTop: "5px" }}
               onClick={handleAddProductShow}>
               Add product
            </Button>


            <Box>
            <label htmlFor={"icon-button-file-prod"}>
                          <Input accept=".xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" id={"icon-button-file-prod"} type="file" onChange={handleImport} />
                          <Link aria-label="Load your products from Excel file" sx={{display: "block", width: "130px", backgroundColor: "#fff", color: "#222", fontSize: "12px", cursor: "pointer"}} >
                            <Box sx={{display: "flex", marginTop: "7px", alignItems: "center"}}>
                                <div><UploadFileIcon sx={{ml: 0, mr: "5px"}} /></div>
                                <div style={{ml: 0, pl: 0, paddingBottom:"2px"}}>Load from file</div>
                            </Box>
                          </Link>
                        </label>
            </Box>
            {/* <Button
              variant="text"
               startIcon={<UploadFileIcon sx={{color: APPEARANCE.BLACK}} />}
               sx={{ backgroundColor: "#fff", color: APPEARANCE.BLACK, textTransform: "none", width: "190px", height: "26px", marginTop: "5px" }}
               onClick={handleAddProductShow}>
               Load from file
            </Button> */}

            {/* <Tooltip title="Add a new product">
            <IconButton onClick={handleAddProductShow} style={toolButtonStyle} sx={{mr: 1}} >
              <AddCircleOutlineIcon  sx={{color: APPEARANCE.BLACK}} />
            </IconButton>
            </Tooltip> */}

          </Box>


          <Box sx={{ backgroundColor: "none", display: filter==true? "block": "none", textAlign: "center", mt: 3, mb: 3  }} className="filter" >
          <Box className="filter" sx={{ textAlign: "left"}} >
          <Typography component="p" variant="p" sx={{ mb: 2, fontSize: "10pt", fontWeight: "bold"}} >
              Product's filters
            </Typography>
            <Grid container spacing={1} >
            <Grid item xs={12} md={6} sx={{...flexStyle}} >
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
              </Grid>
            <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="refNo"
                label="Ref No"
                name="refNo"
                sx = {itemStyle}
                value={refNo}
                onChange={ev => setRefNo(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
            <TextField
                margin="normal"
                size="small" 
                id="artNo"
                label="Art No"
                name="artNo"
                sx = {itemStyle}
                value={artNo}
                onChange={ev => setArtNo(ev.target.value)}
              />
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
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
              </Grid>
              <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-producttype"
                  url="ProductTypes"
                  title="Product Type"
                  valueName="typeName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={productType}
                  setValue={setProductType}
                  values={productTypes}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Product Style"
                  valueName="styleName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={productStyle}
                  setValue={setProductStyle}
                  values={productStyles}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-season"
                  url="Seasons"
                  title="Season"
                  valueName="seasonName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={season}
                  setValue={setSeason}
                  values={seasons}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-color"
                  url="Colors"
                  title="Color"
                  valueName="colorName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={color}
                  setValue={setColor}
                  values={colors}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >  
                <MySelect 
                  id="addproduct-designtype"
                  url="DesignTypes"
                  title="Design type"
                  valueName="designName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={designType}
                  setValue={setDesignType}
                  values={designTypes}
                />
                </Grid>

                <Grid item xs={12} md={6} sx={{...flexStyle}} >
                <MySelect 
                  id="addproduct-overworktype"
                  url="OverWorkTypes"
                  title="Overwork type"
                  valueName="overWorkName"
                  labelStyle={labelStyle1}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  value={overworkType}
                  setValue={setOverworkType}
                  values={overworkTypes}
                />
                </Grid>

              </Grid>

          </Box>
                <Button variant="contained" className="action-button" onClick={loadProducts} >
                  Apply
                </Button>
                <Button variant="outlined" className="clear-button" onClick={clearFilter} sx={{ml:2}} >
                  Clear
                </Button>
          </Box>

          {/* <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto", mt: 2}} justifyContent={"center"} className="header-menu" > */}
          <Grid container spacing={2} >
            { view === "grid" && products.map((data, index) => (
            <Grid item xs={12} md={6} key={"itemprod-"+index} >
              <ItemProduct data={data} index={index} />
              </Grid>
            ))}
            { view === "rows" && products.map((data, index) => (
            <Grid item xs={12} md={12} key={"itemprod-"+index} >
              <ItemProductRow data={data} index={index} />
              </Grid>
            ))}
          </Grid>

          
          </Box>
        </div>
        <Footer/>
         </Container>
              
    </ThemeProvider>
  );
}
