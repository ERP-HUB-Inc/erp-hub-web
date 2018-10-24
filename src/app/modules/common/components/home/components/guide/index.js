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
                <div className="grap-guide-title grap-title">3.1. TYPES</div>
              </li>
              <li>
                <this.Link to="products/brand">
                  <span className="icon-brand"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3.2. BRAND</div>
              </li>
              <li>
                <this.Link to="stock/supplier">
                  <span className="icon-purchasing"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4.1 SUPPLIERS</div>
              </li>
              <li>
                <this.Link to="#">
                  <span className="icon-pre-order"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6.1 PRE-ORDER</div>
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
                <div className="grap-guide-title grap-title">1.SETTING UP</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="employee">
                  <span className="icon-employee"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">2. EMPLOYEE</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="products/manage">
                  <span className="icon-add-product"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3. PRODUCTS</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="stock/purchase-order">
                  <span className="icon-purchasing"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4. PURCHASING</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="customer">
                  <span className="icon-customer"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">5. CUSTOMERS</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="transactions/sale-history">
                  <span className="icon-sale"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6. SALE</div>
              </li>
              <li>
                <span className="icon-arrow-right arrow"></span>
              </li>
              <li>
                <this.Link to="reports/sale">
                  <span className="icon-reports"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">7. REPORTS</div>
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

          <div className="main-icon-buttom">
            <ul>
              <li>
                <this.Link to="products/manage">
                  <span className="icon-add-product"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">3.3. ADD PRODUCT</div>
              </li>
              <li>
                <this.Link to="stock">
                  <span className="icon-stock"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">4.2. STOCK</div>
              </li>
              <li>
                <this.Link to="dd">
                  <span className="icon-sale-return"></span>
                </this.Link>
                <div className="grap-guide-title grap-title">6.2 SALE RETURN</div>
              </li>
            </ul>
          </div>
        </this.Row>
      </div>
    );
  }
}