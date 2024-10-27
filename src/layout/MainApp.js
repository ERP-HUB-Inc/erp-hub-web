import React from 'react'
import Loadable from "react-loadable"
import { Dropdown, Layout, Menu, Icon, Divider } from 'antd'
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Switch
} from "react-router-dom";
import dotenv from "dotenv";
import history from "../app/modules/common/router/history";
import Util from "../app/modules/common/util";
import configureStore from "../app/store/configureStore";
import Localization from "../app/localization";
import StartUp from "../app/modules/common/components/StartUp";
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

   onLogout = () => {
    (new Util()).logout(history)
   }
 
   render() {
    dotenv.config();
    let store = configureStore();
    store = new Localization(store);

    const Dashboard = Loadable({
      loader: () => import("../app/modules/common/containers/home"),
      loading: () => <StartUp />,
    });
    const SalesOrder = Loadable({
      loader: () => import("../app/modules/pos/components/transactions/SaleOrder"),
      loading: () => <StartUp />,
    });
    const Invoice = Loadable({
      loader: () => import("../app/modules/pos/containers/transactions/Invoice"),
      loading: () => <StartUp />,
    });
    const Quotes = Loadable({
      loader: () => import("../app/modules/pos/containers/transactions/Quotation"),
      loading: () => <StartUp />,
    });
    const Customers = Loadable({
      loader: () => import("../app/modules/crm/containers/customers/Customer"),
      loading: () => <StartUp />,
    });
    const CustomerProfile = Loadable({
      loader: () => import("../app/modules/crm/components/customers/Customer/Profile"),
      loading: () => <StartUp />,
    });

    const token = new URLSearchParams(window.location.search).get("token");
    const theme = 'light';

    return (<Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <Layout id='components-layout-demo-custom-trigger'>
              <Sider trigger={null} collapsible collapsed={this.state.collapsed} theme={theme} width={230} style={{ height: '100vh' }}>
                <div className="logo">
                  ERP HUB
                </div>
                <Menu theme={theme} mode="inline" defaultSelectedKeys={['1']}>
                  <Menu.Item key="1">
                    <Link to="/">
                        <Icon type="dashboard" />
                        <span>Dashboard</span>
                    </Link>
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
                      <Menu.Item key="21"><Link to="/sales-orders">Orders</Link></Menu.Item>
                      <Menu.Item key="22"><Link to="/quotes">Quotes</Link></Menu.Item>
                      <Menu.Item key="23"><Link to="/invoices">Invoices</Link></Menu.Item>
                      <Menu.Item key="24"><Link to="/customers">Customers</Link></Menu.Item>
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
                      <Menu.Item key="31"><Link to="/purchase-orders">Orders</Link></Menu.Item>
                      <Menu.Item key="32"><Link to="/rfps">RFPs</Link></Menu.Item>
                      <Menu.Item key="33"><Link to="/vendors">Vendors</Link></Menu.Item>
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
                      <Menu.Item key="41"><Link to="/items">Items</Link></Menu.Item>
                      <Menu.Item key="42"><Link to="/transfer">Transfers</Link></Menu.Item>
                      <Menu.Item key="43"><Link to="/adjustment">Adjustment</Link></Menu.Item>
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
                      <Menu.Item key="51">
                          <Link to="/general-ledger">General Ledger (GL)</Link>
                      </Menu.Item>
                      <Menu.Item key="52">
                          <Link to="/accounts-receivable">Accounts Receivable (AR)</Link>
                      </Menu.Item>
                      <Menu.Item key="53">
                          <Link to="/accounts-payable">Accounts Payable (AP)</Link>
                      </Menu.Item>
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
                      <Menu.Item key="61">
                        <Link to="/reports/sales">Sales Report</Link>
                      </Menu.Item>
                      <Menu.Item key="62">
                          <Link to="/reports/purchase">Purchase Report</Link>
                      </Menu.Item>
                      <Menu.Item key="63">
                          <Link to="/reports/stock">Stock Report</Link>
                      </Menu.Item>
                      <Menu.Item key="64">
                          <Link to="/reports/product">Product Report</Link>
                      </Menu.Item>
                      <Menu.Item key="65">
                          <Link to="/reports/financial">Financial Reports</Link>
                      </Menu.Item>

                    </SubMenu>

                    <Menu.Item key="7">
                      <Icon type="setting" />
                      <span>Settings</span>
                    </Menu.Item>
                  </Menu>
              </Sider>

              <Layout>
                <Header style={{ background: '#fff', padding: 0, position: 'fixed', zIndex: 1, width: "100%" }}>
                  <Icon
                    className="trigger"
                    type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                    onClick={this.toggle}
                  />

                  <Dropdown overlay={(
                    <Menu>
                      <Menu.Item>
                        <Icon type="user" />
                        Profile
                      </Menu.Item>
                      <Menu.Item>
                        <Icon type="redo" />
                        Update Now
                      </Menu.Item>
                      <Divider style={{ marginTop: 5, marginBottom: 5 }} />
                      <Menu.Item onClick={this.onLogout}>
                        <Icon type="logout" />
                        Logout
                      </Menu.Item>
                    </Menu>
                    )} trigger={["hover"]}>
                      <Link to="#">
                        Sophanna M.
                      </Link>
                  </Dropdown>
                </Header>
                <Content
                  style={{
                    margin: '24px 16px',
                    marginTop: 52,
                    padding: 24,
                    height: '100vh'
                  }}
                >
                  <Switch>
                    <Route path="/sales-orders" component={SalesOrder} />
                    <Route path="/quotes" component={Quotes} />
                    <Route path="/invoices" component={Invoice} />
                    <Route path="/customers" component={Customers} />
                    <Route path="/customer-profile/:id" component={CustomerProfile} />
                    <Route path="/" component={Dashboard} />
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