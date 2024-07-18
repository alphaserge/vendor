import React, { useState, useEffect } from "react";
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

import axios from 'axios'

import { v4 as uuid } from 'uuid'

import MySelect from '../../components/myselect';
import ColorVariant from './colorvariant';
import ProductColor from './productcolor';
import config from "../../config.json"
import { getColors } from '../../api/colors'
import { getSeasons } from '../../api/seasons'
import { getDesignTypes } from '../../api/designtypes'
import { getOverworkTypes } from '../../api/overworktypes'
import { getProductTypes } from '../../api/producttypes'
import { getProductStyles } from '../../api/productstyles'

import Header from './header';
import Footer from './footer';

import { APPEARANCE } from '../../appearance';

import Modal from '@mui/material/Modal';
import { InputLabel } from "@mui/material";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }
const selectStyle = { width: 290, m: 2, ml: 4, mr: 4 }
const labelStyle = { m: 2, ml: 4, mr: 4 }
const buttonStyle = { width: 100, m: 2, backgroundColor: APPEARANCE.BLUE1, color: APPEARANCE.WHITE }

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

function getStyles(name, personName, theme) {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}
export default function AddProduct(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [productStyle, setProductStyle] = useState("")
    const [productType, setProductType] = useState("")
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [itemName, setItemName] = useState("")
    const [refNo, setRefNo] = useState("")
    const [artNo, setArtNo] = useState("")
    const [uid, setUid] = useState(uuid())
    const [design, setDesign] = useState("")
    const [price, setPrice] = useState("")
    const [weight, setWeight] = useState("")
    const [width, setWidth] = useState("")
    const [newColor, setNewColor] = useState("")
    const [newColorRgb, setNewColorRgb] = useState("")

    const [colors, setColors] = useState([])
    const [seasons, setSeasons] = useState([])
    const [designTypes, setDesignTypes] = useState([])
    const [overworkTypes, setOverworkTypes] = useState([])
    const [productTypes, setProductTypes] = useState([])
    const [productStyles, setProductStyles] = useState([])

    const [colorVariant, setColorVariant] = useState([
      {
        Id: uuid(),
        No: 1,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 2,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 3,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 4,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 5,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
      {
        Id: uuid(),
        No: 6,
        ColorNo: null,
        ColorIds: [],
        ColorId: [],
        SelectedFile: null,
      },
    ])

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
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
  
  const postFile = async (cv, id) => {
    const formData = new FormData();
    formData.append("formFile", cv.SelectedFile);
    formData.append("uid", cv.Id);
    formData.append("id", id);
    try {
      const res = await axios.post(config.api + "/Products/ImportFile", formData);
    } catch (ex) {
      console.log(ex);
    }
  };

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

  const postProduct = async (e) => {

    // let cv = colorVariant.map(function(item) { 
    //   delete item.SelectedFile; 
    //   delete item.No;
    //   delete item.ColorId;
    //   return item; 
    // });

    let cv = colorVariant.filter(item => !!item.ColorNo && item.ColorIds.length > 0 && !!item.SelectedFile)
    let ac = allColor.filter(item => !!item.No && !!item.SelectedFile).map((e) => e.Id).join(',')

    fetch(config.api + '/Products/ProductAdd', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        ItemName: itemName,
        RefNo: refNo,
        ArtNo: artNo,
        Design: design,
         //ColorNo: colorNo,
        Price: Number(price),
        Weight: Number(weight),
        Width: Number(width),
        ProductStyleId: Number(productStyle),
        ProductTypeId: Number(productType),
        VendorId: 1, //!!props.user ? props.user.vendorId : null,
        Uuid: uid,
        PhotoUuids: ac,
        //Colors: color,
        ColorVariants: cv, 
        Seasons: season,
        DesignTypes: designType,
        OverWorkTypes: overworkType,
      })
  })
  .then(r => r.json())
  .then(r => {
    let cvs1 = colorVariant.filter(e=>!!e.ColorNo)
    let cvs2 = colorVariant.filter(e=>e.ColorNo!=null)
    let cvs3 = colorVariant.filter(function(e) { return e.ColorNo!=null})

    colorVariant.filter(e=>!!e.ColorNo).forEach(cv => {
      if (!!cv.SelectedFile) {
        postFile(cv);
      }    
    });
    allColor.filter(e=>!!e.SelectedFile).forEach(cv => {
        postFile(cv, r.id);
    });
    
    props.setLastAction("Product has been added")
    navigate("/menu")
})
  .catch (error => {
    console.log(error)
    //navigate("/error")
  })

};

const postColor = async (e) => {

  const matched = newColorRgb.match("^(([0-9a-fA-F]{2}){3}|([0-9a-fA-F]){3})$")

  if (!matched || newColorRgb.length != 6 ) {
    setErrorNewColor("Incorrect RGB value.\n Should be as example: FA240C, DD34CC")
    return
  }

  fetch(config.api + '/Colors', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      colorName: newColor,
      rgb: newColorRgb,
    })
})
//.then(r => r.json())
.then(r => {
  if (r.ok==true) {
    props.setLastAction("Color has been added")
    handleClose()
  } else {
    setErrorNewColor("An error has occurred")
  }
})
.catch (error => {
  console.log(error)
  setErrorNewColor("An error has occurred")
})

};

