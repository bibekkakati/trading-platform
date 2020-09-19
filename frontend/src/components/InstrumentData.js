import React, { PureComponent } from "react";
import "../css/InstrumentData.css";
import Depth from "./Depth";
import { MarketDataContext } from "../context/MarketDataContext";

export default class InstrumentData extends PureComponent {
  static contextType = MarketDataContext;

  render() {
    return (
      <div className="instrumentdata">
        <Depth />
        <div className="details">
          <div className="row">
            <div className="block">
              <p className="key">Volume</p>
              <p className="value lv">{this.context.volume}</p>
            </div>
            <div className="block">
              <p className="key rv">Open</p>
              <p className="value">{this.context.openPrice}</p>
            </div>
          </div>
          <div className="row">
            <div className="block">
              <p className="key">Upper Circuit</p>
              <p className="value lv">{this.context.upperCircuit}</p>
            </div>
            <div className="block">
              <p className="key rv">High</p>
              <p className="value">{this.context.highPrice}</p>
            </div>
          </div>
          <div className="row">
            <div className="block">
              <p className="key">Lower Circuit</p>
              <p className="value lv">{this.context.lowerCircuit}</p>
            </div>
            <div className="block">
              <p className="key rv">Low</p>
              <p className="value">{this.context.lowPrice}</p>
            </div>
          </div>
          <div className="row">
            <div className="block">
              <p className="key">ATP</p>
              <p className="value lv">{this.context.atp}</p>
            </div>
            <div className="block">
              <p className="key rv">Close</p>
              <p className="value">{this.context.closePrice}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
