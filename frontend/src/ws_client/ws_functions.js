const Modes = {
  "1": "marketdata",
  "2": "compact_marketdata",
  "3": "snapquote",
  "4": "full_snapquote",
  "5": "spreaddata",
  "6": "spread_snapquote",
  "7": "dpr",
  "8": "oi",
  "9": "market_status",
  "10": "exchange_messages",
};

const Exchanges = {
  "1": "NSE",
  "2": "NFO",
  "3": "CDS",
  "4": "MCX",
  "6": "BSE",
  "7": "BFO",
};

const Multiplier = {
  "1": 100,
  "2": 100,
  "3": 10000000,
  "4": 100,
  "6": 100,
  "7": 100,
};

const Fixedto = {
  "1": 2,
  "2": 2,
  "3": 4,
  "4": 2,
  "6": 2,
  "7": 2,
};

export const connect = function (token) {
  return new Promise(function (resolve, reject) {
    var ws = new WebSocket(process.env.REACT_APP_WS_URL + token);
    if (ws) {
      ws.onopen = () => {
        setInterval(() => {
          ws.send({ a: "h", v: [], m: "" });
        }, 5000);
        resolve({
          msg: "Connected to WebSocket",
          ws: ws,
        });
      };
      ws.onerror = (evt) => {
        reject({ error: "WebSocket connection failed" });
      };
    } else {
      reject({ error: "WebSocket connection failed" });
    }
  });
};

export const subscribe = function (ws, exchangeTokenList, mode) {
  ws.send(
    JSON.stringify({
      a: "subscribe",
      v: exchangeTokenList,
      m: Modes[mode],
    })
  );
};

export const unsubscribe = function (ws, exchangeTokenList, mode) {
  ws.send(
    JSON.stringify({
      a: "unsubscribe",
      v: exchangeTokenList,
      m: Modes[mode],
    })
  );
};

