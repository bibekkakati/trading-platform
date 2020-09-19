import React, { PureComponent } from "react";
import "../css/OrderBook.css";
import { cancelOrder, modifyOrder } from "../api_calls/api_functions";
import { Firebase } from "../config/firebase";

import { MarketDataContext } from "../context/MarketDataContext";
var d = new Date();
var doc = `${d.getFullYear()}_${d.getMonth() + 1}_${d.getDate()}`;

export default class AllOrder extends PureComponent {
  static contextType = MarketDataContext;

  constructor(props) {
    super(props);
    this.state = {
      orderscrip: "",
      allorder: "",
      price: 0,
      quantity: 0,
      transaction_type: "BUY",
      symbol: "",
      showModal: false,
      instrument_token: "",
      triggerprice: 0,
      ordernumber: "",
      exchange: "",
      product: "",
      validity: "",
      order_type: "",
    };
  }

  componentDidMount = () => {
    const db = Firebase.firestore();
    var allorderRef = db.collection("allorder").doc(doc);
    var orderscripRef = db.collection("orderscrip").doc(doc);
    var that = this;

    allorderRef.onSnapshot(function (doc) {
      that.setState({ allorder: doc.data() });
    });

    orderscripRef.onSnapshot(function (doc) {
      that.setState({ orderscrip: doc.data() });
    });
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

  orderAction = (orderid) => {
    var order = this.state.orderscrip[orderid];
    this.setState({
      ordernumber: orderid,
      price: order.price,
      quantity: order.quantity,
      transaction_type: order.side,
      symbol: order.symbol,
      showModal: true,
      instrument_token: order.token,
      triggerprice: order.triggerprice,
      exchange: order.exchange,
      product: order.product,
      validity: order.validity,
      order_type: order.order_type,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  modifyOrder = () => {
    let orderObj = this.state.allorder[this.state.ordernumber];
    for (const client in orderObj) {
      let orders = orderObj[client];
      let user_token = this.context.clientsList[client];
      for (let i = 0; i < orders.length; i++) {
        modifyOrder(
          orders[i],
          parseInt(this.state.instrument_token),
          this.state.exchange,
          this.state.transaction_type,
          this.state.product,
          this.state.validity,
          this.state.order_type,
          parseFloat(this.state.price),
          parseFloat(this.state.triggerprice),
          parseInt(this.state.quantity),
          user_token
        )
          .then((data) => {
            if (data.status === "success") {
              this.props.updateNotification(
                {
                  type: "success",
                  message: `${client} : ${this.state.symbol} :  Modify order request placed successfully`,
                },
                true
              );
            }
            console.log(data);
          })
          .catch((e) => {
            this.props.updateNotification(
              {
                type: "error",
                message: `${client} : ${this.state.symbol} :  ${e}`,
              },
              true
            );
          });
      }
    }

    this.setState({ showModal: false });
  };

  cancelOrder = () => {
    const db = Firebase.firestore();
    let orderObj = this.state.allorder[this.state.ordernumber];
    for (const client in orderObj) {
      let orders = orderObj[client];
      let user_token = this.context.clientsList[client];
      for (let i = 0; i < orders.length; i++) {
        cancelOrder(orders[i], user_token)
          .then((data) => {
            if (data.status === "success") {
              this.props.updateNotification(
                {
                  type: "success",
                  message: `${client} : ${this.state.symbol} :  Cancel order request placed successfully`,
                },
                true
              );
            }
          })
          .catch((e) => {
            this.props.updateNotification(
              {
                type: "error",
                message: `${client} : ${this.state.symbol} :  ${e}`,
              },
              true
            );
          });
      }
    }
    var allorderRef = db.collection("allorder").doc(doc);
    var orderscripRef = db.collection("orderscrip").doc(doc);
    allorderRef.update({
      [this.state.ordernumber]: Firebase.firestore.FieldValue.delete(),
    });
    orderscripRef.update({
      [this.state.ordernumber]: Firebase.firestore.FieldValue.delete(),
    });
    this.setState({ showModal: false });
  };

  render() {
    let divs = [];
    let d = "";
    let h,
      m,
      s = 0;
    let allorder = this.state.allorder;
    let orderscrip = this.state.orderscrip;
    if (allorder && orderscrip) {
      for (const order in allorder) {
        d = order;
        if (d !== 0) {
          d = new Date(parseInt(d));
          h = d.getHours();
          h = h >= 0 && h < 10 ? "0" + h : h;
          m = d.getMinutes();
          m = m >= 0 && m < 10 ? "0" + m : m;
          s = d.getSeconds();
          s = s >= 0 && s < 10 ? "0" + s : s;
          d = `${h}:${m}:${s}`;
        }
        divs.push(
          <div
            className="orderinfo orderdata"
            key={order}
            onClick={() => this.orderAction(order)}
          >
            <div className="vals">
              <p>{orderscrip[order].symbol}</p>
            </div>
            <div className="vals">
              <p className="exchg">{orderscrip[order].exchange}</p>
            </div>
            <div className="vals">
              <p className={"side " + orderscrip[order].side}>
                {orderscrip[order].side}
              </p>
            </div>
            <div className="vals">
              <p>{orderscrip[order].quantity}</p>
            </div>
            <div className="vals">
              <p>{orderscrip[order].price}</p>
            </div>
            <div className="vals">
              <p>{orderscrip[order].triggerprice}</p>
            </div>
            <div className="vals">
              <p>{orderscrip[order].product}</p>
            </div>
            <div className="vals">
              <p>{d}</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="pendingorders trades" style={{ marginRight: "10px" }}>
        <div className="orderinfo orderinfoheading">
          <div className="vals">
            <p>SYMBOL</p>
          </div>
          <div className="vals">
            <p>EXCH</p>
          </div>
          <div className="vals">
            <p>SIDE</p>
          </div>
          <div className="vals">
            <p>QUANTITY</p>
          </div>
          <div className="vals">
            <p>PRICE</p>
          </div>
          <div className="vals">
            <p>TRIGGER PRICE</p>
          </div>
          <div className="vals">
            <p>PRODUCT</p>
          </div>
          <div className="vals">
            <p>TIME</p>
          </div>
        </div>
        {divs}
        {this.state.showModal ? (
          <div className="popup">
            <div className="topline">
              <div className="closebtn" onClick={this.closeModal}>
                X
              </div>
              <div className={"symbol " + this.state.transaction_type}>
                {this.state.symbol}
              </div>
            </div>
            <label htmlFor="price" className="price">
              Price
            </label>
            <input
              type="text"
              value={this.state.price}
              id="price"
              onChange={this.updateFloatValue}
            />
            <label htmlFor="quantity" className="price">
              Quantity
            </label>
            <input
              type="text"
              value={this.state.quantity}
              id="quantity"
              onChange={this.updateIntValue}
            />
            <label htmlFor="triggerprice" className="price">
              Trigger Price
            </label>
            <input
              type="text"
              value={this.state.triggerprice}
              id="triggerprice"
              onChange={this.updateFloatValue}
            />
            <button className="cancel" onClick={this.cancelOrder}>
              Cancel Order
            </button>
            <button className="modify" onClick={this.modifyOrder}>
              Modify Order
            </button>
          </div>
        ) : null}
      </div>
    );
  }
}
