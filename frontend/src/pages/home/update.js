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
import { useSearchParams } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios'

import { v4 as uuid } from 'uuid'

import MySelect from '../../components/myselect';
import ColorVariant from './colorvariant';
import Copyright from '../copyright';
import config from "../../config.json"

import Header from './header';
import Footer from './footer';

import { APPEARANCE } from '../../appearance';
import zIndex from "@mui/material/styles/zIndex";

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 340, m: 2, ml: 4, mr: 4 }
const selectStyle = { width: 290, m: 2, ml: 4, mr: 4 }
const labelStyle = { m: 2, ml: 4, mr: 4 }
const buttonStyle = { width: 90, m: 2, backgroundColor: APPEARANCE.GREEN2, color: APPEARANCE.WHITE }

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
export default function Update(props) {

    const navigate = useNavigate();
    const theme = useTheme();

    const [productStyle, setProductStyle] = useState("")
    const [productType, setProductType] = useState("")
    const [color, setColor] = useState([])
    const [designType, setDesignType] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [season, setSeason] = useState([])
    const [itemName, setItemName] = useState("")
    const [refNo, setRefNo] = useState("")
    const [artNo, setArtNo] = useState("")
    const [uid, setUid] = useState(uuid())
    const [design, setDesign] = useState("")
    const [colorNo, setColorNo] = useState("")
    const [price, setPrice] = useState("")
    const [weight, setWeight] = useState("")
    const [width, setWidth] = useState("")
    const [colorVariant, setColorVariant] = useState([])
    const [images, setImages] = useState([])
    const [colors, setColors] = useState([])

    const setColorVariantItem = (i, item) => {
      let cv = colorVariant.map(el=>el.Id==i? item:el)
      setColorVariant(cv)
    }

    const [selectedFile, setSelectedFile] = useState(null)
  
    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
  
  const onFileChange = (event) => {
      setSelectedFile(event.target.files[0])
  }

  const postFile = async (cv) => {
    const formData = new FormData();
    formData.append("formFile", cv.SelectedFile);
    formData.append("uid", cv.Id);
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
    while (i<num+7){
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

  const postProduct = async (e) => {

    // let cv = colorVariant.map(function(item) { 
    //   delete item.SelectedFile; 
    //   delete item.No;
    //   delete item.ColorId;
    //   return item; 
    // });

    let cv = colorVariant.filter(item => !!item.ColorNo && item.ColorIds.length > 0 && !!item.SelectedFile)

    fetch(config.api + '/Products', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        ItemName: itemName,
        RefNo: refNo,
        ArtNo: artNo,
        Design: design,
        Price: Number(price),
        Weight: Number(weight),
        Width: Number(width),
        ProductStyleId: Number(productStyle),
        ProductTypeId: Number(productType),
        VendorId: 1, //!!props.user ? props.user.vendorId : null,
        Uuid: uid,
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
    
    props.setLastAction("Product has been added")
    navigate("/menu")
})
  .catch (error => {
    console.log(error)
    //navigate("/error")
  })
};

const loadProducts = async (e) => {

  const search = window.location.search;
  const params = new URLSearchParams(search);
  const id = params.get('id');

  axios.get(config.api + '/Products/Product?='+id, { params: { id: id }})
  .then(function (res) {
      setItemName(res.data.itemName)
      setArtNo(res.data.artNo)
      setRefNo(res.data.refNo)
      setDesign(res.data.design)
      setPrice(res.data.design)
      setWidth(res.data.width)
      setWeight(res.data.weight)
      setProductStyle(res.data.productStyle)
      setProductType(res.data.productType)
      setSeason(res.data.seasonIds)
      setOverworkType(res.data.overWorkTypeIds)
      setDesignType(res.data.designTypeIds)
      setImages(res.data.imagePaths)
      setColors(res.data.colors)

      console.log(res.data.colors)
  })
  .catch (error => {
    console.log(error)
  })
}      

    useEffect(() => {

      loadProducts()



    }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container sx={{maxWidth: "100%", padding: 0 }} className="header-container" >  {/* justifyContent={"center"} alignItems={"center"} */}
        <Header user={props.user} title={props.title} />
        <Box sx={{textAlign: "center", alignItems: "center", justifyContent: "center", display: "flex", mb: 3 }}>
        <Box sx={{ border: "1px solid #ddd", padding: "20px 10px", maxWidth: 900}} >
        <main>
        {/* <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar> */}
          <Box sx={{textAlign: "center", maxWidth: 900}} >
            
          <EditIcon sx={{ mr: 1, display: "inline"}} />
          <Typography component="span" variant="h6" color={APPEARANCE.COLOR1} >
            Change a product
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
                />
                { colorVariant.map((cv) => (
                    <ColorVariant cv={cv} setColorItem={setColorVariantItem}  />
                 ))}
          </Grid>
          </Box>
        </main>
        <Box component={"div"} display={"flex"} justifyContent={"left"} alignItems={"left"} 
          marginBottom={3} marginLeft={6} marginRight={6} 
          paddingBottom={1} sx={{ backgroundColor: "#ddd" }} >
            {images.map((image, index) => {
              return <Box className="product-img-holder-item">
                <Box className="product-img-holder-thumb" >
                <Box 
                  component={"img"} 
                  key={index} 
                  src={"https://localhost:3080/"+image} 
                  alt={"photo"+(index+1)} 
                  className="product-img" />
                  <br/>
                  </Box>
                  <Box component={"div"} sx={{ mt: 1, backgroundColor: "#fff", ml: 1 }} textAlign={"center"} fontSize={"12px"} > { index<colors.length+1 && colors[index]}</Box>

              </Box>
            })}
        </Box>
        <Box component={"div"} display={"flex"} justifyContent={"center"} alignItems={"center"} paddingBottom={3}>
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
                    onClick={moreVariants} >
                        More colors
                    </Button>
                    </Box>

        </Box>
        </Box>
      </Container>
      <Footer sx={{ mt: 2, mb: 2 }} />
    </ThemeProvider>
  );
}
