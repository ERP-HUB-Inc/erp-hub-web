import React from "react";
import {
  Menu,
  Dropdown
} from "antd";
import Component from "../../Component";
import history from "../../../router/history";
import AuthService from "../../../services/AuthService";
import InventoryEnum from "../../../../inventory/enums";
import "./index.css";
import "./index.scss";


export default class MenuDropDown extends Component {
  constructor(props) {
    super(props);
    this.handleLogOut = this.handleLogOut.bind(this);
    this.menu = (
      <Menu>
        <Menu.Item>
          <this.Link to="/profile">
            <span className="icon-user icon-padding-right"></span>
            <span className="title"><this.Translate id="text_profile"/></span>
          </this.Link>
        </Menu.Item>
        <Menu.Item>
          <a href="https://www.youtube.com/channel/UCGJCcdpmRoE9T0m52DsQGVg/playlists" target="_blank" rel="noopener noreferrer">  
            <span className="icon-help icon-padding-right"></span>
            <span className="title"><this.Translate id="text_tutorial"/></span>
          </a>
        </Menu.Item>
        <Menu.Item onClick={() => this.handleLogOut()}>
          <span className="icon-logout icon-padding-right"></span>
          <span className="title"><this.Translate id="text_logout"/></span>
        </Menu.Item>
      </Menu>
    );

    this.iconLanguages = {
      km: this.getLanguageIcon("km"),
      bm: this.getLanguageIcon("bm"),
      en: this.getLanguageIcon("en")
    };
  }

  handleOnHardReload = () => {
    localStorage.removeItem(InventoryEnum.LOCAL_SCHEMA.BRAND);
    localStorage.removeItem(InventoryEnum.LOCAL_SCHEMA.PRODUCT_TYPE);
    localStorage.removeItem(InventoryEnum.LOCAL_SCHEMA.UNIT);
    window.location.reload(true);
  }

  handleLogOut() {
    AuthService.logout();
    this.Util.logout(history);
  }

  render() {
    let fullName = "";
    const userInfo = this.getCurrentUser();
    if (userInfo !== null) {
      const {currentUser} = userInfo;
      if (currentUser !== null && currentUser !== "undefined") {
        fullName = currentUser.fullName;
      }
    }

    return(
      <ul className="menu-right list-unstyled">
        <li>
          <this.Button className="btn-update-now" type="default" style={{ backgroundColor: "#FFD627" }} onClick={this.handleOnHardReload}><this.Translate id="text_update_now" /></this.Button>
        </li>
        {/* <li>
          <this.Link to="#" className="user-account">
            <this.Noteicon />
          </this.Link>
        </li> */}
        {
          this.props.activeLanguages.length > 1 ?
            <li>
              <Dropdown
                overlay={<Menu>
                  {
                    this.props.activeLanguages.map((local, key) => 
                      <Menu.Item key={ key } onClick={() => this.props.onSwitchLanguage(local.code)}>
                        {this.iconLanguages[local.code]}
                        <span className="title">{local.name}</span>
                      </Menu.Item>
                    )
                  }
                </Menu>
                }
                trigger={["hover"]}>
                <this.Link to="#" className="ant-dropdown-link user-account">
                  {this.iconLanguages[this.props.currentLanguage.code]}
                  <span className="title-user">{this.props.currentLanguage.name}</span> 
                  <span className="icon-move-down icon-padding-left"></span>
                </this.Link>
              </Dropdown>
            </li>
            :
            ""
        }
        {/* <li>
          <a className="user-account">
            <span className="icon-help icon-padding-right"></span>
            <span className="title-user"><this.Translate id="text_help"/></span>
          </a>
        </li> */}
        <li>
          <Dropdown overlay={this.menu} trigger={["hover"]}>
            <this.Link to="#" className="ant-dropdown-link user-account">
              <span className="icon-user icon-padding-right"></span>
              <span className="title-user">{fullName}</span> 
              <span className="icon-move-down icon-padding-left"></span>
            </this.Link>
          </Dropdown>
        </li>
      </ul>
    );
  }
}
