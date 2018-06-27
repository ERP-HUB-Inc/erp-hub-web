import React from "react";
import Component from "../../Component";
import UserSelect from "./UserSelect";
import { Icon } from "antd";
import { Layout } from "antd";
import SearchForm from "./Search/";
const { Header } = Layout;

class Headers extends Component {
  constructor(props) {
    super(props);
    this.switchLanguage = this.switchLanguage.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  switchLanguage(key) {
    const { dispatch } = this.props;
    dispatch(this.changeLanguage(key));
  }

  toggle(){
    this.props.toggle;
  }

  handleSubmit(values){
    alert(values.title);
  }

  render() {
    const { collapsed,toggle } = this.props;
    return (
      <Header className="header" style={{ background: "#fff" }}>
        <Icon
          className="trigger "
          type={ collapsed ? "menu-unfold" : "menu-fold" }
          onClick={ toggle }
        />
        <this.Row className="block-search">
          <this.Col md="2" lg="2">
            <div className="border-right">
              <div className="logo-title"> Store VEIN </div>
              Backoffice
            </div>
          </this.Col>
          <this.Col md="5 main-search" lg="5">
            <SearchForm />
          </this.Col>
          <this.Col xs="12" sm="12" md="5" lg="5">
            <this.Row>
              <this.Col xs="12" md="12">
                <UserSelect />
              </this.Col>
            </this.Row>
          </this.Col>
        </this.Row>

      </Header>
    );
  }
}

export default Headers;