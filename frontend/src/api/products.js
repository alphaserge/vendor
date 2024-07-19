import axios from 'axios'
import config from "../config.json"

export const postProduct = async (prod) => {

  //let cv = prod.colorVariant.filter(item => !!item.ColorNo && item.ColorIds.length > 0 && !!item.SelectedFile)
  //let ac = allColor.filter(item => !!item.No && !!item.SelectedFile).map((e) => e.Id).join(',')

  fetch(config.api + '/Products/ProductAdd', {
    method: "POST",
    headers: {
        'Content-Type': 'application/json'
      },
    body: JSON.stringify({
      ItemName: prod.itemName,
      RefNo: prod.refNo,
      ArtNo: prod.artNo,
      Design: prod.design,
      Seasons: prod.season,
      DesignTypes: prod.designType,
      OverWorkTypes: prod.overworkType,
      ProductStyleId: prod.productStyle,
      ProductTypeId: prod.productType,
      VendorId: prod.vendorId,
      Price: prod.price,
      Weight: prod.weight,
      Width: prod.width,
      Uuid: prod.uid,
      //PhotoUuids: prod.globalPhotos.map((e) => e.Id).join(','),
      ColorVariants: prod.colorVariants, 
    })
})
.then(r => r.json())
.then(r => {

  prod.colorVariants.forEach(cv => {  // !!ColorNo
      postFile(cv)
  });

  prod.globalPhotos.forEach(cv => { //filter(e=>!!e.SelectedFile)  .map((e) => e.Id).join(',')
      postFile(cv, r.id)
  });

  return true
})
.catch (error => {
  console.log(error)
  return false
})
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

