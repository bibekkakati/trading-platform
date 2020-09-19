const axios = require("axios").default;
const base_url = process.env.REACT_APP_BASE_URL;
const login_url = process.env.REACT_APP_BACKEND_URL + "login";

export const getScripInfo = (exchange, instrumentToken, user_token) => {
  const url = `${base_url}scripinfo?exchange=${exchange}&instrument_token=${instrumentToken}`;
  axios({
    method: "get",
    url: url,
    headers: {
      Authorization: "Bearer " + user_token,
    },
  })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });
};

export const cancelOrder = (orderid, user_token) => {
  const url = `${base_url}order?oms_order_id=${orderid}&order_status=open`;
  return new Promise((resolve, reject) => {
    axios({
      method: "delete",
      url: url,
      headers: {
        Authorization: "Bearer " + user_token,
      },
    })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const modifyOrder = (
  orderid,
  instrument_token,
  exchange,
  transaction_type,
  product,
  validity,
  order_type,
  price,
  trigger_price,
  quantity,
  user_token
) => {
  const url = `${base_url}order`;
  return new Promise((resolve, reject) => {
    axios
      .put(
        url,
        {
          oms_order_id: orderid,
          instrument_token: instrument_token,
          exchange: exchange,
          transaction_type: transaction_type,
          product: product,
          validity: validity,
          order_type: order_type,
          price: price,
          trigger_price: trigger_price,
          quantity: quantity,
          disclosed_quantity: 0,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_token,
          },
        }
      )
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getOrderBook = (user_token) => {
  const url = `${base_url}order`;
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: "Bearer " + user_token,
      },
    })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const getTradeBook = (user_token) => {
  const url = `${base_url}trade`;
  return new Promise((resolve, reject) => {
    axios({
      method: "get",
      url: url,
      headers: {
        Authorization: "Bearer " + user_token,
      },
    })
      .then(function (response) {
        resolve(response.data);
      })
      .catch(function (error) {
        reject(error);
      });
  });
};

export const placeOrder = (
  user_token,
  exchange,
  order_type,
  instrument_token,
  quantity,
  disclosed_quantity,
  price,
  transaction_type,
  trigger_price,
  validity,
  product,
  order_tag
) => {
  const url = `${base_url}order`;
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          exchange: exchange,
          order_type: order_type,
          instrument_token: instrument_token,
          quantity: quantity,
          disclosed_quantity: disclosed_quantity,
          price: price,
          transaction_type: transaction_type,
          trigger_price: trigger_price,
          validity: validity,
          product: product,
          source: "web",
          order_tag: order_tag,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_token,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const placeBracketOrder = (
  user_token,
  exchange,
  order_type,
  instrument_token,
  quantity,
  disclosed_quantity,
  square_off_value,
  stop_loss_value,
  price,
  trailing_stop_loss,
  transaction_type,
  trigger_price,
  validity,
  product,
  order_tag
) => {
  const url = `${base_url}bracketorder`;
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          exchange: exchange,
          order_type: order_type,
          instrument_token: instrument_token,
          quantity: quantity,
          disclosed_quantity: disclosed_quantity,
          square_off_value: square_off_value,
          stop_loss_value: stop_loss_value,
          price: price,
          transaction_type: transaction_type,
          trigger_price: trigger_price,
          trailing_stop_loss: trailing_stop_loss,
          validity: validity,
          product: product,
          source: "web",
          order_tag: order_tag,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_token,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const login = (client_id, client_secret, password, twofa) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        login_url,
        {
          client_id: client_id,
          client_secret: client_secret,
          password: password,
          twofa: twofa,
        },
        {
          headers: {
            Accept: "application/json",
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const placeAmoOrder = (
  user_token,
  exchange,
  order_type,
  instrument_token,
  quantity,
  disclosed_quantity,
  price,
  transaction_type,
  trigger_price,
  validity,
  product,
  order_tag
) => {
  const url = `${base_url}amo`;
  return new Promise((resolve, reject) => {
    axios
      .post(
        url,
        {
          exchange: exchange,
          order_type: order_type,
          instrument_token: instrument_token,
          quantity: quantity,
          disclosed_quantity: disclosed_quantity,
          price: price,
          transaction_type: transaction_type,
          trigger_price: trigger_price,
          validity: validity,
          product: product,
          source: "web",
          order_tag: order_tag,
        },
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + user_token,
          },
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default {
  getScripInfo,
  login,
  placeOrder,
  placeBracketOrder,
  getOrderBook,
  getTradeBook,
  cancelOrder,
  modifyOrder,
  placeAmoOrder,
};
