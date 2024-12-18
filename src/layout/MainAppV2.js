import React from 'react'
import Loadable from "react-loadable"
import { Dropdown, Layout, Menu, Icon, Breadcrumb, Divider } from 'antd'
import { Provider } from "react-redux"
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Switch
} from "react-router-dom";
import history from "../app/modules/common/router/history";
import Util from "../app/modules/common/util";
import configureStore from "../app/store/configureStore";
import Localization from "../app/localization";
import StartUp from "../app/modules/common/components/StartUp";
import './NewSidebar.css'
import styled from 'styled-components';

const Logo = styled.div`
  width: 120px;
  height: 31px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px 28px 16px 0;
  float: left
`

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

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

    return (<Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Router history={history}>
          <Layout>
            <Header className="header">
              <Logo />
              <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={['1']}
                style={{ lineHeight: '64px' }}
              >
                <Menu.Item key="1">Dashboard</Menu.Item>
                <Menu.Item key="2">
                  <Dropdown overlay={(
                    <Menu>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                          Orders
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                          Quotes
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                          Invoices
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                          Customer
                        </a>
                      </Menu.Item>
                    </Menu>
                  )}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      Sales <Icon type="down" />
                    </a>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="3">
                  <Dropdown overlay={(
                    <Menu>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                          Orders
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                          RFPs
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                          Vendors
                        </a>
                      </Menu.Item>
                    </Menu>
                  )}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      Purchasing <Icon type="down" />
                    </a>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="4">
                  <Dropdown overlay={(
                    <Menu>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
                          Items
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
                          Transfers
                        </a>
                      </Menu.Item>
                      <Menu.Item>
                        <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
                          Adjustment
                        </a>
                      </Menu.Item>
                    </Menu>
                  )}>
                    <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                      Inventory <Icon type="down" />
                    </a>
                  </Dropdown>
                </Menu.Item>
                <Menu.Item key="5">Finance</Menu.Item>
                <Menu.Item key="6">Report</Menu.Item>
                <Menu.Item key="7">Setting</Menu.Item>
              </Menu>
            </Header>
            <Layout>
              <Sider width={200} style={{ background: '#fff' }}>
                <Menu
                  mode="inline"
                  defaultSelectedKeys={['1']}
                  defaultOpenKeys={['sub1']}
                  style={{ height: '100%', borderRight: 0 }}
                >
                  <SubMenu
                    key="sub1"
                    title={
                      <span>
                        <Icon type="user" />
                        subnav 1
                      </span>
                    }
                  >
                    <Menu.Item key="1">option1</Menu.Item>
                    <Menu.Item key="2">option2</Menu.Item>
                    <Menu.Item key="3">option3</Menu.Item>
                    <Menu.Item key="4">option4</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub2"
                    title={
                      <span>
                        <Icon type="laptop" />
                        subnav 2
                      </span>
                    }
                  >
                    <Menu.Item key="5">option5</Menu.Item>
                    <Menu.Item key="6">option6</Menu.Item>
                    <Menu.Item key="7">option7</Menu.Item>
                    <Menu.Item key="8">option8</Menu.Item>
                  </SubMenu>
                  <SubMenu
                    key="sub3"
                    title={
                      <span>
                        <Icon type="notification" />
                        subnav 3
                      </span>
                    }
                  >
                    <Menu.Item key="9">option9</Menu.Item>
                    <Menu.Item key="10">option10</Menu.Item>
                    <Menu.Item key="11">option11</Menu.Item>
                    <Menu.Item key="12">option12</Menu.Item>
                  </SubMenu>
                </Menu>
              </Sider>
              <Layout style={{ padding: '0 24px 24px' }}>
                <Breadcrumb style={{ margin: '16px 0' }}>
                  <Breadcrumb.Item>Home</Breadcrumb.Item>
                  <Breadcrumb.Item>List</Breadcrumb.Item>
                  <Breadcrumb.Item>App</Breadcrumb.Item>
                </Breadcrumb>
                <Content
                  style={{
                    background: '#fff',
                    padding: 24,
                    margin: 0,
                    minHeight: 280,
                  }}
                >
                  Content
                </Content>
              </Layout>
            </Layout>
          </Layout>
          </Router>
        </Switch>
      </BrowserRouter>
    </Provider>);
   }
}