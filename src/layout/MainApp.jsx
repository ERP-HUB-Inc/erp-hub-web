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
import ReactGA from "react-ga4";
import history from "../app/modules/common/router/history";
import Util from "../app/modules/common/util";
import configureStore from "../app/store/configureStore";
import Localization from "../app/localization";
import StartUp from "../app/modules/common/components/StartUp";
import './NewSidebar.css'
import { ERPHub } from '../components';
import Item from "../pages/Inventory/Items";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderDemo extends React.Component {
   state = {
     collapsed: false,
   };

   componentDidMount() {
      ReactGA.initialize("G-1MQDE7W3RC");
      // Send pageview with a custom path
      ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });
   }
 
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
    
    const POS = Loadable({
      loader: () => import("../app/modules/pos/containers/transactions/SaleWalkin"),
      loading: () => <StartUp />,
    });
    
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
    const InvoiceDetail = Loadable({
      loader: () => import("../app/modules/pos/components/transactions/Invoice/Detail"),
      loading: () => <StartUp />,
    });
    const NewInoice = Loadable({
      loader: () => import("../app/modules/pos/components/transactions/Invoice/FormItem"),
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

    // Purchasing
    const PurchaseOrder = Loadable({
      loader: () => import("../pages/Purchasing/Orders"),
      loading: () => <StartUp />,
    });
    const NewPurchaseOrder = Loadable({
      loader: () => import("../pages/Purchasing/Orders/FormCreate"),
      loading: () => <StartUp />,
    });
    const UpdatePurchaseOrder = Loadable({
      loader: () => import("../pages/Purchasing/Orders/FormUpdate"),
      loading: () => <StartUp />,
    });

    const Vendor = Loadable({
      loader: () => import("../pages/Purchasing/Vendors"),
      loading: () => <StartUp />,
    });

    // const Item = Loadable({
    //   loader: () => import("../pages/Inventory/Items"),
    //   loading: () => <StartUp />,
    // });
    const NewItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form.create"),
      loading: () => <StartUp />,
    });
    const EditItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form.update"),
      loading: () => <StartUp />,
    });
    const ViewItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form/ProductDetail"),
      loading: () => <StartUp />,
    });
    const SplitItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form/ProductSplit"),
      loading: () => <StartUp />,
    });

    // Reporting
    const SaleReportCenter = Loadable({
      loader: () => import("../pages/Report/index"),
      loading: () => <StartUp />,
    });
    const SaleReportReceipt = Loadable({
      loader: () => import("../pages/Report/ReportSaleReceipt"),
      loading: () => <StartUp />,
    });


    // const token = new URLSearchParams(window.location.search).get("token");
    const theme = 'light';
    const isPOSPage = window.location.pathname === "/pos";
    const styledContent = {
      margin: '24px 16px',
      marginTop: 52,
      padding: 24,
      height: '100vh'
    }

    return (<Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <Layout id='components-layout-demo-custom-trigger'>
              {
                !isPOSPage ?
                <Sider trigger={null} collapsible collapsed={this.state.collapsed} theme={theme} width={230} style={{ height: '100vh' }}>
                  <ERPHub>
                    ERP HUB
                  </ERPHub>
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
                            <Icon type="dollar" />
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
                            <Icon type="shopping" />
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
                            <Icon type="inbox" />
                            <span>Inventory</span>
                          </span>
                        }
                      >
                        <Menu.Item key="41"><Link to="/inventories/items">Items</Link></Menu.Item>
                        <Menu.Item key="42"><Link to="/inventories/transfers">Stock In/Out</Link></Menu.Item>
                        {/* 
                          Stock In: Add stock manually with reference fields like Reason (Purchase, Adjustment, Opening Balance, Return).
                          Stock Out: Reduce stock manually with Reason (Sale, Consumption, Damaged, Return).
                          Each movement is logged in the Stock Ledger (history).
                        */}
                        <Menu.Item key="43"><Link to="/inventories/transfers">Transfers</Link></Menu.Item>
                        <Menu.Item key="44"><Link to="/inventories/adjustments">Adjustment</Link></Menu.Item>
                      </SubMenu>

                      <SubMenu
                        key="5"
                        title={
                          <span>
                            <Icon type="bank" />
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
                            <Icon type="bar-chart" />
                            <span>Report</span>
                          </span>
                        }
                      >
                        <Menu.Item key="61">
                          <Link to="/reports/sales-report-center">Sales Report</Link>
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
                :
                <React.Fragment />
              }

              <Layout>
                {
                  !isPOSPage ?
                  <Header style={{ background: '#fff', padding: 0, position: 'fixed', zIndex: 1, width: "100%" }}>
                    <Icon
                      className="trigger"
                      type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.toggle}
                    />
                    <Link to={"/pos"}>POS</Link>
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
                          Marco JR
                        </Link>
                    </Dropdown>
                  </Header>
                  :
                  <React.Fragment />
                }
                <Content
                  style={isPOSPage ? { height: "100vh"} : styledContent}
                  id="center-container"
                >
                  <Switch>
                    <Route path="/pos" component={POS} />
                    <Route path="/sales-orders" component={SalesOrder} />
                    <Route path="/quotes" component={Quotes} />
                    
                    <Route path="/invoices/view/:id" component={InvoiceDetail} />
                    <Route path="/invoices/create" component={NewInoice} />
                    <Route path="/invoices/update/:id" component={NewInoice} />
                    <Route path="/invoices" component={Invoice} />
                    
                    <Route path="/customers" component={Customers} />
                    <Route path="/customer-profile/:id" component={CustomerProfile} />
                    
                    <Route path="/purchase-orders/create" component={NewPurchaseOrder} />
                    <Route path="/purchase-orders/update/:id" component={UpdatePurchaseOrder} />
                    <Route path="/purchase-orders" component={PurchaseOrder} />

                    <Route path="/vendors/create" component={Vendor} />
                    <Route path="/vendors/update/:id" component={Vendor} />
                    <Route path="/vendors" component={Vendor} />

                    <Route path="/inventories/items/create" component={NewItem} />
                    <Route path="/inventories/items/update/:id" component={EditItem} />
                    <Route path="/inventories/items/view/:id" component={ViewItem} />
                    <Route path="/inventories/items/split/:productVariantId" component={SplitItem} />
                    <Route path="/inventories/items" component={Item} />
                    <Route path="/inventories/transfers" component={Vendor} />
                    <Route path="/inventories/adjustments" component={Vendor} />

                    <Route path="/reports/sales-report-center" component={SaleReportCenter} />
                    <Route path="/reports/sales-report-receipt" component={SaleReportReceipt} />

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