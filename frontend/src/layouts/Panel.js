import React, { PureComponent } from "react";
import "./Panel.css";
import * as socket from "../ws_client/ws_functions";
import { MarketDataContext } from "../context/MarketDataContext";
import { CompactDataContext } from "../context/CompactDataContext";

export default class Panel extends PureComponent {
  static contextType = MarketDataContext;
  constructor(props) {
    super(props);
    this.state = {
      ws: false,
      online: false,
    };
  }

  componentDidMount = () => {
    this.setState({ online: true });
    this.connectWebsocket();
    window.addEventListener("offline", (e) => {
      this.setState({ online: false });
      console.log("offline");
    });
    window.addEventListener("online", (e) => {
      this.setState({ online: true });
      if (!this.state.ws) {
        this.connectWebsocket();
      }
      console.log("online");
    });
  };

  connectWebsocket = async () => {
    await this.loadClients();
    var token = "";
    if (this.context.activeClients.length > 0) {
      token = this.context.clientsList[this.context.activeClients[0]];
    }
    socket
      .connect(token)
      .then((obj) => {
        this.ws = obj.ws;
        this.context.updateData({ ws: obj.ws });
        console.log(obj.msg);
        this.setState({ ws: true });
        this.currentScrip();
        this.currentInstruments();
        this.loadIndex();
        this.ws.onmessage = (evt) => {
          evt.data.arrayBuffer().then(async (blob) => {
            var data = await socket.onmessage(blob);

            this.whichStatesToUpdate(data);
          });
        };

        this.ws.onerror = (evt) => {
          console.log(`Websocket connection closed`);
        };

        this.ws.onclose = (evt) => {
          this.setState({ ws: false });
          this.context.updateData({ ws: "" });
          if (evt.wasClean) {
            console.log(`Websocket connection closed`);
          } else {
            console.log("Websocket connection disconnected");
          }
          if (this.state.online) {
            this.connectWebsocket();
          }
        };
      })
      .catch((msg) => {
        console.log(msg.error);
      });
  };

  loadClients = () => {
    return new Promise((resolve) => {
      var clients = localStorage.getItem("clientslist");
      var clientToken;
      var clientsList = {};
      var activeClients = [];
      if (clients !== null) {
        clients = JSON.parse(clients);
        for (const clientid in clients) {
          clientToken = localStorage.getItem(clientid);
          if (clientToken !== null) {
            clientsList[clientid] = clientToken;
            activeClients.push(clientid);
          }
        }
      }
      this.context.updateData({ clientsList, activeClients });
      resolve(true);
    });
  };

  loadIndex = () => {
    socket.subscribe(this.ws, [[1, 26000]], "2");
    socket.subscribe(this.ws, [[6, 1]], "2");
  };

  currentScrip = () => {
    return new Promise((resolve) => {
      var currentFullScrip = localStorage.getItem("currentFullScrip");
      if (currentFullScrip) {
        currentFullScrip = JSON.parse(currentFullScrip);
        socket.subscribe(this.ws, [currentFullScrip.actionData], "1");
        socket.subscribe(this.ws, [currentFullScrip.actionData], "3");
        this.context.updateData({
          symbol: currentFullScrip.symbol,
          exchange: currentFullScrip.exchange,
          orderInstrumentToken: currentFullScrip.actionData[1],
          exchangeCode: currentFullScrip.actionData[0],
        });
      }
      resolve(true);
    });
  };

  currentInstruments = () => {
    return new Promise((resolve) => {
      let compactDataList = JSON.parse(localStorage.getItem("compactDataList"));
      let instruments = JSON.parse(localStorage.getItem("instruments"));
      if (compactDataList && instruments) {
        this.compactContext.updateData({
          compactDataList,
          instruments,
        });
      } else {
        resolve(true);
      }
      let scrip = "";
      for (let i = 0; i < instruments.length; i++) {
        scrip = instruments[i];
        socket.subscribe(this.ws, [[scrip.exchangeCode, scrip.token]], "2");
      }
      resolve(true);
    });
  };

  whichStatesToUpdate = (data) => {
    switch (data.mode) {
      case "1":
        data.lltp =
          data.ltp === this.context.ltp ? this.context.lltp : this.context.ltp;
        this.updateMarketData(data);
        break;
      case "3":
        this.updateMarketData(data);
        break;
      case "2":
        this.updateCompactData(data);
        break;
      default:
        break;
    }
  };

  updateMarketData = (data) => {
    this.context.updateData(data);
  };

  updateCompactData = (data) => {
    if (data.instrumentToken === "26000") {
      var nifty50 = {
        ltp: data.ltp,
        change: data.change,
        lltp:
          data.ltp === this.context.nifty50.ltp
            ? this.context.nifty50.lltp
            : this.context.nifty50.ltp,
      };
      this.context.updateData({
        nifty50,
      });
    } else if (data.instrumentToken === "1") {
      var sensex = {
        ltp: data.ltp,
        change: data.change,
        lltp:
          data.ltp === this.context.sensex.ltp
            ? this.context.sensex.lltp
            : this.context.sensex.ltp,
      };
      this.context.updateData({
        sensex,
      });
    } else {
      let instruments = [...this.compactContext.instruments];
      for (let i = 0; i < instruments.length; i++) {
        if (instruments[i].token === data.instrumentToken) {
          let ud = { ...instruments[i] };
          ud.ltp = data.ltp;
          ud.lltp =
            data.ltp === instruments[i].ltp
              ? instruments[i].lltp
              : instruments[i].ltp;
          ud.change = data.change;
          instruments[i] = ud;

          this.compactContext.updateData({
            instruments,
          });
          return;
        }
      }
    }
  };

  updateContext = (value) => {
    this.compactContext = value;
  };

  render() {
    return (
      <CompactDataContext.Consumer>
        {(value) => {
          this.updateContext(value);
          return <div className="panel">{this.props.children}</div>;
        }}
      </CompactDataContext.Consumer>
    );
  }
}
