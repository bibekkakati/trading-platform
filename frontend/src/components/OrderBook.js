import React, { PureComponent } from "react";
import "../css/OrderBook.css";
import PendingOrder from "./PendingOrder";
import CompletedOrder from "./CompletedOrder";
import TradeBook from "./TradeBook";
import ClientList from "./ClientList";
import { BookContext } from "../context/BookContext";

export default class OrderBook extends PureComponent {
  static contextType = BookContext;
  state = {
    ordertypesection: "0",
  };

  changeOrderTypeSection = (type) => {
    this.setState({ ordertypesection: type.target.id });
  };

  render() {
    let section = [
      <PendingOrder updateNotification={this.props.updateNotification} />,
      <CompletedOrder />,
      <TradeBook />,
    ];
    return (
      <div className="orderbook">
        <ClientList />
        <div className="headbar">
          <div className="ordertypes">
            <p
              className={
                this.state.ordertypesection === "0" ? "text ul" : "text"
              }
              onClick={this.changeOrderTypeSection}
              id="0"
            >
              Pending (
              {this.context.pendingOrders[this.context.selectedId] !== undefined
                ? this.context.pendingOrders[this.context.selectedId].length
                : 0}
              )
            </p>
            <p
              className={
                this.state.ordertypesection === "1" ? "text ul" : "text"
              }
              onClick={this.changeOrderTypeSection}
              id="1"
            >
              Completed (
              {this.context.completedOrders[this.context.selectedId] !==
              undefined
                ? this.context.completedOrders[this.context.selectedId].length
                : 0}
              )
            </p>
            <p
              className={
                this.state.ordertypesection === "2" ? "text ul" : "text"
              }
              onClick={this.changeOrderTypeSection}
              id="2"
            >
              Trades (
              {this.context.trades[this.context.selectedId] !== undefined
                ? this.context.trades[this.context.selectedId].length
                : 0}
              )
            </p>
          </div>
        </div>
        <div className="ordertypesection">
          {section[this.state.ordertypesection]}
        </div>
      </div>
    );
  }
}
