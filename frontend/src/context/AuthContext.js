import React, { Component, createContext } from "react";
import { Firebase } from "../config/firebase";

export const AuthContext = createContext();

export default class AuthContextProvider extends Component {
  state = {
    user: "",
    checking: true,
    updateData: (data) => {
      this.setState(data);
    },
  };

  componentDidMount() {
    let that = this;
    Firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        // User is signed in.
        if (user != null) {
          that.setState({ user, checking: false });
        }
      } else {
        // No user is signed in.
        that.setState({ user: "", checking: false });
      }
    });
  }
  render() {
    return (
      <AuthContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </AuthContext.Provider>
    );
  }
}
