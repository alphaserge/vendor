import axios from 'axios'
import config from "../config.json"

const getInt = (value) => {
  if (value) {
    return parseInt(value)
  } else {
    return null
  }
}

const getFloat = (value) => {
  if (value) {
    return parseFloat(value)
  } else {
    return null
  }
}

const getDecimal = (value) => {
  if (value) {
    return Math.round(parseFloat(value) * 100)/100 
  } else {
    return null
  }
}

const makeProduct = (prod)  => {

  let p = {
    ItemName: prod.itemName,
    ArtNo: prod.artNo,
    ColorFastness: getInt(prod.colorFastness) ,
    Design: prod.design,
    FabricConstruction: prod.fabricConstruction,
    FabricShrinkage: getInt(prod.fabricShrinkage),
    FabricYarnCount: prod.fabricYarnCount,
    Findings: prod.findings,
    GSM: prod.gsm ? getInt(prod.gsm) : null,
    HSCode: prod.hsCode,
    MetersInKg: getDecimal(prod.metersInKg),
    Price: getDecimal(prod.price),
    RefNo: prod.refNo,
    Weight: getInt(prod.weight),
    Width: getInt(prod.width),
    Uuid: prod.uid,

    DesignTypes: prod.designType,
    OverWorkTypes: prod.overworkType,
    Seasons: prod.season,

    ProductStyleId: prod.productStyle,
    ProductTypeId: prod.productType,
    DyeStaffId: prod.dyeStaff,
    PlainDyedTypeId: prod.plainDyedType,
    PrintTypeId: prod.printType,
    VendorId: prod.vendorId,

    ColorVariants: prod.colorVariants, 
  }

  return JSON.stringify(p)
}

export const postProduct = async (prod, action) => {

  //let cv = prod.colorVariant.filter(item => !!item.ColorNo && item.ColorIds.length > 0 && !!item.SelectedFile)
  //let ac = allColor.filter(item => !!item.No && !!item.SelectedFile).map((e) => e.Id).join(',')
  let product = makeProduct(prod)

  let rc = await fetch(config.api + '/Products/' + action, {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: product
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    prod.colorVariants.forEach(cv => {  // !!ColorNo
      postFile(cv)
    });

    prod.globalPhotos.forEach(cv => { //filter(e=>!!e.SelectedFile)  .map((e) => e.Id).join(',')
      postFile(cv, r.id)
    });

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const postFile = async (colorVariant, prodId) => {
  const formData = new FormData();
  formData.append("formFile", colorVariant.SelectedFile);
  formData.append("uid", colorVariant.Id);
  formData.append("id", prodId);
  try {
    const res = await axios.post(config.api + "/Products/ImportFile", formData);
  } catch (ex) {
    console.log(ex);
  }
};

export const loadProduct = async (id, setFn) => {

  //let rc = await axios.get(config.api + '/Products/Product?='+id, { params: { id: id }})
  const rc = await fetch(config.api + '/Products/Product?id='+id, {
    //params: { id: id },
    method: "GET",
    headers: {
        'Content-Type': 'application/json'
      },
    })
  .then(r => r.json())
  .then(res => {
      setFn(res)
      })
  .catch (error => {
    console.log(error)
  })

}

