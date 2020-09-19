import React, { Component } from "react";
import { BrowserRouter as Router, Route, Redirect } from "react-router-dom";
import "./App.css";
import EntryPoint from "./pages/entrypoint";
import Signin from "./pages/signing";
import { AuthContext } from "./context/AuthContext";

class App extends Component {
  static contextType = AuthContext;
  render() {
    return (
      <Router>
        <Route
          path="/"
          render={() => {
            return this.context.user ? (
              <Redirect to="/" />
            ) : (
              <Redirect to="/signin" />
            );
          }}
        />
        <Route exact path="/signin">
          <Signin />
        </Route>
        <Route exact path="/">
          <EntryPoint />
        </Route>
      </Router>
    );
  }
}

export default App;
