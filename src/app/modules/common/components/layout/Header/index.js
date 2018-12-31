import React from "react";
import Component from "../../Component";
import DropDown from "../DropDown";
import { Layout } from "antd";
import SearchForm from "../Search";
import LanguageAction from "../../../../pos/action/settings/storeLanguage";
import "./index.css";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      languages: []
    };
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  componentDidMount() {
    this.props.dispatch(LanguageAction.fetch(5));
    const element = document.getElementById("mobile-logo");
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

    // switch language
    const setting = this.Util.getSetting();
    if (setting) {
      this.props.dispatch(this.changeLanguage(setting.defaultLanguageCode));
    }
  }

  switchLanguage(key) {
    const accessToken = this.Util.getAuthSession();
    accessToken["setting"]["defaultLanguageCode"] = key;
    this.Util.setAuthSession(accessToken);
    window.location.reload();
    
    // this.props.dispatch(this.changeLanguage(key));
  }
  
  render() { 
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
                  {/* <span className="icon-storevein-backend">
                    < span className="path1"></span>
                    <span className="path2"></span>
                    <span className="path3">
                    </span><span className="path4">
                    </span><span className="path5">
                    </span><span className="path6">
                    </span><span className="path7">
                    </span><span className="path8">
                    </span><span className="path9">
                    </span><span className="path10">
                    </span><span className="path11">
                    </span><span className="path12">
                    </span><span className="path13">
                    </span><span className="path14">
                    </span><span className="path15">
                    </span><span className="path16">
                    </span><span className="path17">
                    </span><span className="path18">
                    </span><span className="path19"></span>
                  </span> */}
                  store VEIN 
                </div>
                <div className="back-office">{<this.Translate id="text_back_office"/>}</div>
              </div>
            </div>
          </div>
          <div className="main-search">
            <SearchForm locale={this.props.locale}/>
          </div>
          <div className="header-right">
            <DropDown
              onSwitchLanguage={this.switchLanguage}
              localization={this.props.locale}
              activeLanguages={this.props.reducer.storeLanguage.request.list}
              currentLanguage={this.getCurrentLanguage(this.props.locale)}/>
          </div>
        </this.Row>
      </Header>
    );
  }
}

export default Headers;