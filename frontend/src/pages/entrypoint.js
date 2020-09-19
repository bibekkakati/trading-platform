import React, { PureComponent } from "react";
import "../App.css";
import Sidebar from "../layouts/Sidebar";
import Panel from "../layouts/Panel";
import MarketDataContextProvider from "../context/MarketDataContext";
import CompactDataContextProvider from "../context/CompactDataContext";
import BookContextProvider from "../context/BookContext";
import TopBar from "../components/TopBar";
import InstrumentList from "../components/InstrumentList";
import InfoPanel from "../components/InfoPanel";
import Modal from "../components/Modal";
import AddClient from "../components/AddClient";
import OrderBook from "../components/OrderBook";
import Notification from "../components/Notification";
import NotificationList from "../components/NotificationList";
import AllOrder from "../components/AllOrder";
import AutoLogin from "../components/AutoLogin";

export default class entrypoint extends PureComponent {
  state = {
    isLoading: true,
    openModal: false,
    source: "",
    openAddClientModal: false,
    menuState: 0,
    notification: "",
    notify: false,
    showNotification: false,
  };

  componentDidMount = () => {
    this.setState({ isLoading: false });
  };

  updateNotification = (notification, notify) => {
    this.setState({ notification, notify });
  };

  showNotification = () => {
    this.setState({ showNotification: !this.state.showNotification });
  };

  openRoute = (menuState) => {
    this.setState({ menuState });
  };

  openModal = (source) => {
    this.setState({ openModal: !this.state.openModal, source: source });
  };
  openAddClientModal = () => {
    this.setState({ openAddClientModal: !this.state.openAddClientModal });
  };
  render() {
    let menuDivs = [
      <InfoPanel updateNotification={this.updateNotification} />,
      <AutoLogin updateNotification={this.updateNotification} />,
      <OrderBook updateNotification={this.updateNotification} />,
      <AllOrder updateNotification={this.updateNotification} />,
    ];
    return this.state.isLoading ? (
      <div className="loader">
        <div className="LoaderBalls">
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
          <div className="LoaderBalls__item"></div>
        </div>
      </div>
    ) : (
      <div className="app">
        <Sidebar
          openRoute={this.openRoute}
          showNotification={this.showNotification}
        />
        <MarketDataContextProvider>
          <CompactDataContextProvider>
            <BookContextProvider>
              <Panel>
                {this.state.showNotification ? <NotificationList /> : null}
                {this.state.openModal ? (
                  <Modal
                    closeModal={this.openModal}
                    source={this.state.source}
                  />
                ) : null}

                {this.state.openAddClientModal ? (
                  <AddClient closeAddClientModal={this.openAddClientModal} />
                ) : null}

                <TopBar
                  openModal={this.openModal}
                  openAddClientModal={this.openAddClientModal}
                />

                <InstrumentList openModal={this.openModal} />

                {menuDivs[this.state.menuState]}

                {this.state.notify && this.state.notification ? (
                  <Notification
                    notification={this.state.notification}
                    updateNotification={this.updateNotification}
                  />
                ) : null}
              </Panel>
            </BookContextProvider>
          </CompactDataContextProvider>
        </MarketDataContextProvider>
      </div>
    );
  }
}
