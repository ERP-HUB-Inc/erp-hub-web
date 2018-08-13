import React from "react";
import Component from "../../Component";
import DropDown from "../DropDown";
import { Layout } from "antd";
import SearchForm from "../Search";
import "./index.css";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
  }

  switchLanguage(key) {
    const {dispatch} = this.props;
    dispatch(this.changeLanguage(key));
  }
  
  render() {
    return (
      <Header className="header" style={{ background: "#fff" }}>
        <div className="store-logo">
          <span className="icon-logo"></span>
        </div>
        <this.Row className="wrap-header clear-margin">
          <this.Col md="2" className="header-left">
            <div className="store-name">
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
          </this.Col>
          <this.Col md="3 main-search">
            <SearchForm locale={this.props.locale}/>
          </this.Col>
          <this.Col md="7" className="header-left">
            <DropDown onSwitchLanguage={this.switchLanguage} localization={this.props.locale} currentLanguage={this.getCurrentLanguage(this.props.locale)}/>
          </this.Col>
        </this.Row>
      </Header>
    );
  }
}

export default Headers;