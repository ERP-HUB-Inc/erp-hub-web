import React from "react";
import Component from "../Component";

export default class Board extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <this.Col lg={this.props.gridLg} md={this.props.gridMd} sm={this.props.gridSm}>
        <this.Cards
          price={this.props.total}
          icon={this.props.icon}
          totalText={this.props.title}
          route={this.props.route}
        />
      </this.Col>
    );
  }
}

Board.defaultProps = {
  gridLg: 3,
  gridMd: 6,
  gridSm: 12
};