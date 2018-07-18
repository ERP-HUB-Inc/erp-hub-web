import React from "react";
import { connect } from "react-redux";
import List from "../../../components/settings/Tax";
import { fetchTax } from "../../../action/settings/fetchTax";

class Tax extends React.Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchTax());
  }

  render() {
    return (
      <List {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  return state.reducer.tax;
}

export default connect(mapStateToProps)(Tax);