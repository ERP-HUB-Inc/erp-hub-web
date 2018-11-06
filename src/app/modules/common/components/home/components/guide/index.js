import React from "react";
import "./index.css";
import Component from "../../../Component";

export default class Duide extends Component {
  render() {
    return (
      <div className="main-guide">
        <this.Row>
          <div className="main-icon-top">
            <ul>
              <li>
                <this.Link to="products/types">
                  <span className="icon-types"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3.1. <this.Translate id="home_page_guide_types"/></div>
              </li>
              <li>
                <this.Link to="products/brand">
                  <span className="icon-brand"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3.2. <this.Translate id="home_page_guide_brand"/></div>
              </li>
              <li>
                <this.Link to="stock/supplier">
                  <span className="icon-purchasing"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4.1 <this.Translate id="home_page_guide_suppliers"/></div>
              </li>
              <li>
                <this.Link to="#">
                  <span className="icon-pre-order"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6.1 <this.Translate id="home_page_guide_pre_order"/></div>
              </li>
            </ul>
          </div>

          <div className="main-arrow-down">
            <ul>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
            </ul>
          </div>

          <div className="main-guide-icon">
            <ul>
              <li>
                <this.Link to="settings/account">
                  <span className="icon-settings"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">1. <this.Translate id="home_page_guide_setting_up"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="employee">
                  <span className="icon-employee"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">2. <this.Translate id="home_page_guide_employee"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="products/manage">
                  <span className="icon-add-product"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3. <this.Translate id="home_page_guide_products"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="stock/purchase/order">
                  <span className="icon-purchasing"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4. <this.Translate id="home_page_guide_purchasing"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="customer">
                  <span className="icon-customer"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">5. <this.Translate id="home_page_guide_customers"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="transactions/saleorder">
                  <span className="icon-sale"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6. <this.Translate id="home_page_guide_sale"/></div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="reports/sale">
                  <span className="icon-reports"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">7. <this.Translate id="home_page_guide_reports"/></div>
              </li>
            </ul>
          </div>

          <div className="main-arrow-down">
            <ul>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
              <li>
                <span className="icon-arrow-down arrow-down"></span>
              </li>
            </ul>
          </div>

          <div className="main-icon-top" >
            <ul>
              <li style={{ marginRight: "101px" }}>
                <this.Link to="products/manage">
                  <span className="icon-add-product"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3.3. <this.Translate id="home_page_guide_add_products"/></div>
              </li>
              <li>
                <this.Link to="stock">
                  <span className="icon-stock"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4.2. <this.Translate id="home_page_guide_stock"/></div>
              </li>
              <li style={{ marginLeft: "26%" }}>
                <this.Link to="#">
                  <span className="icon-sale-return"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6.2 <this.Translate id="home_page_guide_sale_return"/></div>
              </li>
            </ul>
          </div>
        </this.Row>
      </div>
    );
  }
}