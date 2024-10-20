import React from 'react'
import Loadable from "react-loadable"
import { Layout, Menu, Icon } from 'antd'
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Switch
} from "react-router-dom";
import dotenv from "dotenv";
import history from "../modules/common/router/history";
import configureStore from "../store/configureStore";
import Localization from "../localization";
import StartUp from "../modules/common/components/StartUp";
import './NewSidebar.css'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderDemo extends React.Component {
   state = {
     collapsed: false,
   };
 
   toggle = () => {
     this.setState({
       collapsed: !this.state.collapsed,
     });
   };
 
   render() {
    dotenv.config();
    let store = configureStore();
    store = new Localization(store);

    const SalesOrder = Loadable({
      loader: () => import("../modules/pos/components/transactions/SaleOrder"),
      loading: () => <StartUp />,
    });
    const Invoice = Loadable({
      loader: () => import("../modules/pos/containers/transactions/Invoice"),
      loading: () => <StartUp />,
    });

    const token = new URLSearchParams(window.location.search).get("token");

    return (<Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <Layout id='components-layout-demo-custom-trigger'>
              <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{ height: '100vh' }}>
                <div className="logo">
                  ERP HUB
                </div>
                <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                <Menu.Item key="1">
                    <Icon type="dashboard" />
                    <span>Dashboard</span>
                  </Menu.Item>

                  <SubMenu
                    key="2"
                    title={
                      <span>
                        <Icon type="form" />
                        <span>Sales</span>
                      </span>
                    }
                  >
                    <Menu.Item key="21"><Link to="/salesorder">Orders</Link></Menu.Item>
                    <Menu.Item key="22">Quotes</Menu.Item>
                    <Menu.Item key="23"><Link to="/invoices">Invoices</Link></Menu.Item>
                    <Menu.Item key="24">Customers</Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="3"
                    title={
                      <span>
                        <Icon type="table" />
                        <span>Purchasing</span>
                      </span>
                    }
                  >
                    <Menu.Item key="31">Orders</Menu.Item>
                    <Menu.Item key="32">RFPs</Menu.Item>
                    <Menu.Item key="33">Vendors</Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="4"
                    title={
                      <span>
                        <Icon type="table" />
                        <span>Inventory</span>
                      </span>
                    }
                  >
                    <Menu.Item key="41">Items</Menu.Item>
                    <Menu.Item key="42">Transfers</Menu.Item>
                    <Menu.Item key="43">Adjustment</Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="5"
                    title={
                      <span>
                        <Icon type="table" />
                        <span>Finance</span>
                      </span>
                    }
                  >
                    <Menu.Item key="51">GL</Menu.Item>
                    <Menu.Item key="52">AR</Menu.Item>
                    <Menu.Item key="53">AP</Menu.Item>
                  </SubMenu>

                  <SubMenu
                    key="6"
                    title={
                      <span>
                        <Icon type="table" />
                        <span>Report</span>
                      </span>
                    }
                  >
                    <Menu.Item key="61">Sales Report</Menu.Item>
                    <Menu.Item key="62">Purchase Report</Menu.Item>
                    <Menu.Item key="63">Stock Report</Menu.Item>
                    <Menu.Item key="64">Product Report</Menu.Item>
                    <Menu.Item key="65">Financial Reports</Menu.Item>
                  </SubMenu>

                  <Menu.Item key="7">
                    <Icon type="setting" />
                    <span>Settings</span>
                  </Menu.Item>
                </Menu>
              </Sider>

              <Layout>
                <Header style={{ background: '#fff', padding: 0, position: 'fixed', zIndex: 1 }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />
                </Header>
                <Content
                  style={{
                    margin: '24px 16px',
                    marginTop: 85,
                    padding: 24,
                    background: '#fff',
                    height: '100vh'
                  }}
                >
                  <Switch>
                    <Route path="/salesorder" component={SalesOrder} />
                    <Route path="/invoices" component={Invoice} />
                  </Switch>
                </Content>
              </Layout>

            </Layout>
          </Router>
        </Switch>
      </BrowserRouter>
    </Provider>);
   }
}