const [errorNewColor, setErrorNewColor] = React.useState("");
const [openNewColor, setOpenNewColor] = React.useState(false);
const handleOpen = () => { setErrorNewColor(""); setOpenNewColor(true); }
const handleClose = () => setOpenNewColor(false);

const addNewColor = () => {
  handleOpen();
}

useEffect(() => {
  getColors(setColors)
  getSeasons(setSeasons)
  getDesignTypes(setDesignTypes)
  getOverworkTypes(setOverworkTypes)
  getProductTypes(setProductTypes)
  getProductStyles(setProductStyles)
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
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Adding a new color
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', flex: 3 }}>
          <TextField
                  margin="normal"
                  size="small" 
                  id="newColor"
                  label="Color name"
                  name="newColor"
                  value={newColor}
                  onChange={ev => setNewColor(ev.target.value)}
                />
            <TextField
                  margin="normal"
                  size="small" 
                  id="newColor"
                  label="Color value : RRGGBB"
                  name="newColorRgb"
                  value={newColorRgb}
                  onChange={ev => setNewColorRgb(ev.target.value)}
                />
                <InputLabel
                component={"div"}
                  shrink={true}
                  sx={{ wordBreak: "break-word", whiteSpace: "pre-line" }} >
                    {errorNewColor}
                  </InputLabel>
          </Box>
          <Box sx={{flex: 2}} >
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{margin: "5px 10px 5px 30px", height: 50}}
              onClick={postColor} >
                  Save
          </Button>
          <Button 
              variant="contained"
              style={buttonStyle}
              sx={{margin: "5px 10px 5px 30px", height: 50}}
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
        {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar> */}
          <Box sx={{ border: "1px solid #ddd", padding: "20px 10px", textAlign: "center", maxWidth: 900}} justifyContent={"center"} alignItems={"center"}>
            
          <Typography component="h1" variant="h6" color={APPEARANCE.COLOR1}>
            Adding a product form
          </Typography>
          <Typography component="p" variant="subtitle1" sx={{mb:2}}  color={APPEARANCE.COLOR1}>
          Please fill out all fields and click the Save button
          </Typography>
          

          {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
          <Grid item xs={12} md={6} sx={{textAlign:"center", margin: "0 auto" }} justifyContent={"center"} className="header-menu"  >
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
                id="refNo"
                label="Ref No"
                name="refNo"
                sx = {itemStyle}
                value={refNo}
                onChange={ev => setRefNo(ev.target.value)}
              />
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
            <TextField
                margin="normal"
                size="small" 
                id="price"
                label="Price"
                name="price"
                sx = {itemStyle}
                value={price}
                onChange={ev => setPrice(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="weight"
                label="Weight"
                name="weight"
                sx = {itemStyle}
                value={weight}
                onChange={ev => setWeight(ev.target.value)}
              />
            <TextField
                margin="normal"
                size="small" 
                id="width"
                label="Width"
                name="width"
                sx = {itemStyle}
                value={width}
                onChange={ev => setWidth(ev.target.value)}
              />

                <MySelect 
                  id="addproduct-producttype"
                  url="ProductTypes"
                  title="Product Type"
                  valueName="typeName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={productType}
                  setValueFn={setProductType}
                  data={productTypes}
                />

                <MySelect 
                  id="addproduct-productstyle"
                  url="ProductStyles"
                  title="Product Style"
                  valueName="styleName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
                  valueVariable={productStyle}
                  setValueFn={setProductStyle}
                  data={productStyles}
                />

                <MySelect 
                  id="addproduct-season"
                  url="Seasons"
                  title="Season"
                  valueName="seasonName"
                  labelStyle={labelStyle}
                  itemStyle={itemStyle}
                  MenuProps={MenuProps}
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
                  MenuProps={MenuProps}
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
                  MenuProps={MenuProps}
                  valueVariable={overworkType}
                  setValueFn={setOverworkType}
                  data={overworkTypes}
                />

                { allColor.map((cv) => (
                    <ProductColor cv={cv} setColorItem={setColorProduct}  />
                 ))}

                { colorVariant.map((cv) => (
                    <ColorVariant cv={cv} setColorItem={setColorVariantItem} addNewFn={addNewColor} data={colors} />
                 ))}
<br/>
<br/>
                {/* <FormControl sx = {{itemStyle}} > */}
                <Box sx={{ textAlign: "center", marginTop: 2 }}>
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={postProduct} >
                        Save
                    </Button>
                    <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={morePhotos} >
                        add photos
                    </Button>
                    <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 10px", height: 70}}
                    onClick={moreVariants} >
                        Add colors
                    </Button>
                    </Box>
                {/* </FormControl> */}

          </Grid>
          {/* </Box> */}
          </Box>
        </main>
      </Container>
      <Footer sx={{ mt: 2, mb: 2 }} />
    </ThemeProvider>
  );
}
