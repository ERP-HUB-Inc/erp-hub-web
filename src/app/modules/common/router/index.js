import React from "react";
// import {Offline} from "react-detect-offline";
import {Layout} from "antd";
import {Route, Switch} from "react-router-dom";
import {connect} from "react-redux";
import history from "./history";
import Home from "../containers/home";
import SideBar from "../components/layout/SiderBar";
import Headers from "../containers/layout/Header";
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
          history.push("/signin");
        }
      })
      .catch(error => {
      });

    return (
      <Layout>
        {/* <Offline>
          <div id="offline">
            <this.Alert
              message="No internet connection"
              description="You are currently offline, please connect to internet. Before continue your work."
              type="warning"
              showIcon/>
          </div>
        </Offline> */}
        <Headers />
        <SideBar />
        <Content className="layoutContent" id="center-container">
          <Switch>
            {
              Object.keys(dataSource).map((key) => 
                dataSource[key]["subItems"].map(value =>
                  <Route
                    async
                    path={value["route"]}
                    component={value["component"]} />
                )
              )
            }
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


