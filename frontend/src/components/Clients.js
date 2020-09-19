import React, { PureComponent } from "react";
import "../css/Clients.css";
import "../css/ToggleSwitch.css";
import { MarketDataContext } from "../context/MarketDataContext";

export default class Clients extends PureComponent {
  static contextType = MarketDataContext;

  addToActiveList = (clientid) => {
    let arr = [...this.context.activeClients];
    if (!arr.includes(clientid)) {
      arr.push(clientid);
      this.context.updateData({
        activeClients: arr,
      });
    }
  };

  removeFromActiveList = (clientid) => {
    let arr = [...this.context.activeClients];
    let i = arr.indexOf(clientid);
    if (i > -1) {
      arr.splice(i, 1);
      this.context.updateData({
        activeClients: arr,
      });
    }
  };

  render() {
    let divs = [];
    for (const clientid in this.context.clientsList) {
      let val = this.context.activeClients.includes(clientid);
      divs.push(
        <div className="client" key={clientid}>
          <div className="clientid">
            <p>{clientid}</p>
          </div>
          <label className="switch">
            <input
              type="checkbox"
              value={val}
              onChange={
                val
                  ? () => this.removeFromActiveList(clientid)
                  : () => this.addToActiveList(clientid)
              }
            />
            <span className="slider round"></span>
          </label>
        </div>
      );
    }
    return <div className="clientslist">{divs}</div>;
  }
}
