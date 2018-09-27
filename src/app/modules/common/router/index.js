import React from "react";
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import SideBar from "../components/layout/SiderBar";
import Headers from "../containers/layout/Header";
import UserList from "../containers/client/signin";
import offlineDB from "../containers/offline";
import Home from "../containers/home";
import Component from "../components/Component";
import dataSource from "../components/layout/SiderBar/datasource";
import AuthService from "../services/AuthService";
import Authentication from "../constants/authentication";
import {Util} from "../util";
const {Content} = Layout;

class Router extends Component {
  render() {
    const accessToken = (new Util()).getAccessToken(Authentication.ACCESS_TOKEN);

    AuthService.checkAuthenticated(accessToken)
      .then(response => {
        if (response.data === false) {
          localStorage.removeItem(Authentication.ACCESS_TOKEN);
        }
      })
      .catch(error => {
        console.log("Error Check Authentication:", error);
        // localStorage.removeItem(Authentication.ACCESS_TOKEN);
      });

    return (
      <Layout>
        <Headers />
        <SideBar />
        <Content className="layoutContent" id="center-container">
          <Switch>
            {
              Object.keys(dataSource).map((key) => 
                dataSource[key]["subItems"].map(value =>
                  <Route path={value["route"]} component={value["component"]} />
                )
              )
            }
            <Route path="/offline" component={ offlineDB }></Route>
            <Route path="/test-component" component={ UserList }></Route>
            <Route path="/" component={Home}></Route>
          </Switch>
        </Content>
      </Layout>
    );
  }
}

function mapStateToProps(state) {
  return {
    authentication: state.reducer.client.checkAuthentication
  };
}

export default connect(mapStateToProps)(Router);


