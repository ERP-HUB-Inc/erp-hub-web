import React, { Component } from "react";
import { Row,Col } from "reactstrap";
import { Table } from "reactstrap";
import { Badges } from "../Badges";

export class ListSearch extends Component {
  
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="search-list-table">
        <Table>
          <tbody>
            <tr>
              <td scope="row">
                img
              </td>
              <td>
                <div id="Target" className="list-product-name">
                  MYDBSH Cotton V-neck t shirt 
                </div>
                <div className="list-code">
                  SKU: 32572725521
                </div>
                <Badges title="forman"/>
                <Badges title="forman"/>
              </td>
              <td>
                <div className="product-in-stock">
                  Product In Stock
                </div>
                <Row>
                  <Col md="6"> 
                    <div className="current">
                      Current 
                    </div>
                    <div className="current-price">
                      7
                    </div>
                  </Col>
                  <Col md="6"> 
                    <div className="current">
                      Order 
                    </div>
                    <div className="current-price">
                      38
                    </div>
                  </Col>
                </Row>
              </td>
              <td>
                <div className="list-total-price">
                  $11.32
                </div>
              </td>
            </tr>
          </tbody>
        </Table>
      </div>
    );
  }
}