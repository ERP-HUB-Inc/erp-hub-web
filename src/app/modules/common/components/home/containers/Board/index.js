import React from "react";
import Component from "../../../Component";

export default class Board extends Component {
  render() {
    return (
      <this.Col xs={this.props.gridxs} lg={this.props.gridLg} md={this.props.gridMd} sm={this.props.gridSm}>
        <this.Cards
          price={this.props.total}
          icon={this.props.icon}
          totalText={this.props.title}
          to={this.props.to}
          route={this.props.route}
          readMoreTitle={this.props.readMoreTitle}
        />
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