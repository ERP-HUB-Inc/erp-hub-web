import React from "react";
import Component from "../Component";
import "./index.css";

export default class ParentLayout extends Component {
  render() {
    return (
      <div className={`clear-padding wrap-client-login ${this.props.classBlogLogin}`}>
        <div className="clear-padding inner-client-login">
          <div className={this.props.clasBlogLogo}>
            <div className="blog-logo text-center">
              <div className="inner-logo">
                <div className="logo">
                  <span className="icon-logo"></span>
                </div>
                <div className="text">
                  <strong>ERP HUB</strong>
                </div>
              </div>
            </div>
          </div>
          <div className="blog-login">
            {/* <div className="wrap-help"><span className="icon-help icon-padding-right"></span><span className="help">Help</span></div> */}
            <div className="header text-right">
              <div className="title"><strong>ERP HUB</strong></div>
              <div className="back-office">Backoffice</div>
            </div>
            { this.props.children }
          </div>
        </div>
      </div>
    );
  }

}

ParentLayout.defaultProps = {
  clasBlogLogo: "wrap-blog-logo"
};

