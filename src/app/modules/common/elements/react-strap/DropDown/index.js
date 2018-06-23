import React from "react";
import { 
  ButtonDropdown,
  DropdownToggle, 
  DropdownMenu
} from "reactstrap";
import PropTypes from "prop-types";

export default class DropDown extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.toggle = this.toggle.bind(this);
    this.popup = this.popup.bind(this);
    this.changepassword = this.changepassword.bind(this);

  }

  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  popup() {
    this.showmodal();
  }

  changepassword(){
    this.popup();
  }

  showmodal(){
    this.setState({
      modal: !this.state.modal 
    }); 
  }

  render() {
    return (
      <div className="main-dropdown">
        <ButtonDropdown isOpen={ this.state.dropdownOpen } toggle={ this.toggle }>
          <DropdownToggle>
            <i className="fa fa-ellipsis-v" aria-hidden="true"></i>
          </DropdownToggle>
          <DropdownMenu>
            { this.props.children }
          </DropdownMenu>
        </ButtonDropdown>
      </div>
    );
  }
}

DropDown.propTypes = {
  children: PropTypes.node
};