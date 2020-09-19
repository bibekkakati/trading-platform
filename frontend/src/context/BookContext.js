import React, { PureComponent, createContext } from "react";

export const BookContext = createContext();

export default class BookContextProvider extends PureComponent {
  state = {
    selectedId: "",
    client_token: "",
    pendingOrders: {},
    completedOrders: {},
    trades: {},
    allOrders: {},
    updateData: (data) => {
      this.setState(data);
    },
  };

  render() {
    return (
      <BookContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </BookContext.Provider>
    );
  }
}
