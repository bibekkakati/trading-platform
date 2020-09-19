import React, { Component } from "react";
import "../css/AddClient.css";
import { login } from "../api_calls/api_functions";
import { MarketDataContext } from "../context/MarketDataContext";

export default class AddClient extends Component {
  static contextType = MarketDataContext;
  constructor(props) {
    super(props);
    this.state = {
      clientid: "",
      password: "",
      secretkey: "",
      twofa: "",
      logging: false,
      error: false,
      error_msg: "",
      success: false,
    };
  }

  closeAddClientModal = () => {
    this.props.closeAddClientModal();
  };

  updateValue = (e) => {
    this.setState({
      [e.target.id]: e.target.value,
      error: false,
      success: false,
    });
  };

  login = () => {
    let data = {
      clientid: this.state.clientid.trim(),
      password: this.state.password.trim(),
      secretkey: this.state.secretkey.trim(),
      twofa: this.state.twofa.trim(),
    };
    if (data.clientid && data.password && data.secretkey && data.twofa) {
      this.setState({ logging: true, error: false });
      login(data.clientid, data.secretkey, data.password, data.twofa)
        .then((response) => {
          if (response.type === "data") {
            localStorage.setItem(data.clientid, response.access_token);
            let clientsList = { ...this.context.clientsList };
            let activeClients = [...this.context.activeClients];
            clientsList[data.clientid] = response.access_token;
            if (!activeClients.includes(data.clientid)) {
              activeClients.push(data.clientid);
            }
            this.context.updateData({
              clientsList: clientsList,
              activeClients: activeClients,
            });
            let clients = localStorage.getItem("clientslist");
            if (clients !== null) {
              clients = JSON.parse(clients);
              clients[data.clientid] = data;
              localStorage.setItem("clientslist", JSON.stringify(clients));
            } else {
              localStorage.setItem(
                "clientslist",
                JSON.stringify({ [data.clientid]: data })
              );
            }
            this.setState({
              success: true,
              logging: false,
              error: false,
            });
          } else if (response.type === "error") {
            this.setState({
              logging: false,
              error: true,
              error_msg: response.msg + "!",
            });
          }
        })
        .catch((error) => {
          this.setState({
            logging: false,
            error: true,
            error_msg: "Server not found!",
          });
        });
    } else {
      this.setState({
        logging: false,
        error: true,
        error_msg: "All fields are required!",
      });
    }
  };

  render() {
    return (
      <div className="addclientmodal">
        <div className="form">
          <div className="account">
            <label htmlFor="clientid" className="label">
              Client Id
            </label>
            <input
              type="text"
              className="input"
              id="clientid"
              onChange={this.updateValue}
            />
            <label htmlFor="password" className="label">
              Password
            </label>
            <input
              type="password"
              className="input"
              id="password"
              onChange={this.updateValue}
            />
            <label htmlFor="secretkey" className="label">
              Secret Key
            </label>
            <input
              type="password"
              className="input"
              id="secretkey"
              onChange={this.updateValue}
            />
            <label htmlFor="twofa" className="label">
              Two FA
            </label>
            <input
              type="password"
              className="input"
              id="twofa"
              onChange={this.updateValue}
            />
          </div>
          {this.state.error && !this.state.success ? (
            <p className="error">{this.state.error_msg}</p>
          ) : null}
          {!this.state.error && this.state.success ? (
            <p className="success">Success!</p>
          ) : null}
          <div className="actionbtn">
            <button
              className="btn login"
              onClick={this.login}
              disabled={this.state.logging}
            >
              {this.state.logging ? (
                <div className="dotloader">
                  <div className="dot"></div>
                  <div className="dot"></div>
                  <div className="dot"></div>
                </div>
              ) : (
                "LOGIN"
              )}
            </button>
            <button
              className="btn cancel"
              onClick={this.closeAddClientModal}
              disabled={this.state.logging}
            >
              CANCEL
            </button>
          </div>
        </div>
      </div>
    );
  }
}
