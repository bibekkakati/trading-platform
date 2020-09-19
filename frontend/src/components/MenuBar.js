import React, { PureComponent } from "react";
import "../css/MenuBar.css";
import {
  FaRegUserCircle,
  FaUserFriends,
  FaBookOpen,
  FaSuitcase,
  FaBell,
} from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";

export default class MenuBar extends PureComponent {
  state = {
    menuState: 0,
  };

  openRoute = (menuState) => {
    this.setState({ menuState });
    this.props.openRoute(menuState);
  };

  render() {
    return (
      <div className="menubar">
        <div className="icon user">
          <FaRegUserCircle />
        </div>
        <div className={this.state.menuState === 0 ? "icon active" : "icon"}>
          <AiFillHome onClick={() => this.openRoute(0)} />
        </div>
        <div className={this.state.menuState === 1 ? "icon active" : "icon"}>
          <FaUserFriends onClick={() => this.openRoute(1)} />
        </div>
        <div className={this.state.menuState === 2 ? "icon active" : "icon"}>
          <FaBookOpen onClick={() => this.openRoute(2)} />
        </div>
        <div className={this.state.menuState === 3 ? "icon active" : "icon"}>
          <FaSuitcase onClick={() => this.openRoute(3)} />
        </div>
        <div className="icon">
          <FaBell onClick={this.props.showNotification} />
        </div>
      </div>
    );
  }
}
