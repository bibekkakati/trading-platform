import * as socket from "../ws_client/ws_functions";

export const removeFullScrip = (hits, context) => {
  var scrip = hits;
  if (scrip.code === context.orderInstrumentToken) {
    socket.unsubscribe(context.ws, [[scrip.exchange_code, scrip.code]], "1");
    socket.unsubscribe(context.ws, [[scrip.exchange_code, scrip.code]], "3");
    context.updateData({
      exchange: "",
      exchangeCode: "",
      mode: "",
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
    });
    localStorage.removeItem("currentFullScrip");
  }
};

export const addFullScrip = (hits, context) => {
  var scrip = hits;
  if (context.orderInstrumentToken && context.symbol) {
    socket.unsubscribe(
      context.ws,
      [[context.exchangeCode, context.orderInstrumentToken]],
      "1"
    );
    socket.unsubscribe(
      context.ws,
      [[context.exchangeCode, context.orderInstrumentToken]],
      "3"
    );
  }

  context.updateData({
    orderInstrumentToken: scrip.code,
    exchangeCode: scrip.exchange_code,
    symbol: scrip.symbol,
    exchange: scrip.exchange,
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
  });
  socket.subscribe(context.ws, [[scrip.exchange_code, scrip.code]], "1");
  socket.subscribe(context.ws, [[scrip.exchange_code, scrip.code]], "3");
  localStorage.setItem(
    "currentFullScrip",
    JSON.stringify({
      actionData: [scrip.exchange_code, scrip.code],
      symbol: scrip.symbol,
      exchange: scrip.exchange,
    })
  );
};

export const addCompactScrip = (hits, context, ws) => {
  let scrip = hits;
  let compactDataList = [...context.compactDataList];
  let instruments = [...context.instruments];
  let data = {
    exchangeCode: scrip.exchange_code,
    exchange: scrip.exchange,
    symbol: scrip.symbol,
    token: scrip.code,
    ltp: 0.0,
    lltp: 0.0,
    change: 0.0,
  };
  instruments.push(data);
  compactDataList.push(scrip.code);
  context.updateData({
    instruments,
    compactDataList,
  });
  localStorage.setItem("compactDataList", JSON.stringify(compactDataList));
  instruments = JSON.parse(localStorage.getItem("instruments"));
  if (instruments) {
    instruments.push({
      exchangeCode: scrip.exchange_code,
      exchange: scrip.exchange,
      symbol: scrip.symbol,
      token: scrip.code,
    });
  } else {
    instruments = [];
    instruments.push({
      exchangeCode: scrip.exchange_code,
      exchange: scrip.exchange,
      symbol: scrip.symbol,
      token: scrip.code,
    });
  }
  localStorage.setItem("instruments", JSON.stringify(instruments));
  socket.subscribe(ws, [[scrip.exchange_code, scrip.code]], "2");
};

export const removeCompactScrip = (hits, context, ws) => {
  let scrip = hits;
  let compactDataList = [...context.compactDataList];
  let instruments = [...context.instruments];
  let index = compactDataList.indexOf(scrip.code);
  socket.unsubscribe(ws, [[scrip.exchange_code, scrip.code]], "2");
  if (index > -1) {
    compactDataList.splice(index, 1);
    instruments.splice(index, 1);
  }
  context.updateData({
    instruments,
    compactDataList,
  });
  instruments = JSON.parse(localStorage.getItem("instruments"));
  if (instruments) {
    instruments.splice(index, 1);
    localStorage.setItem("instruments", JSON.stringify(instruments));
  }
  localStorage.setItem("compactDataList", JSON.stringify(compactDataList));
};

export default {
  removeFullScrip,
  addFullScrip,
  removeCompactScrip,
  addCompactScrip,
};
