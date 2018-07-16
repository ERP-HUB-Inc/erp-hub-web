import React from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import SideBar from "../../../modules/common/components/layout/SiderBar";
import Headers from "../../common/containers/layout/Header";
import UserList from "../../common/containers/user";
import Home from "../../common/containers/home";
import Component from "../components/Component";
import ComponentList from "../../common/containers/component";
import dataSource from "../components/layout/SiderBar/datasource";
const { Content } = Layout;

export default class Router extends Component {
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
        <Headers collapsed={ collapsed } toggle={ this.toggle } />
        <SideBar collapsed={ sidebarCollapsed } display={ display } />
        <Content onClick={ this.Content } className={ layoutContent }>
          <Switch>
            {
              Object.keys(dataSource).map((key, index) => dataSource[key]["subItems"].map(value => <Route path={value["route"]} name="Create" component={value["component"]} />))
            }
            <Route path="/test-component" name="Create" component={ UserList }></Route>
            <Route path="/" name="Create" component={ Home } />
          </Switch>
        </Content>
      </Layout>
    );
  }
}

