import React, { Component } from "react";
import { Translate } from "react-localize-redux";

export default class Header extends Component {
	render() {
		return (
			<div>
				<h2><Translate id="text_header" /></h2>
			</div>
		);
	}
}