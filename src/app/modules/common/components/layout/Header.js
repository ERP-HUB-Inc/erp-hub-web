import React from "react";
import { Menu, Dropdown, Button, Icon } from "antd";
import Component from "../Component";
import "./styles/Header.css";

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.switchLanguage = this.switchLanguage.bind(this);
	}

	switchLanguage(key) {
		const { dispatch } = this.props;
		dispatch(this.changeLanguage(key));
	}

	render() {
		const menu = (
			<Menu>
			  <Menu.Item key="1" onClick={() => this.switchLanguage("en")}>English</Menu.Item>
			  <Menu.Item key="2" onClick={() => this.switchLanguage("fr")}>French</Menu.Item>
			  <Menu.Item key="3" onClick={() => this.switchLanguage("es")}>Espain</Menu.Item>
			</Menu>
		);

		return (
			<div className="header">
				<ul className="right">
					<li>
						<Dropdown overlay={menu}>
							<Button style={{ marginLeft: 8 }}>
								English <Icon type="down" />
							</Button>
						</Dropdown>
					</li>
				</ul>
				<this.clearFloating />
			</div>
		);
	}
}
