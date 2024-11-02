import React from "react";
import { Card, 
  CardFooter, 
  CardBody,
} from "reactstrap";
import {Icon} from "antd";
import {Link} from "react-router-dom";
import "./index.css"; 

export function Cards(props) {
  return(
    <div className="wrap-card">   
      <Card>
        <CardBody>
          <div className="card-text">
            <div className="wrap-content">
              <div className="block-icon">
                <span className={props.icon}></span>
              </div>
              <div className="block-text">
                <div className="total">
                  {props.contentText}
                </div>
                <div className="price">
                  {props.contentValue}
                  {
                    props.showPercentage ?
                      props.percentage > 0 ?
                      <span style={{color: "#48AB5D", fontSize: 15, fontWeight: "500", marginLeft: 10}}><Icon type="rise" />{props.percentage}%</span>
                      :
                      <span style={{ color: "#E77271", fontSize: 15, marginLeft: 10 }}><Icon type="fall" />{Math.abs(props.percentage)}%</span>
                    : null
                  }
                </div>
              </div>
            </div>
          </div>
        </CardBody>
        <CardFooter className="text-muted">
          <Link to={`/${props.to}`}> 
            {props.readMoreTitle}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

Cards.defaultProps = {
  to: "#"
};