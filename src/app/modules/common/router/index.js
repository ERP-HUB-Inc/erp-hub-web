import React from "react";
import { Route, Switch } from "react-router-dom";
import SideBar from "../../../modules/common/components/layout/SiderBar/Index";
import Headers from "../../../modules/common/components/layout/Header/Index";
import UserList from "../../common/containers/user/UserList";
import Test from "../containers/test";
import Component from "../components/Component";
import { Layout } from "antd";
const { Content } = Layout;

class Router extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sidebarCollapsed: true,
      display: "",
      layoutContent: ""
    }; 
    this.toggle = this.toggle.bind(this);
    this.Content = this.Content.bind(this);
  }

  toggle(){
    this.setState({
      collapsed: !this.state.collapsed,
      sidebarCollapsed: !this.state.sidebarCollapsed,
      display: "block",
      layoutContent: "layoutContent"
    });
  }

  Content(){
    this.setState({
      display: "none",
      sidebarCollapsed: true,
      layoutContent: ""
    });
  }

  render() {

    const { collapsed,
      sidebarCollapsed,
      display,
      layoutContent } = 
    this.state;

    return (
      <Layout>
        <SideBar collapsed={ sidebarCollapsed } display={ display } />
        <Layout>
          <Headers collapsed={ collapsed } toggle={ this.toggle } />
          <Content onClick={ this.Content } className={ layoutContent }>
            <Switch>
              <Route path="/dd" name="Create" component={ UserList } />
              <Route path="/" name="Create" component={ Test } />
            </Switch>
          </Content>  
        </Layout>
      </Layout>
    );
  }
}

export default Router;

