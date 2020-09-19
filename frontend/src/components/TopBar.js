import React, { PureComponent } from "react";
import "../css/TopBar.css";
import "../css/DataChange.css";
import {
  FiPlusCircle,
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight,
} from "react-icons/fi";
import { MarketDataContext } from "../context/MarketDataContext";
import { withRouter } from "react-router-dom";
import { Firebase } from "../config/firebase";

class TopBar extends PureComponent {
  static contextType = MarketDataContext;
  state = {
    signoutdisplay: "none",
    photoURL: "",
  };

  componentDidMount = () => {
    var user = JSON.parse(localStorage.getItem("userdata"));
    if (user != null) {
      this.setState({ photoURL: user.photoURL });
    } else {
      user = Firebase.auth().currentUser;
      if (user) {
        this.setState({ photoURL: user.photoURL });
      }
    }
  };

  openModal = () => {
    this.props.openModal("0");
  };

  openAddClientModal = () => {
    this.props.openAddClientModal();
  };

  signout = () => {
    this.setState({ signoutdisplay: "none" });
    Firebase.auth()
      .signOut()
      .then(() => {
        localStorage.removeItem("authtoken");
        this.props.history.push("/");
      })
      .catch((error) => {
        if (error) {
          alert(error);
        }
      });
  };

  profileClicked = () => {
    if (this.state.signoutdisplay === "none") {
      this.setState({ signoutdisplay: "block" });
    } else {
      this.setState({ signoutdisplay: "none" });
    }
  };

  render() {
    let changeSignSensex = Math.sign(
      this.context.sensex.ltp - this.context.sensex.lltp
    ).toString();
    let changeSignNifty50 = Math.sign(
      this.context.nifty50.ltp - this.context.nifty50.lltp
    ).toString();
    let sensextrend =
      this.context.sensex.change >= 0 ? (
        <FiArrowUpRight className="up" />
      ) : (
        <FiArrowDownRight className="down" />
      );
    let nifty50trend =
      this.context.nifty50.change >= 0 ? (
        <FiArrowUpRight className="up" />
      ) : (
        <FiArrowDownRight className="down" />
      );
    return (
      <div className="topbar">
        <p className="title">My Dashboard</p>
        <div className="liveindex">
          <div className="ticker">
            <p className="index">SENSEX</p>

            <div className="tick">
              <p className="point" data-change={changeSignSensex}>
                {this.context.sensex.ltp}
              </p>
              <p className="change">
                ({this.context.sensex.change} {sensextrend})
              </p>
            </div>
          </div>
          <div className="ticker">
            <p className="index">NIFTY 50</p>
            <div className="tick">
              <p className="point" data-change={changeSignNifty50}>
                {this.context.nifty50.ltp}
              </p>
              <p className="change">
                ({this.context.nifty50.change} {nifty50trend})
              </p>
            </div>
          </div>
        </div>
        <div className="right">
          <button className="addclient" onClick={this.openAddClientModal}>
            <FiPlusCircle className="plusicon" /> &nbsp;&nbsp; ADD CLIENT
          </button>

          <div className="search" onClick={this.openModal}>
            <FiSearch />
          </div>
          <img
            src={this.state.photoURL}
            alt=""
            className="profile"
            onClick={this.profileClicked}
          />
          <p
            className="signout"
            style={{ display: this.state.signoutdisplay }}
            onClick={this.signout}
          >
            Sign Out
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(TopBar);
