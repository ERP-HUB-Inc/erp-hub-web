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

  menuParentItem(key, route, title, icon) {
	  
	const currentPathArr = window.location.pathname.split("/");
	
	const classActive = route==currentPathArr[1] ? "active" : "";
	
    return (
      <li key={key} id={title} className={classActive + " sidebar-menu-item"} onMouseEnter={() => this.handleShow(title)}  onMouseLeave={() => this.handleHidden()}>
        <a href="javascript:;"><span className={icon}></span></a>
		<div className="line"></div>
      </li>
    );
  }

  subMenuItem(key, route, title, icon) {
    return (
      <li key={key}>
        <Link to={ route }>
          <div className="icon item"><span className={icon}></span></div>
          <div className="item-text item">{title}</div>
        </Link>
      </li>
    );
  }

  render() {
    const subMenuItemTitle = Object.keys(this.state.menuItems);
    return (
      <div>
        <div id="sidebar">
          <ul className="list-unstyled text-center">
            <li className={window.location.pathname=="/" ? "active" : ""}>
				<Link to="/"><span className="icon-home"></span></Link>
				<div className="line"></div>
			</li>
            {
              Object.keys(this.state.dataSource).map((parentKey, parentIndex) => this.menuParentItem(parentIndex, this.state.dataSource[parentKey]["route"],  parentKey, this.state.dataSource[parentKey]["icon"]))
            }
          </ul>
          <div id="sum-menu" className={this.state.classToggle} onMouseEnter={() => this.handleHoverOnSubMenu()} onMouseLeave={() => this.handleLeaveFromSubMenu()}>
            { 
              this.state.classToggle == "show" 
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
