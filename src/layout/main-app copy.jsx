import React from 'react'
import Loadable from "react-loadable"
import { Dropdown, Layout, Menu, Icon, Divider, Badge, Avatar, List } from "antd";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Switch
} from "react-router-dom";
import ReactGA from "react-ga4";
import { io } from "socket.io-client"
import history from '@router/index';
import Util from "../app/modules/common/util";
import configureStore from "../app/store/configureStore";
import Localization from "../app/localization";
import StartUp from "../app/modules/common/components/StartUp";
import './NewSidebar.css'
import { ERPHub, LogoTextOnly } from '../components';
import SettingsPage from '@settings/SettingPage';
import SystemLogs from '@settings/SystemLogs';
import OrdersDashboard from '@settings/OrderDashboard';
import TabletView from '@settings/TableView';
import { ColumnSelection } from '@settings/ColumnSelection';
import SystemAlertBanner from '@components/stateless/system-alert-banner';
import StockInUI from './stock-in-summary';
import ItemManagementUI from './item-management-ai';
import ItemAIGenerator from './item-ai-tool';
import StickyFooterPage from './sticky-footer';
import StockIOForm from '../pages/Inventory/StockIO/form/form.create';

const socket = io("http://202.79.29.108:8100", {
  query: { userId: "68b302034b4dec462b87b39b", deviceId: "9f7b2a50-4c1e-11ee-be56-0242ac120002" },
  transports: ["websocket"], // ensures faster connection
  reconnectionAttempts: 5,   // optional: auto-retry limit
  reconnectionDelay: 1000,   // optional: delay between retries
});

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

export default class SiderDemo extends React.Component {
   state = {
     collapsed: false,
     alertData: null
   };

