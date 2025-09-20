import axios from 'axios'
import config from "../config.json"

export const  postPayment = async (pay) => {

  let rc = await fetch(config.api + '/Payments/Pay', {
      method: "POST",
      headers: {
          'Content-Type': 'application/json'
        },
      body: JSON.stringify(pay)
  })
  .then(r => r.json())
  .then(r => {
    if (r.status !== undefined && r.status == 400) {
      return false;
    }

    return { status: true, id: r.id };
  })
  .catch (error => {
    console.log(error)
    return false
  })

  return rc
};

