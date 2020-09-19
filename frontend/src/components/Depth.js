import React, { Component } from "react";
import "../css/InstrumentData.css";
import { MarketDataContext } from "../context/MarketDataContext";

export default class Depth extends Component {
  static contextType = MarketDataContext;

  render() {
    let divs = [];
    var bidpercent,
      askpercent = 0;
    for (let i = 0; i < 5; i++) {
      askpercent = (this.context.topAskQty[i] / this.context.askmax) * 80;

      bidpercent = (this.context.topBidQty[i] / this.context.bidmax) * 80;

      divs.push(
        <div className="row" key={i}>
          <div
            className="block qtybar lp"
            style={{
              background:
                "linear-gradient(to left, #d8f0d1 " +
                bidpercent +
                "%, #ffffff00 0%)",
            }}
          >
            <p className="value qty">{this.context.topBidQty[i]}</p>
            <p className="value lv">{this.context.topBidPrice[i]}</p>
          </div>
          <div
            className="block qtybar rp"
            style={{
              background:
                "linear-gradient(to right, #f0d1d1 " +
                askpercent +
                "%, #ffffff00 0%)",
            }}
          >
            <p className="value rv">{this.context.topAskPrice[i]}</p>
            <p className="value qty">{this.context.topAskQty[i]}</p>
          </div>
        </div>
      );
    }

    return (
      <div className="details depth">
        <div className="row">
          <div className="block">
            <p className="title">Quantity</p>
            <p className="value bid">Bid</p>
          </div>
          <div className="block">
            <p className="value ask">Ask</p>
            <p className="title">Quantity</p>
          </div>
        </div>

        {divs}

        <div className="row">
          <div className="block">
            <p className="value bid">{this.context.tbq}</p>
            <p className="value bid">TBQ</p>
          </div>
          <div className="block">
            <p className="value ask">TSQ</p>
            <p className="value ask">{this.context.tsq}</p>
          </div>
        </div>
      </div>
    );
  }
}
