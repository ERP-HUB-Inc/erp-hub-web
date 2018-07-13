import React from "react";
import { Route, Switch } from "react-router-dom";
import SideBar from "../../../modules/common/components/layout/SiderBar/index";
import Headers from "../../../modules/common/components/layout/Header/Index";
import UserList from "../../common/containers/user";
import Home from "../../common/containers/home/Index";
import Component from "../components/Component";
import { Layout } from "antd";
import ComponentList from "../../common/containers/component";
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
    const {
      collapsed,
      sidebarCollapsed,
      display,
      layoutContent} = this.state;

    return (
      <Layout>
        {/* <SideBar collapsed={ sidebarCollapsed } display={ display } /> */}
        <Headers collapsed={ collapsed } toggle={ this.toggle } />
        <Content onClick={ this.Content } className={ layoutContent }>
          <Switch>
            <Route path="/component" name="Create" component={ ComponentList } />
            <Route path="/dd" name="Create" component={ UserList } />
            <Route path="/sale_history" name="Create" component={ Home } />
            <Route path="/" name="Create" component={ Home } />
          </Switch>
        </Content>  
      </Layout>
    );
  }
}

export default Router;

