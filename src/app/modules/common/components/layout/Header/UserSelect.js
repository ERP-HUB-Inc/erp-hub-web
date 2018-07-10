import React from "react";
import Component from "../../Component";
import { Icon } from "antd";

export default class UserSelect extends Component {
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
        <ul>
          <li>
            <this.Noteicon />
          </li>
          <li>
            <span className="help">Help</span>&nbsp; 
            <i className="fa fa-question-circle help-icon"></i>
          </li>
          
          <this.Dropdown nav isOpen={ userOpen } toggle={ this.usertoggle }>
            <this.DropdownToggle nav caret className="title-user">
              <span className="user-acc">User Account</span>
            </this.DropdownToggle>
            <div className="icon-user">
              <Icon type="user" />
            </div>
            <this.DropdownMenu>
              <this.DropdownItem>
                <this.NavLink to="/account/setting">My Setting</this.NavLink>
              </this.DropdownItem>
              <this.DropdownItem divider />
              <this.DropdownItem>
                <div onClick={ () => this.deleteDialog() }>Log Out</div>
              </this.DropdownItem>
            </this.DropdownMenu>
          </this.Dropdown>
          
        </ul>
        
      </div>
    );
  }
}
