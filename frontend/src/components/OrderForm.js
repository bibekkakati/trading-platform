import React, { PureComponent } from "react";
import "../css/OrderForm.css";
import "../css/ToggleSwitch.css";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { MarketDataContext } from "../context/MarketDataContext";
import {
  placeOrder,
  placeBracketOrder,
  placeAmoOrder,
} from "../api_calls/api_functions";
import { Firebase } from "../config/firebase";

const db = Firebase.firestore();

export default class OrderForm extends PureComponent {
  static contextType = MarketDataContext;
  constructor(props) {
    super(props);
    this.state = {
      orderSide: "BUY",
      buySideClass: "buy",
      sellSideClass: "",
      trailingsl: 0,
      orderperac: 1,
      price: 0,
      quantity: 1,
      disclosedquantity: 0,
      triggerprice: 0,
      target: 0,
      stoploss: 0,
      complexity: "SIMPLE",
      ordertype: "MARKET",
      position: "CNC",
      validity: "DAY",
    };
  }

  updateNotificationList = (obj) => {
    var notificationlist = [...this.context.notification];
    notificationlist.push(obj);
    this.context.updateData({
      notification: notificationlist,
    });
  };

  updateOrdersToDB = (col, doc, obj) => {
    db.collection(col)
      .doc(doc)
      .set(obj, { merge: true })
      .then(function () {
        console.log("Document successfully written!");
      })
      .catch(function (error) {
        console.error("Error writing document: ", error);
      });
  };

