import React, { Component } from "react";
import { connect } from "react-redux";
import User from "../components/user/User";
import { fetchUsers } from "../actions/users";

class UserList extends Component {
	componentDidMount() {
		const { dispatch } = this.props;
		dispatch(fetchUsers());
	}

	render() {
		return (
			<div>
				<User {...this.props} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return state.reducer.user;
}


export default connect(mapStateToProps)(UserList);

