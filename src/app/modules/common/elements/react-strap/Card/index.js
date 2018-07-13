import React, { Component } from "react";
import { Card, 
  CardFooter, 
  CardBody,
  CardText,
  Col,
  Row,
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
      <div className="main-home-page">   
        <Card>
          <CardBody>
            <CardText>
              <Row>
                <Col xs="5" md="5">
                  <span className="icon">
                    <i className={`${ icon }`}></i>
                  </span>
                </Col>
                <Col xs="7" md="7" className="clear-margin">
                  <div className="total">
                    { totalText }
                  </div>
                  <div className="price">
                    $ { price } 
                    <span className="unit">&nbsp;{ unit }</span>
                  </div>
                </Col>
              </Row>
            </CardText>
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