import React, { Component } from "react";
import { Card, 
  CardFooter, 
  CardBody,
  CardText,
  Col,
  Row
} from "reactstrap";
import "./index.css"; 
import { Link } from "react-router-dom";

export class Cards extends Component {
  render(){
    const { 
      icon,
      totalText,
      price,
      to,
      unit
    } = this.props;
    return(
      <div className="wrap-card">   
        <Card>
          <CardBody>
            <Row>
              <Col xs="12" md="12">
                <Row>
                  <Col xs="12" md="4">
                    <div className="block-icon">
                      <span className={icon}></span>
                    </div>
                  </Col>
                  <Col xs="12" md="8">
                    <div className="block-text">
                      <div className="total">
                        { totalText }
                      </div>
                      <div className="price">
                        { price }
                      </div>
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
          </CardBody>
          <CardFooter className="text-muted">
            <Link to={ `/${ to }` }> 
                Read More
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
}