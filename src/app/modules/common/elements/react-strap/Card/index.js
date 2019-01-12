import React from "react";
import { Card, 
  CardFooter, 
  CardBody,
} from "reactstrap";
import {Link} from "react-router-dom";
import "./index.css"; 

export class Cards extends React.Component {
  render(){
    return(
      <div className="wrap-card">   
        <Card>
          <CardBody>
            <div className="card-text">
              <div className="wrap-content">
                <div className="block-icon">
                  <span className={this.props.icon}></span>
                </div>
                <div className="block-text">
                  <div className="total">
                    {this.props.contentText}
                  </div>
                  <div className="price">
                    {this.props.contentValue}
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
          <CardFooter className="text-muted">
            <Link to={`/${this.props.to}`}> 
              {this.props.readMoreTitle}
            </Link>
          </CardFooter>
        </Card>
      </div>
    );
  }
}

Cards.defaultProps = {
  to: "#"
};