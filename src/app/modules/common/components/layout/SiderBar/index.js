import React from "react";
import { Link } from "react-router-dom";
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
    this.menuParentItem = this.menuParentItem.bind(this);
    this.subMenuItem = this.subMenuItem.bind(this);
    this.handleOnClickSubMenu = this.handleOnClickSubMenu.bind(this);
  }

  handleShow(menu, route) {
    if (menu in this.state.dataSource) {
      const dataMenu = {};
      dataMenu[menu] = this.state.dataSource[menu];

      this.setState({
        menuItems: dataMenu,
        isHoverOnSubMenu: true,
        classToggle: "show"
      });
    }

    this.setCurrentHover(route);

  }

  removeClass(className) {
    const allParentLi = document.getElementsByClassName("sidebar-menu-item");
    for (var i=0; i < allParentLi.length; i++) {
      allParentLi[i].classList.remove(className);
    }
  }

  setCurrentHover(element) {
    const currentLi = document.getElementById(element);

    this.removeClass("hover");

    if (currentLi != null) {
      currentLi.className = `${currentLi.className} hover`;; 
    }
  }

  handleHidden() {
    this.setState({
      classToggle: "hidden",
    });
  }

  handleHoverOnSubMenu() {
    this.setState({
      isHoverOnSubMenu: true,
      classToggle: "show"
    });
  }

  handleOnClickSubMenu() {
    this.removeClass("hover");

    this.setState({
      isHoverOnSubMenu: false,
      classToggle: "hidden"
    });
  }
  handleLeaveFromSubMenu(route) {

    const currentLi = document.getElementById(route);
    
    if (currentLi != null) {
      currentLi.classList.remove("hover");
    }

    this.setState({
      isHoverOnSubMenu: false,
      classToggle: "hidden"
    });
  }

  menuParentItem(key, route, title, icon) {

    const currentLi = document.getElementById(route);
	  
    const currentPathArr = window.location.pathname.split("/");
	
    const classActive = route === currentPathArr[1] ? "active" : "";

    if (currentLi != null) {
      if (classActive !== "") {
        this.removeClass("active");
      }
      currentLi.className += " " + classActive;
    }
	
    return (
      <li key={key} id={route} className="sidebar-menu-item" onMouseEnter={() => this.handleShow(title, route)}  onMouseLeave={() => this.handleHidden()}>
        <Link to="#"><span className={icon}></span></Link>
        <div className="line"></div>
      </li>
    );
  }

  subMenuItem(key, route, title, icon) {
    return (
      <li key={key} onClick={() => this.handleOnClickSubMenu()}>
        <Link to={ route }>
          <div className="icon item"><span className={icon}></span></div>
          <div className="item-text item">{title}</div>
        </Link>
      </li>
    );
  }

  render() {
    const subMenuItemTitle = Object.keys(this.state.menuItems);

    if (window.location.pathname === "/") {
      const currentLi = document.getElementById("dashboardNav");
      if (currentLi != null) {
        this.removeClass("active");
        currentLi.className += " active";
      }
    }

    return (
      <div>
        <div id="sidebar">
          <ul className="list-unstyled text-center">
            <li id="dashboardNav" className={window.location.pathname === "/" ? "active sidebar-menu-item" : "sidebar-menu-item"} onMouseEnter={() => this.handleShow("home", "dashboardNav")}  onMouseLeave={() => this.handleHidden()}>
              <Link to="/"><span className="icon-home"></span></Link>
              <div className="line"></div>
            </li>
            {
              Object.keys(this.state.dataSource).map((parentKey, parentIndex) => this.menuParentItem(parentIndex, this.state.dataSource[parentKey]["route"],  parentKey, this.state.dataSource[parentKey]["icon"]))
            }
          </ul>
          <div id="sum-menu" className={this.state.classToggle} onMouseEnter={() => this.handleHoverOnSubMenu()} onMouseLeave={() => this.handleLeaveFromSubMenu(this.state.menuItems[subMenuItemTitle]["route"])}>
            { 
              this.state.classToggle === "show" 
                ?  
                <div>
                  <div className="title text-center text-uppercase">{subMenuItemTitle}</div>
                  <ul className="list-unstyled text-left text-uppercase">
                    {
                      this.state.menuItems[subMenuItemTitle]["subItems"].map((menu, key) => 
                        this.subMenuItem(key, menu["route"], menu["title"], menu["icon"])
                      )
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
