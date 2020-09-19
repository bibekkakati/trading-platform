import React, { PureComponent } from "react";
import "../css/OrderBook.css";
import { BookContext } from "../context/BookContext";

export default class TradeBook extends PureComponent {
  static contextType = BookContext;
  render() {
    let divs = [];
    let d = "";
    let h,
      m,
      s = 0;
    let trades = this.context.trades[this.context.selectedId];
    if (trades) {
      for (let i = 0; i < trades.length; i++) {
        d = trades[i].order_entry_time;
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
          <div className="orderinfo orderdata" key={i}>
            <div className="vals">
              <p>{trades[i].trading_symbol}</p>
            </div>
            <div className="vals">
              <p className="exchg">{trades[i].exchange}</p>
            </div>
            <div className="vals">
              <p className={"side " + trades[i].transaction_type}>
                {trades[i].transaction_type}
              </p>
            </div>
            <div className="vals">
              <p>{trades[i].filled_quantity}</p>
            </div>
            <div className="vals">
              <p>{trades[i].price}</p>
            </div>
            <div className="vals">
              <p>{trades[i].product}</p>
            </div>
            <div className="vals">
              <p>{d}</p>
            </div>
          </div>
        );
      }
    }
    return (
      <div className="pendingorders trades">
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
            <p>TIME</p>
          </div>
        </div>
        {divs}
      </div>
    );
  }
}
