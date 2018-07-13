import React from "react";
import "./index.css";

export default class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      classToggle: "hidden"
    };
    this.handleShow = this.handleShow.bind(this);
    this.handleHidden = this.handleHidden.bind(this);
  }

  handleShow(menu) {
    this.setState({
      classToggle: "show"
    });
  }

  handleHidden() {
    this.setState({
      classToggle: "hidden"
    });
  }

  render() {
    return (
      <div id="sidebar">
        <ul className="list-unstyled text-center">
          <li className="active" onMouseEnter={() => this.handleShow("home")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-home"></span></a></li>
          <li onMouseEnter={() => this.handleShow("list")}  onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-list"></span></a></li>
          <li onMouseEnter={() => this.handleShow("product")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-items"></span></a></li>
          <li onMouseEnter={() => this.handleShow("stock")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-stock"></span></a></li>
          <li onMouseEnter={() => this.handleShow("customer")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-customer"></span></a></li>
          <li onMouseEnter={() => this.handleShow("employee")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-employee"></span></a></li>
          <li onMouseEnter={() => this.handleShow("report")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-reports"></span></a></li>
          <li onMouseEnter={() => this.handleShow("setting")} onMouseLeave={() => this.handleHidden()}><a href="#"><span className="icon-settings"></span></a></li>
        </ul>
        <div id="sum-menu" className={this.state.classToggle}>
          <div className="title text-center">Transaction</div>
          <ul className="list-unstyled text-left text-uppercase">
            <li><a href="#"><span className="icon-time"></span><span className="item-text">Sale History</span></a></li>
            <li><a href="#"><span className="icon-pre-order"></span><span className="item-text">Sale Order</span></a></li>
            <li><a href="#"><span className="icon-sale-return"></span><span className="item-text">Return & Exchange</span></a></li>
          </ul>
        </div>
      </div>
    );
  }
}
