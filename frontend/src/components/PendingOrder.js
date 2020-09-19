import React, { PureComponent } from "react";
import "../css/OrderBook.css";
import { AiFillClockCircle } from "react-icons/ai";
import { BookContext } from "../context/BookContext";
import { cancelOrder, modifyOrder } from "../api_calls/api_functions";

export default class PendingOrder extends PureComponent {
  static contextType = BookContext;
  state = {
    price: 0,
    quantity: 0,
    triggerprice: 0,
    order_id: "",
    transaction_type: "BUY",
    symbol: "",
    exchange: "",
    instrument_token: "",
    product: "",
    order_type: "",
    validity: "",
    showModal: false,
    client_token: "",
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

  orderAction = (i) => {
    var order = this.context.pendingOrders[this.context.selectedId];
    order = order[i];
    this.setState({
      price: order.price,
      quantity: order.quantity,
      triggerprice: order.trigger_price,
      transaction_type: order.transaction_type,
      order_id: order.oms_order_id,
      exchange: order.exchange,
      symbol: order.trading_symbol,
      instrument_token: order.instrument_token,
      product: order.product,
      validity: order.validity,
      order_type: order.order_type,
      showModal: true,
      client_token: this.context.client_token,
    });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  modifyOrder = () => {
    modifyOrder(
      this.state.order_id,
      parseInt(this.state.instrument_token),
      this.state.exchange,
      this.state.transaction_type,
      this.state.product,
      this.state.validity,
      this.state.order_type,
      parseFloat(this.state.price),
      parseFloat(this.state.triggerprice),
      parseInt(this.state.quantity),
      this.state.client_token
    )
      .then((data) => {
        if (data.status === "success") {
          this.props.updateNotification(
            {
              type: "success",
              message: `${this.context.selectedId} : ${this.state.symbol} :  Modify order request placed successfully`,
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
            message: `${this.context.selectedId} : ${this.state.symbol} :  ${e}`,
          },
          true
        );
      });
    this.setState({ showModal: false });
  };

  cancelOrder = () => {
    cancelOrder(this.state.order_id, this.state.client_token)
      .then((data) => {
        if (data.status === "success") {
          this.props.updateNotification(
            {
              type: "success",
              message: `${this.context.selectedId} : ${this.state.symbol} :  Cancel order request placed successfully`,
            },
            true
          );
        }
      })
      .catch((e) => {
        this.props.updateNotification(
          {
            type: "error",
            message: `${this.context.selectedId} : ${this.state.symbol} :  ${e}`,
          },
          true
        );
      });
    this.setState({ showModal: false });
  };

  render() {
    var divs = [];
    var d = "";
    var h,
      m,
      s = 0;
    var pendingOrders = this.context.pendingOrders[this.context.selectedId];
    if (pendingOrders) {
      for (let i = 0; i < pendingOrders.length; i++) {
        d = pendingOrders[i].order_entry_time;
        if (d !== 0) {
          d = new Date(d * 1000);
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
            key={i}
            onClick={() => this.orderAction(i)}
          >
            <div className="vals">
              <p>{pendingOrders[i].trading_symbol}</p>
            </div>
            <div className="vals">
              <p className="exchg">{pendingOrders[i].exchange}</p>
            </div>
            <div className="vals">
              <p className={"side " + pendingOrders[i].transaction_type}>
                {pendingOrders[i].transaction_type}
              </p>
            </div>
            <div className="vals">
              <p>
                {pendingOrders[i].filled_quantity}/{pendingOrders[i].quantity}
              </p>
            </div>
            <div className="vals">
              <p>{pendingOrders[i].price}</p>
            </div>
            <div className="vals">
              <p>{pendingOrders[i].product}</p>
            </div>
            <div className="vals">
              <p>{pendingOrders[i].order_type}</p>
            </div>
            <div className="vals">
              <p>{pendingOrders[i].trigger_price}</p>
            </div>
            <div className="vals">
              <p className="pendingicon">
                <AiFillClockCircle />
              </p>
            </div>
            <div className="vals">
              <p>{d}</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="pendingorders">
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
            <p>PRODUCT</p>
          </div>
          <div className="vals">
            <p>ORDER TYPE</p>
          </div>
          <div className="vals">
            <p>TRIGGER PRICE</p>
          </div>
          <div className="vals">
            <p>STATUS</p>
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
