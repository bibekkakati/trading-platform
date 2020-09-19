// For the default version
import algoliasearch from "algoliasearch";
const axios = require("axios").default;

const client = algoliasearch("2RSMIQ81PE", "854bfa5ed0d1d25168d9ed4eb80396d0");
const index = client.initIndex("test_trading");

// export const addData = () => {
//   const url =
//     "https://ant.aliceblueonline.com/api/v2/contracts.json?exchanges=NSE";
//   axios({
//     method: "get",
//     url: url,
//   })
//     .then(function (response) {
//       console.log(response);
//       index
//         .saveObjects(response.data.NSE, {
//           autoGenerateObjectIDIfNotExist: true,
//         })
//         .then(({ objectIDs }) => {
//           console.log(objectIDs);
//         });
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// };

export const fetchData = async (keywords) => {
  var { hits } = await index.search(keywords, {
    attributesToRetrieve: ["symbol", "exchange_code", "exchange", "code"],
    hitsPerPage: 50,
  });
  return hits;
};

export default {
  //   addData,
  fetchData,
};
