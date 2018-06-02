import React, { Component } from "react";
import { Translate, setActiveLanguage } from "react-localize-redux";
import "./styles/Header.css";

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.changeLanguage = this.changeLanguage.bind(this);
	}

	changeLanguage(key) {
		const { dispatch } = this.props;
		dispatch(setActiveLanguage(key));
	}

	render() {
		return (
			<div className="header">
				<h2 className="headerTitle"><Translate id="text_header" /></h2>
				<button onClick={() => this.changeLanguage("en")}>English</button>
				<button onClick={() => this.changeLanguage("fr")}>French</button>
			</div>
		);
	}
}
