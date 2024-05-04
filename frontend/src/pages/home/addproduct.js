import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { createTheme, ThemeProvider } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import FormHelperText from '@mui/material/FormHelperText';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import Fab from '@mui/material/Fab';

import axios from 'axios'

//import randomUUID from 'crypto';

import { v4 as uuid } from 'uuid'

import Copyright from '../copyright';
import config from "../../config.json"

import Header from './header';
import Footer from './blog/Footer';

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme()
const itemStyle = { width: 400, m: 2 }
const labelStyle = { m: 2 }
const buttonStyle = { width: 180, m: 2 }

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

    const [productStyleList, setProductStyleList] = useState([])
    const [productStyle, setProductStyle] = useState("")
    const [productTypeList, setProductTypeList] = useState([])
    const [productType, setProductType] = useState("")
    const [colorList, setColorList] = useState([])
    const [color, setColor] = useState([])
    const [designTypeList, setDesignTypeList] = useState([])
    const [designType, setDesignType] = useState([])
    const [overworkTypeList, setOverworkTypeList] = useState([])
    const [overworkType, setOverworkType] = useState([])
    const [seasonList, setSeasonList] = useState([])
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

    const [selectedFile, setSelectedFile] = useState(null)
    
  
    // #region handlers; 
    const colorChangeNotUsed = (event) => {
      setColor(event.target.value)
    };
  
    const colorChange = (event) => {
      const { target: { value }, } = event;
      setColor( typeof value === 'string' ? value.split(',') : value );// On autofill we get a stringified value.
    };

    const colorsData = () => {
      axios.get(config.api + '/Colors')
      .then(function (res) {
        try {
          var result = res.data;
          setColorList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

    const designTypeChange = (event) => {
      const { target: { value }, } = event;
      setDesignType( typeof value === 'string' ? value.split(',') : value );// On autofill we get a stringified value.
    };

    const designTypesData = () => {
      axios.get(config.api + '/DesignTypes')
      .then(function (res) {
        try {
          var result = res.data;
          setDesignTypeList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

    const overworkTypeChange = (event) => {
      const { target: { value }, } = event;
      setOverworkType( typeof value === 'string' ? value.split(',') : value );// On autofill we get a stringified value.
    };

    const overworkTypesData = () => {
      axios.get(config.api + '/OverWorkTypes')
      .then(function (res) {
        try {
          var result = res.data;
          setOverworkTypeList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }          

    const seasonChange = (event) => {
      const { target: { value }, } = event;
      setSeason( typeof value === 'string' ? value.split(',') : value );// On autofill we get a stringified value.
    };

    const seasonsData = () => {
      axios.get(config.api + '/Seasons'
      /*,{
        headers: {
          'Access-Control-Allow-Origin' : '*',
          'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS'
        }
      }*/)
      .then(function (res) {
        try {
          var result = res.data;
          setSeasonList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

    const onButtonClick = () => {
        if (props.loggedIn) {
            localStorage.removeItem("user")
            props.setLoggedIn(false)
        } else {
            navigate("/login")
        }
    }

    const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      console.log({
        email: data.get('email'),
        password: data.get('password'),
      });
    };
  
    const productStyleChange = (event) => {
      setProductStyle(event.target.value)
    };
  
    const productStylesData = () => {
      axios.get(config.api + '/ProductStyles')
      .then(function (res) {
        try {
          var result = res.data;
          setProductStyleList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

    const productTypeChange = (event) => {
      setProductType(event.target.value)
    };
  
    const productTypesData = () => {
      axios.get(config.api + '/ProductTypes')
      .then(function (res) {
        try {
          var result = res.data;
          setProductTypeList(result)
        }
       catch (error) {
          console.log(error)
        }
      })
      .catch (error => {
        console.log(error)
      })
    }      

  // On file select (from the pop up)
  const onFileChange = (event) => {
      // Update the state
      setSelectedFile(event.target.files[0])
  }
  
  const importFile = async (e) => {
    const formData = new FormData();
    formData.append("formFile", selectedFile);
    formData.append("uid", uid);
    //console.log(config.api + "/Importfile");
    try {
      const res = await axios.post(config.api + "/Products/ImportFile", formData);
    } catch (ex) {
      console.log(ex);
    }
  };

  const postProduct = async (e) => {
    console.log(config.api + '/Products')

    fetch(config.api + '/Products', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        itemName: itemName,
        refNo: refNo,
        artNo: artNo,
        design: design,
        colorNo: colorNo,
        //colorName: colorName,
        price: Number(price),
        weight: Number(weight),
        width: Number(width),
        productStyleId: Number(productStyle),
        productTypeId: Number(productType),
        vendorId: 1,
        //vendor: vendorId,
        //productStyle: productStyle,
        //productType: productType,
        uuid: uid,
        colors: color,
        seasons: season,
        designTypes: designType,
        overWorkTypes: overworkType,
        })
  })
  .then(r => r.json())
  .then(r => {
    console.log(r);
    importFile();
    props.setLastAction("Product has been added")
    navigate("/menu")
})
  .catch (error => {
    console.log(error)
    //navigate("/error")
  })
return;
    const res = await axios.post(config.api + '/Products', {
      itemName: itemName,
      refNo: refNo,
      artNo: artNo,
      design: design,
      colorNo: colorNo,
      //colorName: colorName,
      price: Number(price),
      weight: Number(weight),
      width: Number(width),
      productStyleId: Number(productStyle),
      productTypeId: Number(productType),
      vendorId: 1,
      //vendor: vendorId,
      //productStyle: productStyle,
      //productType: productType,
      uuid: uid,
      colors: color,
      seasons: season,
      designTypes: designType,
      overWorkTypes: overworkType,
    })
    .then(function (response) {
      console.log(response);
      importFile();
    })
    .catch(function (error) {
      console.log(error);
    });
  };

  // On file upload (click the upload button)
  const onFileUpload = () => {
      // Create an object of formData
      const formData = new FormData();

      // Update the formData object
      formData.append(
          "file",
          selectedFile,
          selectedFile.name
      );

      // Details of the uploaded file
      console.log(selectedFile);

      // Request made to the backend api
      // Send formData object
      axios.post("api/uploadfile", formData);
  };

  // File content to be displayed after
  // file upload is complete
  const fileData = () => {
      if (selectedFile) {
          return (
              <div>
                  <h2>File Details:</h2>
                  <p>
                      File Name:{" "}
                      {selectedFile.name}
                  </p>

                  <p>
                      File Type:{" "}
                      {selectedFile.type}
                  </p>

                  <p>
                      Last Modified:{" "}
                      {selectedFile.lastModifiedDate.toDateString()}
                  </p>
              </div>
          );
      } else {
          return (
              <div>
                  <br />
                  <h4>
                      Choose before Pressing the Upload
                      button
                  </h4>
              </div>
          );
      }
  };


// #endregion

    useEffect(() => {
      productStylesData()
      productTypesData()
      colorsData()
      seasonsData()
      overworkTypesData()
      designTypesData()
    }, []);

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Container maxWidth="lg">
        <Header title="Blog" />
        <main>
        <Avatar sx={{ mb: 2, bgcolor: 'secondary.main' }}>
            <AddCircleIcon />
          </Avatar>
          <Typography component="h1" variant="h5" sx={{mb:2}}>
            Add product
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Grid item xs={12} md={6} sx={{textAlign:"center"}} justifyContent={"center"} >
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
            <TextField
                margin="normal"
                size="small" 
                id="colorNo"
                label="Color No"
                name="colorNo"
                sx = {itemStyle}
                value={colorNo}
                onChange={ev => setColorNo(ev.target.value)}
              />
              <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label"
                  size="small" 
                  sx={labelStyle} >
                  Product type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  size="small" 
                  value={productType}
                  label="Product style"
                  //variant="outlined"
                  sx = {itemStyle}
                  onChange={productTypeChange}>
                   { productTypeList.map((data) => (
                     <MenuItem key={data.id} value={data.id}>{data.typeName}</MenuItem>
                 ))}
                </Select>
                </FormControl>
                {/* <FormHelperText>{companyError}</FormHelperText> */}
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label2"
                  size="small" 
                  sx={labelStyle} >
                  Product style
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label2"
                  id="demo-simple-select2"
                  size="small" 
                  value={productStyle}
                  label="Product style"
                  //variant="outlined"
                  sx = {itemStyle}
                  onChange={productStyleChange}>
                   { productStyleList.map((data) => (
                     <MenuItem key={data.id} value={data.id}>{data.styleName}</MenuItem>
                 ))}
                </Select>
                </FormControl>
                {/* <FormHelperText>{companyError}</FormHelperText> */}
                {/* <TextField id="outlined-basic" label="Outlined" variant="outlined" /> */}

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label3"
                  size="small" 
                  sx={labelStyle} >
                  Color
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label3"
                  id="demo-simple-select3"
                  size="small" 
                  label="Color"
                  //variant="outlined"
                  multiple
                  value={color}
                  sx = {itemStyle}
                  onChange={colorChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                  >
                   { colorList.map((data) => (
                     <MenuItem 
                        key={data.id} 
                        value={data.id}
                        style={getStyles(data.colorName, color, theme)}>
                          <Box component="span" className="color_select_item" sx={{ backgroundColor: "#" + data.rgb, border: "1px solid #bbb", height: "24px", width: "24px",  mr: 2 }}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Box>{data.colorName} 
                          {/* {data.colorName} */}
                          </MenuItem>
                 ))}
                </Select>
                </FormControl>

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label4"
                  size="small" 
                  sx={labelStyle} >
                  Season
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label4"
                  id="demo-simple-select4"
                  size="small" 
                  label="Season"
                  //variant="outlined"
                  multiple
                  value={season}
                  sx = {itemStyle}
                  onChange={seasonChange}
                  input={<OutlinedInput label="Name" />}
                  MenuProps={MenuProps}
                  >
                   { seasonList.map((data) => (
                     <MenuItem 
                        key={data.id} 
                        value={data.id}
                        style={getStyles(data.seasonName, season, theme)}>
                          {data.seasonName}
                          </MenuItem>
                 ))}
                </Select>
                </FormControl>

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label5"
                  size="small" 
                  sx={labelStyle} >
                  Design type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label5"
                  id="demo-simple-select5"
                  size="small" 
                  label="Design type"
                  //variant="outlined"
                  multiple
                  value={designType}
                  sx = {itemStyle}
                  onChange={designTypeChange}
                  input={<OutlinedInput label="Design type" />}
                  MenuProps={MenuProps}
                  >
                   { designTypeList.map((data) => (
                     <MenuItem 
                        key={data.id} 
                        value={data.id}
                        style={getStyles(data.designName, designType, theme)}>
                          {data.designName}
                          </MenuItem>
                 ))}
                </Select>
                </FormControl>

                <FormControl  error={ false } required > 
                <InputLabel 
                  id="demo-simple-select-label6"
                  size="small" 
                  sx={labelStyle} >
                  Overwork type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label6"
                  id="demo-simple-select6"
                  size="small" 
                  label="Overwork type"
                  variant="outlined"
                  multiple
                  value={overworkType}
                  sx = {itemStyle}
                  onChange={overworkTypeChange}
                  input={<OutlinedInput label="Overwork type" />}
                  MenuProps={MenuProps}
                  >
                   { overworkTypeList.map((data) => (
                     <MenuItem 
                        key={data.id} 
                        value={data.id}
                        style={getStyles(data.overWorkName, overworkType, theme)}>
                          {data.overWorkName}
                          </MenuItem>
                 ))}
                </Select>
                </FormControl>
<br/>
<br/>
                {/* <FormControl sx = {{width: 400, m: 2 }}  > */}
                <div style={{  textAlign: "center" }}>
                  <div style={{ margin: "0 auto" }}>
                <Button
                  variant="outlined"
                  component="label"
                  style={buttonStyle}
                  >
                  { selectedFile ?  "Photo is selected" : "Select Photo"}
                  <input
                    type="file"
                    onChange={onFileChange}
                    hidden
                  />
                </Button>

                {/* <Box sx={{display:"inline", m: 1}}>{ selectedFile ? "File: "+ selectedFile.name : "File: "}</Box> */}
                {/* </FormControl> */}
                </div>
                </div>
<br/>
                {/* <FormControl sx = {{itemStyle}} > */}
                <div style={{  textAlign: "center" }}>
                  <Button 
                    variant="contained"
                    style={buttonStyle}
                    sx={{margin: "0 auto"}}
                    onClick={postProduct} >
                        Save
                    </Button>
                    </div>
                {/* </FormControl> */}

          </Grid>
          </Box>
        </main>
      </Container>
      <Footer
        title="Footer"
        description="Something here to give the footer a purpose!"
      />
    </ThemeProvider>
  );
}
