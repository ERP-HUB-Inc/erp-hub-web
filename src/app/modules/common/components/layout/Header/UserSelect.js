import React from "react";
import {  
  Dropdown, 
  DropdownItem, 
  DropdownToggle, 
  DropdownMenu
} from "reactstrap";
import { 
  NavLink 
} from "react-router-dom";
import { Icon } from "antd";

export default class UserSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userOpen: false
    };
    this.usertoggle = this.usertoggle.bind(this);
  }

  usertoggle(){
    this.setState({
      userOpen: !this.state.userOpen
    });
  }

  render() {
    const { userOpen } = this.state;
    return(
      <div className="main-user-select">
        <Dropdown nav isOpen={ userOpen } toggle={ this.usertoggle }>
          <DropdownToggle nav caret className="title-user">
            User Account
          </DropdownToggle>
          <div class="icon-user">
            <Icon type="user" />
          </div>
          <DropdownMenu>
            <DropdownItem>
              <NavLink to="/account/setting">My Setting</NavLink>
            </DropdownItem>
            <DropdownItem divider />
            <DropdownItem>
              <div onClick={ () => this.deleteDialog() }>Log Out</div>
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>
    );
  }
}
