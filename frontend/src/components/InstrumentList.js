import React, { PureComponent } from "react";
import "../css/InstrumentList.css";
import "../css/DataChange.css";
import {
  IoIosArrowRoundForward,
  IoIosArrowRoundBack,
  IoIosAdd,
  IoIosClose,
} from "react-icons/io";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";
import { CompactDataContext } from "../context/CompactDataContext";
import { MarketDataContext } from "../context/MarketDataContext";
import {
  removeCompactScrip,
  addFullScrip,
} from "../scripfunctions/scripfunction";

export default class InstrumentList extends PureComponent {
  static contextType = CompactDataContext;
  constructor(props) {
    super(props);
    this.scroll = React.createRef();
  }

  checkTrendDirection = (index) => {
    return index.ltp >= index.close ? (
      <FiArrowUpRight className="up" />
    ) : (
      <FiArrowDownRight className="down" />
    );
  };

  scrollRight = () => {
    if (this.scroll.current) {
      this.scroll.current.scrollLeft += 340;
    }
  };

  scrollLeft = () => {
    if (this.scroll.current) {
      this.scroll.current.scrollLeft -= 340;
    }
  };

  openModal = (i) => {
    this.props.openModal(i);
  };

  removeScrip = (value, index) => {
    let instruments = [...this.context.instruments];
    let hits = {};
    hits.exchange_code = instruments[index].exchangeCode;
    hits.code = instruments[index].token;
    removeCompactScrip(hits, this.context, value.ws);
  };

  moveScrip = (value, index) => {
    let hits = {};
    hits.exchange_code = this.context.instruments[index].exchangeCode;
    hits.code = this.context.instruments[index].token;
    hits.symbol = this.context.instruments[index].symbol;
    hits.exchange = this.context.instruments[index].exchange;
    this.removeScrip(value, index);
    addFullScrip(hits, value);
  };

  render() {
    return (
      <MarketDataContext.Consumer>
        {(value) => {
          let insdivs = [];
          for (let i = 0; i < this.context.instruments.length; i++) {
            let trend =
              this.context.instruments[i].change >= 0 ? (
                <FiArrowUpRight className="up" />
              ) : (
                <FiArrowDownRight className="down" />
              );
            let changeSign = Math.sign(
              this.context.instruments[i].ltp - this.context.instruments[i].lltp
            ).toString();
            insdivs.push(
              <div
                className="instrument"
                key={i}
                onDoubleClick={() => this.moveScrip(value, i)}
              >
                <div className="scripaction">
                  <IoIosClose
                    className="removesign"
                    onClick={() => this.removeScrip(value, i)}
                  />
                </div>
                <p className="index">{this.context.instruments[i].symbol}</p>
                <small className="exch">
                  {this.context.instruments[i].exchange}
                </small>
                <div className="tick">
                  <p className="point" data-change={changeSign}>
                    {this.context.instruments[i].ltp}
                  </p>
                  <p className="change">
                    ({this.context.instruments[i].change} {trend})
                  </p>
                </div>
              </div>
            );
          }
          return (
            <div className="instrumentlist">
              <div className="controller">
                <IoIosArrowRoundBack
                  className="arrow"
                  onClick={this.scrollLeft}
                />
                <IoIosArrowRoundForward
                  className="arrow"
                  onClick={this.scrollRight}
                />
              </div>
              <div className="instrumentcards" ref={this.scroll}>
                {insdivs}
                <div
                  className="addScripButton"
                  onClick={() => this.openModal("1")}
                >
                  <IoIosAdd className="addbtn" />
                </div>
                &nbsp;
              </div>
            </div>
          );
        }}
      </MarketDataContext.Consumer>
    );
  }
}
