import React, { PureComponent, createContext } from "react";

export const MarketDataContext = createContext();

export default class MarketDataContextProvider extends PureComponent {
  state = {
    clientsList: {},
    activeClients: [],
    notification: [],
    ws: "",
    exchange: "",
    exchangeCode: "",
    orderInstrumentToken: "",
    topAskPrice: [0.0, 0.0, 0.0, 0.0, 0.0],
    topAskQty: [0, 0, 0, 0, 0],
    topBidPrice: [0.0, 0.0, 0.0, 0.0, 0.0],
    topBidQty: [0, 0, 0, 0, 0],
    bidmax: 0,
    askmax: 0,
    tbq: 0,
    tsq: 0,
    upperCircuit: "NA",
    lowerCircuit: "NA",
    volume: "NA",
    atp: 0.0,
    openPrice: 0.0,
    highPrice: 0.0,
    lowPrice: 0.0,
    closePrice: 0.0,
    change: 0.0,
    lltp: 0.0,
    ltp: 0.0,
    symbol: "",
    nifty50: {
      ltp: 0.0,
      change: 0.0,
      lltp: 0.0,
    },
    sensex: {
      ltp: 0.0,
      change: 0.0,
      lltp: 0.0,
    },
    updateData: (data) => {
      this.setState(data);
    },
  };

  render() {
    return (
      <MarketDataContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </MarketDataContext.Provider>
    );
  }
}
