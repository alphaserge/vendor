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
    Id: prod.id,
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
    Stock: getDecimal(prod.stock),
    RefNo: prod.refNo,
    Weight: getInt(prod.weight),
    Width: getInt(prod.width),
    Uuid: prod.uuid,

    DesignTypes: prod.designType,
    OverWorkTypes: prod.overworkType,
    Seasons: prod.season,

    ProductStyleId: getInt(prod.productStyle),
    ProductTypeId: getInt(prod.productType),
    DyeStaffId: getInt(prod.dyeStaff),
    FinishingId: getInt(prod.finishing),
    PlainDyedTypeId: getInt(prod.plainDyedType),
    PrintTypeId: getInt(prod.printType),
    VendorId: getInt(prod.vendorId),

    ColorVariants: prod.colorVariants,
    ColorVariantsPlus: prod.colorVariantsPlus
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

    prod.colorVariants && prod.colorVariants.forEach(cv => {  // !!ColorNo
      postFile(cv, null)
    });

    prod.globalPhotos && prod.globalPhotos.forEach(cv => { //filter(e=>!!e.SelectedFile)  .map((e) => e.Id).join(',')
      postFile(cv, r.id)
    });

    return { status: true, id: r.id };
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const saveComposition = async (productId, composition) => {

  let rc = await fetch(config.api + '/TextileTypes/ProductSaveComposition', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({
        ProductId: getInt(productId),
        Composition: composition
      })
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const addComposition = async (productId, textileTypeId, value) => {

  let data = {
    //Id: null,
    ProductId: getInt(productId),
    TextileTypeId: textileTypeId,
    Value: getInt(value)
  }

  let rc = await fetch(config.api + '/TextileTypes/ProductAddTextileType', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const finishComposition = async (productId, textileTypeId) => {

  let data = {
    ProductId: getInt(productId),
    TextileTypeId: textileTypeId,
  }

  let rc = await fetch(config.api + '/TextileTypes/Finish', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const removeComposition = async (id) => {

  let rc = await fetch(config.api + '/TextileTypes/ProductRemoveTextileType', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify({ Id: id })
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const sampleComposition = async (productId, sampleId) => {

  let data = {
    ProductId: getInt(productId),
    SampleId: getInt(sampleId),
  }

  let rc = await fetch(config.api + '/TextileTypes/ApplySample', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return true;
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

export const postFile = async (colorVariant, prodId, type) => {

  if (!colorVariant.SelectedFile) {
    return
  }
  const formData = new FormData();
  formData.append("formFile", colorVariant.SelectedFile);
  formData.append("uid", colorVariant.uuid); //!? Id);
  formData.append("productId", prodId);
  formData.append("type", type);
  try {
    const res = await axios.post(config.api + "/Products/ImportFile", formData);
  } catch (ex) {
    console.log(ex);
  }
};

export const loadProduct = async (id, setFn) => {

  axios.get(config.api + '/Products/Product', {
    params: {
      id: id
    }})
  .then(function (response) {
    setFn(response.data)
  })
  .catch(function (error) {
    console.log(error);
  })
  .finally(function () {
    // always executed
  });

  //let rc = await axios.get(config.api + '/Products/Product?='+id, { params: { id: id }})
  /*const rc = await fetch(config.api + '/Products/Product?id='+id, {
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
  })*/

}

