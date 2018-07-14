import React from "react";
import Component from "../Component";

export default class Board extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <this.Col md={this.props.grid}>
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
  grid: 3
};