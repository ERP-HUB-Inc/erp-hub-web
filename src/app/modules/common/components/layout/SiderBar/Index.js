import React from "react";
import dataSource from "./datasource";
import "./index.css";

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classToggle: "hidden",
      isHoverOnSubMenu: true,
      menuItems: {},
      dataSource
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleHidden = this.handleHidden.bind(this);
    this.handleHoverOnSubMenu = this.handleHoverOnSubMenu.bind(this);
    this.handleLeaveFromSubMenu = this.handleLeaveFromSubMenu.bind(this);
  }

  handleShow(menu) {
    if (menu in this.state.dataSource) {
      const dataMenu = {};
      dataMenu[menu] = this.state.dataSource[menu];
      this.setState({
        menuItems: dataMenu,
        isHoverOnSubMenu: true,
        classToggle: "show"
      });
    }
  }

  handleHidden() {
    this.setState({classToggle: "hidden"});
  }

  handleHoverOnSubMenu() {
    this.setState({
      isHoverOnSubMenu: true,
      classToggle: "show"
    });
  }

  handleLeaveFromSubMenu() {
    this.setState({
      isHoverOnSubMenu: false,
      classToggle: "hidden"
    });
  }

  removeClassCurrentlyHover() {
    const oldElement = document.querySelectorAll(".sidebar-menu-item");
    oldElement.classList.remove("hover");
  }

  render() {
    const subMenuItemTitle = Object.keys(this.state.menuItems);
    return (
      <div>
        <div id="sidebar">
          <ul className="list-unstyled text-center">
            <li className="active"><a href="#"><span className="icon-home"></span></a></li>
            <li id="transactions" className="sidebar-menu-item" onMouseEnter={() => this.handleShow("transactions")}  onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-list"></span></a>
            </li>
            <li id="products" className="sidebar-menu-item" onMouseEnter={() => this.handleShow("products")} onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-items"></span></a>
            </li>
            <li id="stock" className="sidebar-menu-item" onMouseEnter={() => this.handleShow("stock")} onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-stock"></span></a>
            </li>
            <li onMouseEnter={() => this.handleShow("customer")} onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-customer"></span></a>
            </li>
            <li onMouseEnter={() => this.handleShow("employee")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-employee"></span></a></li>
            <li onMouseEnter={() => this.handleShow("report")} onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-reports"></span></a>
            </li>
            <li onMouseEnter={() => this.handleShow("setting")} onMouseLeave={() => this.handleHidden()}>
              <a href="#"><span className="icon-settings"></span></a>
            </li>
          </ul>
          <div id="sum-menu" className={this.state.classToggle} onMouseEnter={() => this.handleHoverOnSubMenu()} onMouseLeave={() => this.handleLeaveFromSubMenu()}>
            { 
              this.state.classToggle == "show" 
                ?  
                <div>
                  <div className="title text-center text-uppercase">{subMenuItemTitle}</div>
                  <ul className="list-unstyled text-left text-uppercase">
                    {
                      this.state.menuItems[subMenuItemTitle].map((menu, key) => <li key={key}><a href="#"><div className="icon item"><span className={menu["icon"]}></span></div><div className="item-text item">{menu["title"]}</div></a></li>)
                    }
                  </ul>
                </div>
                :
                ""
            }
          </div>
          <div id="version">V1.0.0</div>
        </div>
      </div>
    );
  }
}
