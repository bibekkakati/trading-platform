import React, { PureComponent, createContext } from "react";

export const CompactDataContext = createContext();

export default class CompactDataContextProvider extends PureComponent {
  state = {
    instruments: [],
    compactDataList: [],
    updateData: (data) => {
      this.setState(data);
    },
  };

  render() {
    return (
      <CompactDataContext.Provider value={{ ...this.state }}>
        {this.props.children}
      </CompactDataContext.Provider>
    );
  }
}
