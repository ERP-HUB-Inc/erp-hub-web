import React from "react";
import Component from "../../../Component";

export default class Board extends Component {
  render() {
    return (
      <this.Col xs={this.props.gridxs} lg={this.props.gridLg} md={this.props.gridMd} sm={this.props.gridSm}>
        <this.Cards
          contentValue={this.props.contentValue}
          percentage={this.props.percentage}
          icon={this.props.icon}
          contentText={this.props.title}
          color={this.props.color}
          to={this.props.to}
          readMoreTitle={this.props.readMoreTitle}/>
      </this.Col>
    );
  }
}

Board.defaultProps = {
  gridLg: 3,
  gridMd: 6,
  gridSm: 12,
  gridxs: 12
};