import React, { PureComponent } from "react";
import "../css/Modal.css";
import { fetchData } from "../searchfunction/algolia";
import { IoIosCloseCircle } from "react-icons/io";
import { MarketDataContext } from "../context/MarketDataContext";
import { CompactDataContext } from "../context/CompactDataContext";
import {
  removeFullScrip,
  removeCompactScrip,
  addCompactScrip,
  addFullScrip,
} from "../scripfunctions/scripfunction";

export default class Modal extends PureComponent {
  static contextType = MarketDataContext;
  constructor(props) {
    super(props);
    this.state = {
      hits: [],
      source: this.props.source,
    };
  }

  fetchResult = async (e) => {
    if (e.target.value.length >= 3) {
      let hits = await fetchData(e.target.value);
      this.setState({ hits });
    }
  };

  addWhichScrip = (i, context, source) => {
    if (source < 1) {
      addFullScrip(this.state.hits[i], this.context);
      this.props.closeModal();
    } else {
      addCompactScrip(this.state.hits[i], context, this.context.ws);
    }
  };

  removeWhichScrip = (i, context) => {
    if (context.compactDataList.includes(this.state.hits[i].code)) {
      removeCompactScrip(this.state.hits[i], context, this.context.ws);
    } else {
      removeFullScrip(this.state.hits[i], this.context);
    }
    this.props.closeModal();
  };

  render() {
    return (
      <CompactDataContext.Consumer>
        {(value) => {
          let result = [];
          for (let i = 0; i < this.state.hits.length; i++) {
            result.push(
              <div className="block" key={i}>
                <div className="symbol">
                  <span className="exchange">NSE</span>
                  {this.state.hits[i].symbol}
                </div>
                {value.compactDataList.includes(this.state.hits[i].code) ||
                this.context.orderInstrumentToken ===
                  this.state.hits[i].code ? (
                  <div
                    className="action remove"
                    onClick={() => this.removeWhichScrip(i, value)}
                  >
                    REMOVE
                  </div>
                ) : (
                  <div
                    className="action add"
                    onClick={() =>
                      this.addWhichScrip(i, value, this.state.source)
                    }
                  >
                    ADD
                  </div>
                )}
              </div>
            );
          }
          return (
            <div className="modal">
              <div className="close" onClick={this.props.closeModal}>
                <IoIosCloseCircle />
              </div>
              <div className="searchbar">
                <input
                  type="text"
                  className="searchbox"
                  placeholder="Enter at least 3 characters of symbol or name"
                  onChange={this.fetchResult}
                  autoFocus
                />
              </div>
              <div className="results">{result}</div>
            </div>
          );
        }}
      </CompactDataContext.Consumer>
    );
  }
}
