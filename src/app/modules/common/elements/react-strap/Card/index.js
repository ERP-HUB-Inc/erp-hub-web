import React, { Component } from "react";
import { Card, 
  CardFooter, 
  CardBody,
  CardText,
  Col,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";

export class Cards extends Component {
  render(){
    const { 
      icon,
      totalText,
      price,
      to
    } = this.props;
    return(
      <div className="main-home-page">   
        <Card>
          <CardBody>
            <CardText>
              <Row>
                <Col md="6">
                  <span className="icon">
                    <i className={`fa fa-${ icon }`}></i>
                  </span>
                </Col>
                <Col md="6">
                  <div className="total">
                    { totalText }
                  </div>
                  <div className="price">
                    $ { price }
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