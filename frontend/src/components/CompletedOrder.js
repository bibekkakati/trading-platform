import React, { PureComponent } from "react";
import "../css/OrderBook.css";
import { MdCheckCircle } from "react-icons/md";
import { IoIosCloseCircle } from "react-icons/io";
import { BookContext } from "../context/BookContext";

export default class CompletedOrder extends PureComponent {
  static contextType = BookContext;
  render() {
    let divs = [];
    let status = "",
      d = "";
    let h,
      m,
      s = 0;
    let completedOrders = this.context.completedOrders[this.context.selectedId];
    if (completedOrders) {
      for (let i = 0; i < completedOrders.length; i++) {
        status = completedOrders[i].order_status;
        d = completedOrders[i].order_entry_time;
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
              <p>{completedOrders[i].trading_symbol}</p>
            </div>
            <div className="vals">
              <p className="exchg">{completedOrders[i].exchange}</p>
            </div>
            <div className="vals">
              <p className={"side " + completedOrders[i].transaction_type}>
                {completedOrders[i].transaction_type}
              </p>
            </div>
            <div className="vals">
              <p>
                {completedOrders[i].filled_quantity}/
                {completedOrders[i].quantity}
              </p>
            </div>
            <div className="vals">
              <p>{completedOrders[i].price}</p>
            </div>
            <div className="vals">
              <p>{completedOrders[i].product}</p>
            </div>
            <div className="vals">
              <p>{completedOrders[i].order_type}</p>
            </div>
            <div className="vals">
              <p>{completedOrders[i].trigger_price}</p>
            </div>
            <div className="vals">
              {status === "rejected" ? (
                <p className="rejectedicon">
                  <IoIosCloseCircle />
                </p>
              ) : (
                <p className="completedicon">
                  <MdCheckCircle />
                </p>
              )}
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
      </div>
    );
  }
}
