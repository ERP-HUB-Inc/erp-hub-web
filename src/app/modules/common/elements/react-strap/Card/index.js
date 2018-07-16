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
      <div className="wrap-card">   
        <Card>
          <CardBody>
            <CardText>
              <div className="wrap-content">
                <div className="block-icon">
                  <span className={icon}></span>
                </div>
                <div className="block-text">
                  <div className="total">
                    { totalText }
                  </div>
                  <div className="price">
                    { price }
                  </div>
                </div>
              </div>
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