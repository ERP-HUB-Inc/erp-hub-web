import React from "react";
import { Badge, Button } from "antd";
import {Link} from "react-router-dom";
import dataSource from "./datasource";
import history from "../../../router/history";
import packagejson from "../../../../../../../package.json";
import "./index.css";

export default class SideBar extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      classToggle: "hidden",
      isHoverOnSubMenu: true,
      menuItems: {},
      titleSubmenu: {},
      dataSource
    };
    this.hasUpdated = false;
    this.handleShow = this.handleShow.bind(this);
    this.handleHidden = this.handleHidden.bind(this);
    this.handleHiddenWhenClickOther = this.handleHiddenWhenClickOther.bind(this);
    this.handleHoverOnSubMenu = this.handleHoverOnSubMenu.bind(this);
    this.handleLeaveFromSubMenu = this.handleLeaveFromSubMenu.bind(this);
    this.menuParentItem = this.menuParentItem.bind(this);
    this.subMenuItem = this.subMenuItem.bind(this);
    this.handleOnClickSubMenu = this.handleOnClickSubMenu.bind(this);
  }

  componentDidMount() {
    const element = document.getElementById("center-container");
    const elementTopHeader = document.getElementById("top-header");
    if (element) {
      element.addEventListener("click", this.handleHiddenWhenClickOther);
      element.addEventListener("mouseenter", this.handleHiddenWhenClickOther);
    }

    if (elementTopHeader) {
      elementTopHeader.addEventListener("click", this.handleHiddenWhenClickOther);
      elementTopHeader.addEventListener("mouseenter", this.handleHiddenWhenClickOther);
    }
  }

  handleShow(menu, route) {
    if (menu in this.state.dataSource) {
      const dataMenu = {};
      dataMenu[menu] = this.state.dataSource[menu];
      this.setState({
        menuItems: dataMenu,
        titleSubmenu: dataMenu[menu]["title"],
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

  handleHiddenWhenClickOther() {
    this.handleHidden();
    this.removeClass("hover");
  }

  handleHoverOnSubMenu() {
    this.setState({
      isHoverOnSubMenu: true,
      classToggle: "show"
    });
  }

  handleOnClickSubMenu = async () => {
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
      <li key={key} id={route} className="sidebar-menu-item" onClick={() => this.handleShow(title, route)} onMouseEnter={() => this.handleShow(title, route)}  onMouseLeave={() => this.handleHidden()}>
        <Link to="#"><span className={icon}></span></Link>
        <div className="line"></div>
      </li>
    );
  }

  subMenuItem(key, route, title, createRoute, titleNew, isSeparate) {
    return (
      <li key={key} onClick={() => this.handleOnClickSubMenu()} style={isSeparate ? {borderBottom: "1px solid #ECECEC"} : {}}>
         <Link to={ route } style={{flexGrow: 1}}>
            <div className="item-text item" style={{position: "relative"}}>
               {title}
               <div style={{position: "absolute", top: -16, right: -25}}>
                  {titleNew && <Badge count="New" style={{backgroundColor: "#52c41a", marginLeft: 5}} />}
               </div>
            </div>
         </Link>
         {
            createRoute && <Button onClick={() => history.push(createRoute)} type="primary" icon="plus" className="add-new-btn" style={{marginRight: 10, backgroundColor: "#093163", borderColor: "#093163", borderRadius: 5}} />
         }
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
                <div className="title text-center">{this.state.titleSubmenu}</div>
                <ul className="list-unstyled text-left">
                  {
                    this.state.menuItems[subMenuItemTitle]["subItems"].map((menu, key) => 
                      menu["title"] ? this.subMenuItem(key, menu["route"], menu["title"], menu["createRoute"], menu["new"], menu["isSeparate"]) : ""
                    )
                  }
                </ul>
              </div>
              :
              ""
          }
        </div>
        <div id="version">v{packagejson.version}</div>
      </div>
    );
  }
}
