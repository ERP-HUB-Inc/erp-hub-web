import React from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import SideBar from "../../../modules/common/components/layout/SiderBar";
import Headers from "../../common/containers/layout/Header";
import UserList from "../../common/containers/client/signin";
import offlineDB from "../../common/containers/offline";
import Home from "../../common/containers/home";
import Component from "../components/Component";
import dataSource from "../components/layout/SiderBar/datasource";
const { Content } = Layout;

export default class Router extends Component {
  render() {
    return (
      <div>
        <Layout>
          <Headers />
          <SideBar />
          <Content className="layoutContent">
            <Switch>
                {
                  Object.keys(dataSource).map((key) => 
                    dataSource[key]["subItems"].map(value =>
                      <Route path={value["route"]} name="Create" component={value["component"]} />
                    )
                  )
                }
                <Route path="/offline" component={ offlineDB }></Route>
                <Route path="/test-component" component={ UserList }></Route>
                <Route path="/" component={Home}></Route>
            </Switch>
          </Content>
        </Layout>
      </div>
    );
  }
}


