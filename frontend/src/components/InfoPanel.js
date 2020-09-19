import React from "react";
import "../css/InfoPanel.css";
import InstrumentData from "./InstrumentData";
import OrderForm from "./OrderForm";
import Clients from "./Clients";

export const InfoPanel = (props) => {
  return (
    <div className="infopanel">
      <InstrumentData />
      <OrderForm updateNotification={props.updateNotification} />
      <Clients />
    </div>
  );
};

export default InfoPanel;
