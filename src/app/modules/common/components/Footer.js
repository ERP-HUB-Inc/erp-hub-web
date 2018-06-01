import React, { Component } from "react";
import { Translate } from "react-localize-redux";

export default class Footer extends Component {
	render() {
		return (
			<div>
				<Translate id="text_contact_us"/>
			</div>
		);
	}
}