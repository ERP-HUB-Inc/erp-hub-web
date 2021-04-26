import React from "react";
import {Layout} from "antd";
import DropDown from "../DropDown";
import Component from "../../Component";
import Enum from "../../../../inventory/enums";
import "./index.css";
const {Header} = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    };
  }

  componentDidMount() {
    const element = document.getElementById("mobile-logo");
    const centerElement = document.getElementById("center-container");
    if (element) {
      element.addEventListener("click", () => {
        const rootElement = document.getElementById("root");
        if (rootElement) {
          if (rootElement.classList.contains("mini-sidebar")) {
            rootElement.classList.remove("mini-sidebar");
          } else {
            rootElement.classList.add("mini-sidebar");
          }
        }
      });
    }

    if (centerElement) {
      centerElement.addEventListener("click", () => {
        const rootElement = document.getElementById("root");
        if (rootElement) {
          if (rootElement.classList.contains("mini-sidebar")) {
            rootElement.classList.remove("mini-sidebar");
          }
        }
      });
    }

    // switch language
    const setting = this.Util.getSetting();
    if (setting) {
      this.props.dispatch(this.changeLanguage(setting.defaultLanguageCode));
    }
  }

  handleToggleMiniSideBar()  {
    const rootElement = document.getElementById("root");
    if (rootElement) {
      if (rootElement.classList.contains("mini-sidebar")) {
        rootElement.classList.remove("mini-sidebar");
      } else {
        rootElement.classList.add("mini-sidebar");
      }
    }
  }

  switchLanguage = (key) => {
    const accessToken = this.Util.getAuthSession();
    accessToken["setting"]["defaultLanguageCode"] = key;
    this.Util.setAuthSession(accessToken);
    window.location.reload();
    
    // this.props.dispatch(this.changeLanguage(key));
  }
  
  render() {
    const languages = JSON.parse(localStorage.getItem(Enum.LOCAL_SCHEMA.LANGUAGE));
    return (
      <Header id="top-header" className="header" style={{ background: "#fff" }}>
        <div className="store-logo">
          <span className="icon-logo"></span>
        </div>
        <this.Row className="wrap-header">
          <div className="header-left">
            <div className="store-name">
              <img src={`${this.Util.getGeneralImage("storeVein/storevein.png").url}`} id="mobile-logo" alt=""/>
              <div className="wrap-title">
                <div className="title-user">
                  <span className="icon-storevein-backend" style={{fontSize: "60pt"}}>
                    <span className="path1"></span><span className="path2"></span><span className="path3"></span><span className="path4"></span><span className="path5"></span><span className="path6"></span><span className="path7"></span><span className="path8"></span><span className="path9"></span><span className="path10"></span><span className="path11"></span><span className="path12"></span><span className="path13"></span><span className="path14"></span><span className="path15"></span><span className="path16"></span><span className="path17"></span><span className="path18"></span><span className="path19"></span>
                  </span>
                </div>
                {/* <div className="back-office">{<this.Translate id="text_back_office"/>}</div> */}
              </div>
            </div>
          </div>
          <div className="header-right">
            <DropDown
              onSwitchLanguage={this.switchLanguage}
              localization={this.props.locale}
              activeLanguages={languages ? languages : []}
              currentLanguage={this.getCurrentLanguage(this.props.locale)}/>
          </div>
        </this.Row>
      </Header>
    );
  }
}

export default Headers;