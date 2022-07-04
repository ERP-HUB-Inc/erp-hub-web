import React from "react";
import { Card, 
  CardFooter, 
  CardBody,
} from "reactstrap";
import {Icon} from "antd";
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
                    {
                      this.props.showPercentage ?
                        this.props.percentage > 0 ?
                        <span style={{color: "#48AB5D", fontSize: 15, fontWeight: "500", marginLeft: 10}}><Icon type="rise" />{this.props.percentage}%</span>
                        :
                        <span style={{ color: "#E77271", fontSize: 15, marginLeft: 10 }}>{Math.abs(this.props.percentage)}<Icon type="fall" />%</span>
                      : null
                    }
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