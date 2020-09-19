import React, { Component } from "react";
import { MarketDataContext } from "../context/MarketDataContext";
import "../css/NotificationList.css";

export default class NotificationList extends Component {
  static contextType = MarketDataContext;
  render() {
    let divs = [];
    let d,
      h,
      m,
      s = "";
    for (let i = 0; i < this.context.notification.length; i++) {
      d = new Date(Number(this.context.notification[i].time));
      h = d.getHours();
      h = h >= 0 && h < 10 ? "0" + h : h;
      m = d.getMinutes();
      m = m >= 0 && m < 10 ? "0" + m : m;
      s = d.getSeconds();
      s = s >= 0 && s < 10 ? "0" + s : s;
      d = `${h}:${m}:${s}`;
      divs.push(
        <p
          className={"notification " + this.context.notification[i].type}
          key={i}
        >
          {this.context.notification[i].message} <br />
          <span className="time">{d}</span>
        </p>
      );
    }
    return (
      <div className="notificationlist">
        <p className="title">NOTIFICATION</p>

        {divs}
      </div>
    );
  }
}