   componentDidMount() {
      ReactGA.initialize("G-1MQDE7W3RC");
      // Send pageview with a custom path
      ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });

      // socket.on("training-progress", (data) => {
      //   this.setState(prev => ({
      //     ...prev.state,
      //     alertData: {
      //       type: "announcement",
      //       title: `Training ${data.modelName} ${data.status}`,
      //       message: `Dataset: ${data.dataset}, Accuracy: ${data.accuracy}%, Loss: ${data.loss}`,
      //       link: "/training/results",
      //       linkText: "View Results",
      //     },
      //   }));
      // });


      // Handle connection
      socket.on("connect", () => {
        console.log("✅ Connected to socket server");
      });

      // Handle disconnection
      socket.on("disconnect", () => {
        console.log("❌ Disconnected from socket server");
      });

      socket.on("contact-synced", (data) => {
        console.log("contact-synced", data);
      });
   }

  componentWillUnmount() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("chat-message");
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
      loader: () => import("../pages/Purchasing/Orders/form.create.bk"),
      loading: () => <StartUp />,
    });
    const UpdatePurchaseOrder = Loadable({
      loader: () => import("../pages/Purchasing/Orders/form.update"),
      loading: () => <StartUp />,
    });

    const Vendor = Loadable({
      loader: () => import("../pages/Purchasing/Vendors"),
      loading: () => <StartUp />,
    });

    const Item = Loadable({
      loader: () => import("../pages/Inventory/Items"),
      loading: () => <StartUp />,
    });
    const NewItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form.create"),
      loading: () => <StartUp />,
    });
    const EditItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form.update"),
      loading: () => <StartUp />,
    });
    const ViewItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form/item.detail"),
      loading: () => <StartUp />,
    });
    const SplitItem = Loadable({
      loader: () => import("../pages/Inventory/Items/form/item.split"),
      loading: () => <StartUp />,
    });

    const StockInOut = Loadable({
      loader: () => import("../pages/Inventory/StockIO"),
      loading: () => <StartUp />,
    });
    const NewStockInOut = Loadable({
      loader: () => import("../pages/Inventory/StockIO/form.create"),
      loading: () => <StartUp />,
    });
    const UpdateStockInOut = Loadable({
      loader: () => import("../pages/Inventory/StockIO/form.update"),
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

    // Setting
    const Category = Loadable({
      loader: () => import("@settings/Modules/Category/index"),
      loading: () => <StartUp />,
    });

    const Brand = Loadable({
      loader: () => import("@settings/Modules/Brand/index"),
      loading: () => <StartUp />,
    });

    // const token = new URLSearchParams(window.location.search).get("token");
    const theme = 'light';
    const isPOSPage = window.location.pathname === "/pos";
    const styledContent = {
      margin: '0px 0px',
      marginTop: 52,
      padding: 0,
      height: '100vh'
    }


    return (<Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <Layout id='components-layout-demo-custom-trigger'>
              {/* {
                this.state.alertData && 
                <SystemAlertBanner
                  type="announcement"
                  title="New Inventory Features Released"
                  message="We've added powerful new inventory tracking and reporting capabilities to help streamline your operations."
                  link="/features/inventory"
                  linkText="Explore Features"
                />
              } */}
              {
                !isPOSPage ?
                <Sider trigger={null} collapsible collapsed={this.state.collapsed} theme={theme} width={230} style={{ height: '100vh' }}>
                  <LogoTextOnly />
                  {/* <DynamicMenu /> */}
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
                      <Menu.Item key="42"><Link to="/inventories/stock-io">Stock In/Out</Link></Menu.Item>
                      {/* 
                        Stock In: Add stock manually with reference fields like Reason (Purchase, Adjustment, Opening Balance, Return).
                        Stock Out: Reduce stock manually with Reason (Sale, Consumption, Damaged, Return).
                        Each movement is logged in the Stock Ledger (history).
                      */}
                      {/* <Menu.Item key="43"><Link to="/inventories/transfers">Transfers</Link></Menu.Item>
                      <Menu.Item key="44"><Link to="/inventories/adjustments">Adjustment</Link></Menu.Item> */}
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
                      <Link to="/settings">
                        <Icon type="setting" />
                        <span>Settings</span>
                      </Link>
                    </Menu.Item>
                  </Menu>
                </Sider>
                :
                <React.Fragment />
              }

              <Layout>
                <Header style={{ 
                  background: '#fff', 
                  padding: 0, 
                  position: 'fixed', 
                  zIndex: 1, 
                  width: "87%",
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingRight: '24px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Icon
                      className="trigger"
                      type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'}
                      onClick={this.toggle}
                    />
                  </div>

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

                    {/* StockIO Management */}
                    <Route path="/inventories/stock-io/create" component={NewStockInOut} />
                    <Route path="/inventories/stock-io/update/:id" component={UpdateStockInOut} />
                    <Route path="/inventories/stock-io" component={StockInOut} />

                    <Route path="/inventories/transfers" component={Vendor} />
                    <Route path="/inventories/adjustments" component={Vendor} />

                    <Route path="/reports/sales-report-center" component={SaleReportCenter} />
                    <Route path="/reports/sales-report-receipt" component={SaleReportReceipt} />

                    <Route path="/settings" component={SettingsPage} />
                    <Route path="/categories" component={Category} />
                    <Route path="/brands" component={Brand} />
                    <Route path="/setting-logs" component={SystemLogs} />
                    <Route path="/order-dashboards" component={OrdersDashboard} />
                    <Route path="/table-views" component={TabletView} />
                    <Route path="/columns" component={ColumnSelection} />
                    <Route path="/stock-in-ui" component={StockInUI} />
                    <Route path="/item-ai-ui" component={ItemManagementUI} />
                    <Route path="/item-ai-generator" component={ItemAIGenerator} />
                    <Route path="/sticky-footer-page" component={StickyFooterPage} />
                    <Route path="/stock-io-form" component={StockIOForm} />

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


const NotificationMenu = () => {
  // Sample notifications - replace with your actual data
  const notifications = [
    {
      id: 1,
      title: 'New Order Received',
      description: 'Order #12345 has been placed',
      time: '5 min ago',
      type: 'order',
      read: false
    },
    {
      id: 2,
      title: 'Low Stock Alert',
      description: 'Product XYZ is running low',
      time: '1 hour ago',
      type: 'alert',
      read: false
    },
    {
      id: 3,
      title: 'Payment Confirmed',
      description: 'Invoice #67890 paid successfully',
      time: '2 hours ago',
      type: 'payment',
      read: true
    }
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getIcon = (type) => {
    switch(type) {
      case 'order': return 'shopping-cart';
      case 'alert': return 'warning';
      case 'payment': return 'dollar';
      default: return 'bell';
    }
  };

  return (
    <div style={{ width: 350, maxHeight: 400, overflow: 'auto' }}>
      <div style={{ 
        padding: '12px 16px', 
        borderBottom: '1px solid #f0f0f0',
        fontWeight: 'bold',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>Notifications</span>
        {unreadCount > 0 && (
          <Badge count={unreadCount} style={{ backgroundColor: '#52c41a' }} />
        )}
      </div>
      <List
        itemLayout="horizontal"
        dataSource={notifications}
        renderItem={item => (
          <List.Item 
            style={{ 
              padding: '12px 16px',
              cursor: 'pointer',
              backgroundColor: item.read ? '#fff' : '#f0f7ff',
              borderBottom: '1px solid #f0f0f0'
            }}
          >
            <List.Item.Meta
              avatar={
                <Avatar 
                  style={{ backgroundColor: item.read ? '#d9d9d9' : '#1890ff' }}
                  icon={getIcon(item.type)}
                />
              }
              title={<span style={{ fontSize: '14px', fontWeight: item.read ? 'normal' : 'bold' }}>{item.title}</span>}
              description={
                <div>
                  <div style={{ fontSize: '12px', color: '#595959' }}>{item.description}</div>
                  <div style={{ fontSize: '11px', color: '#8c8c8c', marginTop: 4 }}>{item.time}</div>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ 
        padding: '12px 16px', 
        textAlign: 'center',
        borderTop: '1px solid #f0f0f0',
        cursor: 'pointer',
        color: '#1890ff'
      }}>
        <Link to="/notifications">View All Notifications</Link>
      </div>
    </div>
  );
};
