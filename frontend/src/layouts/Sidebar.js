import React from "react";
import "./Sidebar.css";
import MenuBar from "../components/MenuBar";

export const Sidebar = (props) => {
  return (
    <div className="sidebar">
      <MenuBar
        openRoute={props.openRoute}
        showNotification={props.showNotification}
      />
    </div>
  );
};

export default Sidebar;