  placeOrder = () => {
    var d = new Date();
    var doc = `${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;
    var allOrderId = `${Date.now()}`;

    var clientsList = { ...this.context.clientsList };
    var activeClients = [...this.context.activeClients];

    var instrument_token = this.context.orderInstrumentToken;
    var exchange = this.context.exchange;
    var symbol = this.context.symbol;

    var fixedto = this.context.exchangeCode === "3" ? 4 : 2;
    var transaction_type = this.state.orderSide.toUpperCase();
    var order_type = this.state.ordertype.toUpperCase();
    var trailing_stop_loss = parseFloat(this.state.trailingsl).toFixed(fixedto);
    var stop_loss_value = parseFloat(this.state.stoploss).toFixed(fixedto);
    var orderPerAccount = parseInt(this.state.orderperac);
    var price = parseFloat(this.state.price).toFixed(fixedto);
    var quantity = parseInt(this.state.quantity);
    var disclosed_quantity = parseInt(this.state.disclosedquantity);
    var trigger_price = parseFloat(this.state.triggerprice).toFixed(fixedto);
    var square_off_value = parseFloat(this.state.target).toFixed(fixedto);
    var product = this.state.position.toUpperCase();
    var validity = this.state.validity.toUpperCase();
    var complexity = this.state.complexity.toUpperCase();

    var userToken = "";
    var order_tag = allOrderId;

    var dbObj = {};
    var orderObj = {};
    orderObj.token = instrument_token;
    orderObj.symbol = symbol;
    orderObj.exchange = exchange;
    orderObj.side = transaction_type;
    orderObj.quantity = quantity;
    orderObj.price = price;
    orderObj.product = product;
    orderObj.triggerprice = trigger_price;
    orderObj.validity = validity;
    orderObj.order_type = order_type;

    switch (order_type) {
      case "MARKET":
        price = 0;
        trigger_price = 0;
        break;
      case "LIMIT":
        trigger_price = 0;
        break;
      case "SLM":
        price = 0;
        break;
      default:
        break;
    }

    if (complexity === "SIMPLE") {
      for (let i = 0; i < activeClients.length; i++) {
        userToken = clientsList[activeClients[i]];
        let arr = [];
        for (let c = 0; c < orderPerAccount; c++) {
          placeOrder(
            userToken,
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
          )
            .then((data) => {
              if (data.status === "success") {
                arr.push(data.data["oms_order_id"]);
                dbObj[activeClients[i]] = arr;
                this.updateOrdersToDB("allorder", doc, {
                  [allOrderId]: dbObj,
                });
                this.props.updateNotification(
                  {
                    type: "success",
                    message: `${activeClients[i]} : ${symbol} : ${data.message}`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "success",
                  message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  time: allOrderId,
                });
              } else {
                this.props.updateNotification(
                  {
                    type: "error",
                    message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  time: allOrderId,
                });
              }
            })
            .catch((e) => {
              this.props.updateNotification(
                {
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  ${e}`,
                },
                true
              );
              this.updateNotificationList({
                type: "error",
                message: `${activeClients[i]} : ${symbol} :  ${e}`,
                time: allOrderId,
              });
            });
        }
      }
    } else if (complexity === "CO") {
      for (let i = 0; i < activeClients.length; i++) {
        userToken = clientsList[activeClients[i]];
        let arr = [];
        for (let c = 0; c < orderPerAccount; c++) {
          placeOrder(
            userToken,
            exchange,
            order_type,
            instrument_token,
            quantity,
            disclosed_quantity,
            price,
            transaction_type,
            stop_loss_value,
            validity,
            complexity,
            order_tag
          )
            .then((data) => {
              if (data.status === "success") {
                arr.push(data.data);
                dbObj[activeClients[i]] = arr;
                this.updateOrdersToDB("allorder", doc, {
                  [allOrderId]: dbObj,
                });
                this.props.updateNotification(
                  {
                    type: "success",
                    message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "success",
                  message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  time: allOrderId,
                });
              } else {
                this.props.updateNotification(
                  {
                    type: "error",
                    message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  time: allOrderId,
                });
              }
            })
            .catch((e) => {
              this.props.updateNotification(
                {
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  ${e}`,
                },
                true
              );
              this.updateNotificationList({
                type: "error",
                message: `${activeClients[i]} : ${symbol} :  ${e}`,
                time: allOrderId,
              });
            });
        }
      }
    } else if (complexity === "BO") {
      for (let i = 0; i < activeClients.length; i++) {
        userToken = clientsList[activeClients[i]];
        let arr = [];
        for (let c = 0; c < orderPerAccount; c++) {
          placeBracketOrder(
            userToken,
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
          )
            .then((data) => {
              if (data.status === "success") {
                arr.push(data.data);
                dbObj[activeClients[i]] = arr;
                this.updateOrdersToDB("allorder", doc, {
                  [allOrderId]: dbObj,
                });
                this.props.updateNotification(
                  {
                    type: "success",
                    message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "success",
                  message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  time: allOrderId,
                });
              } else {
                this.props.updateNotification(
                  {
                    type: "error",
                    message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  time: allOrderId,
                });
              }
            })
            .catch((e) => {
              this.props.updateNotification(
                {
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  ${e}`,
                },
                true
              );
              this.updateNotificationList({
                type: "error",
                message: `${activeClients[i]} : ${symbol} :  ${e}`,
                time: allOrderId,
              });
            });
        }
      }
    } else if (complexity === "AMO") {
      for (let i = 0; i < activeClients.length; i++) {
        userToken = clientsList[activeClients[i]];
        let arr = [];
        for (let c = 0; c < orderPerAccount; c++) {
          placeAmoOrder(
            userToken,
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
          )
            .then((data) => {
              if (data.status === "success") {
                arr.push(data.data["oms_order_id"]);
                dbObj[activeClients[i]] = arr;
                this.updateOrdersToDB("allorder", doc, {
                  [allOrderId]: dbObj,
                });
                this.props.updateNotification(
                  {
                    type: "success",
                    message: `${activeClients[i]} : ${symbol} : ${data.message}`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "success",
                  message: `${activeClients[i]} : ${symbol} :  ${data.message}`,
                  time: allOrderId,
                });
              } else {
                this.props.updateNotification(
                  {
                    type: "error",
                    message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  },
                  true
                );
                this.updateNotificationList({
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  Error in placing order`,
                  time: allOrderId,
                });
              }
            })
            .catch((e) => {
              this.props.updateNotification(
                {
                  type: "error",
                  message: `${activeClients[i]} : ${symbol} :  ${e}`,
                },
                true
              );
              this.updateNotificationList({
                type: "error",
                message: `${activeClients[i]} : ${symbol} :  ${e}`,
                time: allOrderId,
              });
            });
        }
      }
    } else {
      this.props.updateNotification(
        {
          type: "error",
          message: `Fill up the required fields`,
        },
        true
      );
    }
    this.updateOrdersToDB("orderscrip", doc, {
      [allOrderId]: orderObj,
    });
    this.setState({
      trailingsl: 0,
      orderperac: 1,
      price: 0,
      quantity: 1,
      disclosedquantity: 0,
      triggerprice: 0,
      target: 0,
      stoploss: 0,
    });
  };

  orderSide = (e) => {
    if (e.target.value === "BUY") {
      this.setState({
        orderSide: "SELL",
        sellSideClass: "sell",
        buySideClass: "",
      });
    } else if (e.target.value === "SELL") {
      this.setState({
        orderSide: "BUY",
        buySideClass: "buy",
        sellSideClass: "",
      });
    }
  };

  updateFloatValue = (e) => {
    if (Number(e.target.value) || e.target.value >= 0) {
      this.setState({ [e.target.id]: e.target.value });
      return;
    }
    if (e.target.value === "") {
      this.setState({ [e.target.id]: "" });
    }
  };

  updateIntValue = (e) => {
    var value = parseFloat(e.target.value);
    if (value) {
      this.setState({ [e.target.id]: value });
      return;
    }
    if (e.target.value === "") {
      this.setState({ [e.target.id]: "" });
    }
  };

  updateConditions = (e) => {
    let id = e.target.id;
    let val = e.target.value;
    switch (id) {
      case "complexity":
        if (val === "CO") {
          this.setState({
            position: "MIS",
            validity: "DAY",
            ordertype: "MARKET",
          });
        }
        if (val === "BO") {
          this.setState({
            position: "MIS",
            validity: "DAY",
            ordertype: "LIMIT",
          });
        }
        break;

      default:
        break;
    }
    this.setState({ [e.target.id]: e.target.value });
  };

  render() {
    let disablePrice =
      this.state.ordertype === "MARKET" || this.state.ordertype === "SLM"
        ? true
        : false;
    let disableStoploss =
      this.state.complexity === "CO" || this.state.complexity === "BO"
        ? false
        : true;
    let disablePosition =
      this.state.complexity === "CO" || this.state.complexity === "BO"
        ? true
        : false;
    let disableTriggerPrice =
      this.state.ordertype === "SLM" || this.state.ordertype === "SL"
        ? false
        : true;
    let disableTarget = this.state.complexity === "BO" ? false : true;
    let changeSign = Math.sign(this.context.ltp - this.context.lltp).toString();
    let trend =
      this.context.change >= 0 ? (
        <FiArrowUpRight className="up" />
      ) : (
        <FiArrowDownRight className="down" />
      );

    let position =
      this.context.exchangeCode === "1" || this.context.exchangeCode === "2"
        ? "CNC"
        : "NRML";

    return (
      <div className="form">
        <div className="ticker">
          <p className="index">
            {this.context.symbol}{" "}
            <small className="exch">{this.context.exchange}</small>
          </p>

          <div className="tick">
            <p className="point" data-change={changeSign}>
              {this.context.ltp}
            </p>
            <p className="change">
              ({this.context.change} {trend})
            </p>
          </div>
        </div>
        <div className="orderform">
          <div className="topsection">
            <p className="title">Order Entry</p>
            <div className="orderside">
              <p className={"title " + this.state.buySideClass}>BUY</p>
              <label className="switch">
                <input
                  type="checkbox"
                  value={this.state.orderSide}
                  onChange={this.orderSide}
                />
                <span className="slider round"></span>
              </label>
              <p className={"title " + this.state.sellSideClass}>SELL</p>
            </div>
          </div>

          <div className="conditions">
            <div className="box">
              <label className="label">COMPLEXITY</label>
              <select
                className="select"
                id="complexity"
                onChange={this.updateConditions}
                value={this.state.complexity}
              >
                <option value="SIMPLE">SIMPLE</option>
                <option value="CO">CO</option>
                <option value="BO">BO</option>
                <option value="AMO">AMO</option>
              </select>
            </div>
            <div className="box">
              <label className="label">ORDER TYPE</label>
              <select
                className="select"
                id="ordertype"
                onChange={this.updateConditions}
                value={this.state.ordertype}
              >
                {this.state.complexity !== "BO" ? (
                  <option value="MARKET">MARKET</option>
                ) : null}

                <option value="LIMIT">LIMIT</option>
                {this.state.complexity === "BO" ||
                this.state.complexity === "AMO" ||
                this.state.complexity === "SIMPLE" ? (
                  <option value="SL">SL LIMIT</option>
                ) : null}

                {this.state.complexity !== "CO" &&
                this.state.complexity !== "BO" ? (
                  <option value="SLM">SL MKT</option>
                ) : null}
              </select>
            </div>
            <div className="box">
              <label className="label">POSITION</label>
              <select
                className="select"
                id="position"
                onChange={this.updateConditions}
                disabled={disablePosition}
                value={this.state.position}
              >
                {disablePosition ? null : (
                  <option value={position}>{position}</option>
                )}

                <option value="MIS">MIS</option>
              </select>
            </div>
            <div className="box">
              <label className="label">VALIDITY</label>
              <select
                className="select"
                id="validity"
                onChange={this.updateConditions}
                disabled={this.state.complexity === "CO" ? true : false}
              >
                <option value="DAY">DAY</option>
                <option value="IOC">IOC</option>
              </select>
            </div>
            <div className="box">
              <label className="label">ORDER PER A/C</label>
              <input
                type="text"
                className="input"
                id="orderperac"
                value={this.state.orderperac}
                onChange={this.updateIntValue}
              />
            </div>
          </div>
          <div className="orderdetails">
            <div className="block">
              <div className="box">
                <label className="label">QUANTITY</label>
                <input
                  type="text"
                  className="input"
                  id="quantity"
                  value={this.state.quantity}
                  onChange={this.updateIntValue}
                />
              </div>
              <div className="box">
                <label className="label">STOP LOSS</label>
                <input
                  type="text"
                  className="input"
                  id="stoploss"
                  value={this.state.stoploss}
                  onChange={this.updateFloatValue}
                  disabled={disableStoploss}
                  placeholder={disableStoploss ? 0 : ""}
                />
              </div>
            </div>
            <div className="block">
              <div className="box">
                <label className="label">PRICE</label>
                <input
                  type="text"
                  className="input"
                  id="price"
                  value={this.state.price}
                  onChange={this.updateFloatValue}
                  disabled={disablePrice}
                  placeholder={disablePrice ? 0 : ""}
                />
              </div>
              <div className="box">
                <label className="label">TARGET</label>
                <input
                  type="text"
                  className="input"
                  id="target"
                  value={this.state.target}
                  onChange={this.updateFloatValue}
                  disabled={disableTarget}
                />
              </div>
            </div>
            <div className="block">
              <div className="box">
                <label className="label">DISCLOSED QUANTITY</label>
                <input
                  type="text"
                  className="input"
                  id="disclosedquantity"
                  value={this.state.disclosedquantity}
                  onChange={this.updateIntValue}
                />
              </div>
              <div className="box">
                <label className="label">TRIGGER PRICE</label>
                <input
                  type="text"
                  className="input"
                  id="triggerprice"
                  value={this.state.triggerprice}
                  onChange={this.updateFloatValue}
                  disabled={disableTriggerPrice}
                />
              </div>
            </div>
          </div>
          <div className="placeorder">
            <div className="box">
              <label className="label">TRAILING SL</label>
              <input
                type="text"
                className="input"
                id="trailingsl"
                value={this.state.trailingsl}
                onChange={this.updateFloatValue}
                disabled={disableTarget}
              />
            </div>
            <button
              className={"button box " + this.state.orderSide}
              onClick={this.placeOrder}
            >
              PLACE {this.state.orderSide} ORDER
            </button>
          </div>
        </div>
      </div>
    );
  }
}