export const onmessage = function (data) {
  return new Promise((resolve, reject) => {
    var instrumentData = {};
    instrumentData.mode = new DataView(data.slice(0, 1, "int8"));
    instrumentData.mode = instrumentData.mode.getInt8(0).toString(10);
    instrumentData.exchangeCode = new DataView(data.slice(1, 2, "int8"));
    instrumentData.exchangeCode = instrumentData.exchangeCode
      .getInt8(0)
      .toString(10);
    instrumentData.exchange = Exchanges[instrumentData.exchangeCode];
    var multiplier = Multiplier[instrumentData.exchangeCode];
    var fixedto = Fixedto[instrumentData.exchangeCode];
    if (instrumentData.mode === "2") {
      instrumentData.instrumentToken = new DataView(data.slice(2, 6, "int32"));
      instrumentData.instrumentToken = instrumentData.instrumentToken
        .getInt32(0)
        .toString(10);

      instrumentData.ltp = new DataView(data.slice(6, 10, "int32"));
      instrumentData.ltp = instrumentData.ltp.getInt32(0).toString(10);
      instrumentData.ltp = (instrumentData.ltp / multiplier).toFixed(2);

      instrumentData.change = new DataView(data.slice(10, 14, "int32"));
      instrumentData.change = instrumentData.change.getInt32(0).toString(10);
      instrumentData.change = (instrumentData.change / multiplier).toFixed(
        fixedto
      );
    } else if (instrumentData.mode === "1") {
      instrumentData.orderInstrumentToken = new DataView(
        data.slice(2, 6, "int32")
      );
      instrumentData.orderInstrumentToken = instrumentData.orderInstrumentToken
        .getInt32(0)
        .toString(10);

      instrumentData.volume = new DataView(data.slice(18, 22, "int32"));
      instrumentData.volume = instrumentData.volume.getInt32(0).toString(10);

      instrumentData.ltp = new DataView(data.slice(6, 10, "int32"));
      instrumentData.ltp = instrumentData.ltp.getInt32(0).toString(10);
      instrumentData.ltp = (instrumentData.ltp / multiplier).toFixed(fixedto);

      instrumentData.tbq = new DataView(data.slice(38, 46, "int64"));
      instrumentData.tbq = instrumentData.tbq.getBigInt64(0).toString(10);

      instrumentData.tsq = new DataView(data.slice(46, 54, "int64"));
      instrumentData.tsq = instrumentData.tsq.getBigInt64(0).toString(10);

      instrumentData.atp = new DataView(data.slice(54, 58, "int32"));
      instrumentData.atp = instrumentData.atp.getInt32(0).toString(10);
      instrumentData.atp = (instrumentData.atp / multiplier).toFixed(fixedto);

      instrumentData.openPrice = new DataView(data.slice(62, 66, "int32"));
      instrumentData.openPrice = instrumentData.openPrice
        .getInt32(0)
        .toString(10);
      instrumentData.openPrice = (
        instrumentData.openPrice / multiplier
      ).toFixed(fixedto);

      instrumentData.highPrice = new DataView(data.slice(66, 70, "int32"));
      instrumentData.highPrice = instrumentData.highPrice
        .getInt32(0)
        .toString(10);
      instrumentData.highPrice = (
        instrumentData.highPrice / multiplier
      ).toFixed(fixedto);

      instrumentData.lowPrice = new DataView(data.slice(70, 74, "int32"));
      instrumentData.lowPrice = instrumentData.lowPrice
        .getInt32(0)
        .toString(10);
      instrumentData.lowPrice = (instrumentData.lowPrice / multiplier).toFixed(
        fixedto
      );

      instrumentData.closePrice = new DataView(data.slice(74, 78, "int32"));
      instrumentData.closePrice = instrumentData.closePrice
        .getInt32(0)
        .toString(10);
      instrumentData.closePrice = (
        instrumentData.closePrice / multiplier
      ).toFixed(fixedto);

      instrumentData.change = (
        instrumentData.ltp - instrumentData.closePrice
      ).toFixed(fixedto);
    } else if (instrumentData.mode === "3") {
      instrumentData.orderInstrumentToken = new DataView(
        data.slice(2, 6, "int32")
      );
      instrumentData.orderInstrumentToken = instrumentData.orderInstrumentToken
        .getInt32(0)
        .toString(10);

      let topBidPrice = [];
      let topAskPrice = [];
      let topBidQty = [];
      let topAskQty = [];
      let bidmax = 0;
      let askmax = 0;
      for (let i = 0; i < 5; i++) {
        let bidprice = new DataView(
          data.slice(26 + i * 4, 30 + i * 4, "int32")
        );
        let bidqty = new DataView(data.slice(46 + i * 4, 50 + i * 4, "int32"));
        let askprice = new DataView(
          data.slice(86 + i * 4, 90 + i * 4, "int32")
        );
        let askqty = new DataView(
          data.slice(106 + i * 4, 110 + i * 4, "int32")
        );

        bidprice = (bidprice.getInt32(0).toString(10) / multiplier).toFixed(
          fixedto
        );
        bidqty = bidqty.getInt32(0).toString(10);
        bidqty = parseInt(bidqty);
        bidmax = Math.max(bidmax, bidqty);

        askprice = (askprice.getInt32(0).toString(10) / multiplier).toFixed(
          fixedto
        );
        askqty = askqty.getInt32(0).toString(10);
        askqty = parseInt(askqty);
        askmax = Math.max(askmax, askqty);

        topBidPrice[i] = bidprice;
        topBidQty[i] = bidqty;
        topAskPrice[i] = askprice;
        topAskQty[i] = askqty;
      }
      instrumentData.topBidPrice = topBidPrice;
      instrumentData.topAskPrice = topAskPrice;
      instrumentData.topBidQty = topBidQty;
      instrumentData.topAskQty = topAskQty;
      instrumentData.bidmax = bidmax;
      instrumentData.askmax = askmax;
    }

    resolve(instrumentData);
  });
};

export default {
  connect: connect,
  onmessage: onmessage,
  subscribe: subscribe,
  unsubscribe: unsubscribe,
};
