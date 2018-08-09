import React from "react";
import { Layout } from "antd";
import { Route, Switch } from "react-router-dom";
import { connect } from "react-redux";
import SideBar from "../components/layout/SiderBar";
import Headers from "../containers/layout/Header";
import UserList from "../containers/client/signin";
import offlineDB from "../containers/offline";
import Home from "../containers/home";
import Component from "../components/Component";
import dataSource from "../components/layout/SiderBar/datasource";
// import AuthAction from "../actions/authentication";
// import ConstantAuth from "../constants/authentication";
const { Content } = Layout;

class Router extends Component {
  render() {
    // const {dispatch} = this.props;
    // dispatch(AuthAction.checkAuthentication(this.Util.getAccessToken(ConstantAuth.ACCESS_TOKEN)));
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

function mapStateToProps(state) {
  return {
    authentication: state.reducer.client.checkAuthentication
  };
}

export default connect(mapStateToProps)(Router);


