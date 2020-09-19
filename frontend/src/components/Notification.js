import React, { Component } from "react";
import "../css/Notification.css";

export default class Notification extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  static getDerivedStateFromProps(props, state) {
    setTimeout(() => {
      props.updateNotification("", false);
    }, 2500);
    return null;
  }

  render() {
    return (
      <div className="notifycard">
        <div className={"notificationcard " + this.props.notification.type}>
          {this.props.notification.message}
        </div>
      </div>
    );
  }
}
