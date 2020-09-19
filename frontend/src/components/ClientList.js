import React, { Component } from "react";
import "../css/ClientList.css";
import { MarketDataContext } from "../context/MarketDataContext";
import { BookContext } from "../context/BookContext";
import { getOrderBook, getTradeBook } from "../api_calls/api_functions";

export default class ClientList extends Component {
  static contextType = MarketDataContext;

  state = {
    selectedId: "",
  };

  idSelected = async (id, context) => {
    let client_token = this.context.clientsList[id];
    this.setState({ selectedId: id });
    await context.updateData({ selectedId: id, client_token: client_token });
    this.getOrderBook(context);
    this.getTradeBook(context);
  };

  getOrderBook = (context) => {
    let pendingOrders = { ...context.pendingOrders };
    let completedOrders = { ...context.completedOrders };
    getOrderBook(this.context.clientsList[this.state.selectedId])
      .then((data) => {
        if (data.status === "success") {
          pendingOrders[this.state.selectedId] = data.data["pending_orders"];
          completedOrders[this.state.selectedId] =
            data.data["completed_orders"];
          context.updateData({
            pendingOrders,
            completedOrders,
          });
        }
      })
      .catch((e) => console.log(e));
  };
  getTradeBook = (context) => {
    let trades = { ...context.trades };
    getTradeBook(this.context.clientsList[this.state.selectedId])
      .then((data) => {
        if (data.status === "success") {
          trades[this.state.selectedId] = data.data["trades"];
          context.updateData({
            trades,
          });
        }
      })
      .catch((e) => console.log(e));
  };

  render() {
    return (
      <BookContext.Consumer>
        {(value) => {
          let clientIdDivs = [];
          for (const id in this.context.clientsList) {
            clientIdDivs.push(
              <div
                key={id}
                className={
                  this.state.selectedId === id || value.selectedId === id
                    ? "clientId ac"
                    : "clientId"
                }
                onClick={() => this.idSelected(id, value)}
              >
                {id}
              </div>
            );
          }
          return <div className="clientlist">{clientIdDivs}</div>;
        }}
      </BookContext.Consumer>
    );
  }
}
