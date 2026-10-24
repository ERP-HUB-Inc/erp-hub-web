import SystemAlertBanner from '@components/stateless/system-alert-banner';
import StockIOAIImport from '@inventories/StockIO/form/form.ai-import';
import StockIOBulkImport from '@inventories/StockIO/form/form.bulk-import';
import history from '@router/index';
import { ColumnSelection } from '@settings/ColumnSelection';
import OrdersDashboard from '@settings/OrderDashboard';
import SettingsPage from '@settings/SettingPage';
import SystemLogs from '@settings/SystemLogs';
import TabletView from '@settings/TableView';
import { Avatar, Badge, Button, Divider, Dropdown, Icon, Layout, List, Menu, Tooltip, message } from "antd";
import { Bell, ChevronDown, RefreshCw } from "lucide-react";
import React from 'react';
import ReactGA from "react-ga4";
import Loadable from "react-loadable";
import { Provider } from "react-redux";
import {
  BrowserRouter,
  Link,
  Redirect,
  Route,
  Router,
  Switch
} from "react-router-dom";
import { io } from "socket.io-client";
import Localization from "../app/localization";
import StartUp from "../app/modules/common/components/StartUp";
import Util from "../app/modules/common/util";
import configureStore from "../app/store/configureStore";
import { LogoTextOnly } from '../components';
import packageMetadata from '../../package.json';
import { getSidebarDefaultKeys } from './sidebar-navigation';
import SidebarHealthStatus from './sidebar-health-status';
import SidebarToggleButton from './sidebar-toggle-button';
import OnboardingService, { getResponseData } from '../pages/Onboarding/OnboardingService';
import StockIOForm from '../pages/Inventory/StockIO/form/form.create';
import ItemAIGenerator from './item-ai-tool';
import ItemManagementUI from './item-management-ai';
import './NewSidebar.css';
import Receipt from './receipt';
import SalesDashboard from './sales-dashboard';
import StickyFooterPage from './sticky-footer';
import StockInUI from './stock-in-summary';
import VendorDetailPage from './vendor-detail';
import POSPaymentDrawer from './payment-screen';
import POSMonitor from './pos-monitor';
import Login from './login';
import OnboardingPage from '../pages/Onboarding';

const socket = io("http://127.0.0.1:8100", {
  query: { userId: "68b302034b4dec462b87b39b", deviceId: "9f7b2a50-4c1e-11ee-be56-0242ac120002" },
   // ensures faster connection
  reconnectionAttempts: 5,   // optional: auto-retry limit
  reconnectionDelay: 5000,   // optional: delay between retries
});

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const APP_VERSION = process.env.REACT_APP_VERSION || packageMetadata.version;
const HEADER_UNREAD_NOTIFICATION_COUNT = 2;
const ONBOARDING_SETUP_PATH = "/onboarding/setup";
const ONBOARDING_WORK_PATHS = [
  "/inventories/items/create",
  "/inventories/items",
  "/inventories/stock-io/create",
  "/vendors/create"
];

class OnboardingStatusRoute extends React.Component {
  state = { loading: true, status: null, error: false };

  componentDidMount() {
    this.loadStatus();
  }

  async loadStatus() {
    this.setState({ loading: true, error: false });
    try {
      const response = await OnboardingService.getStatus();
      const result = getResponseData(response);
      if (!result || !result.status) throw new Error("Missing onboarding status");
      this.setState({ status: result.status, loading: false });
    } catch (error) {
      this.setState({ error: true, loading: false });
    }
  }

  render() {
    const { component: Component, location, mode } = this.props;
    const { loading, status, error } = this.state;

    if (loading) return <StartUp />;
    if (error) {
      return (
        <div role="alert" style={{ padding: 32, textAlign: "center" }}>
          <p>We couldn’t verify your workspace setup.</p>
          <button type="button" onClick={() => this.loadStatus()}>Retry</button>
        </div>
      );
    }

    const inProgress = status === "IN_PROGRESS";
    if (mode === "onboarding") {
      return inProgress ? <Component {...this.props} /> : <Redirect to="/" />;
    }

    const isOnboardingWorkPath = ONBOARDING_WORK_PATHS.some(path =>
      location.pathname === path || location.pathname.indexOf(`${path}/`) === 0
    );
    if (inProgress && !isOnboardingWorkPath) {
      return <Redirect to={ONBOARDING_SETUP_PATH} />;
    }

    return <Component {...this.props} />;
  }
}

const ProtectedRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => (
      (new Util()).getAuthSession()
        ? <OnboardingStatusRoute {...props} key={props.location.pathname} component={Component} />
        : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />
    )}
  />
);

class OnboardingTokenHandoff extends React.Component {
  componentDidMount() {
    const { token, location, history } = this.props;
    const query = new URLSearchParams(location.search);
    const util = new Util();

    util.setAuthSession({ ...(util.getAuthSession() || {}), accessToken: token });
    query.delete("token");
    const search = query.toString();
    history.replace({
      pathname: location.pathname,
      search: search ? `?${search}` : "",
      hash: location.hash
    });
  }

  render() {
    return <StartUp />;
  }
}

const OnboardingRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      const query = new URLSearchParams(props.location.search);
      const token = query.get("token");
      const util = new Util();

      if (token) {
        return <OnboardingTokenHandoff {...props} token={token} />;
      }

      return util.getAuthSession()
        ? <OnboardingStatusRoute {...props} key={props.location.pathname} component={Component} mode="onboarding" />
        : <Redirect to={{ pathname: "/login", state: { from: props.location } }} />;
    }}
  />
);

// Stable route components preserve page state when the sidebar toggles.
const POS = Loadable({
  loader: () => import("../app/modules/pos/containers/transactions/SaleWalkin"),
  loading: () => <StartUp />,
});

const Dashboard = Loadable({
  loader: () => import("../pages/Dashboard/ERPSalesDashboard"),
  loading: () => <StartUp />,
});

const SalesOrder = Loadable({
  loader: () => import("../pages/Sales/Order"),
  loading: () => <StartUp />,
});

const SalesOrderCreate = Loadable({
  loader: () => import("../pages/Sales/Order/form.create"),
  loading: () => <StartUp />,
});

const SalesOrderEdit = Loadable({
  loader: () => import("../pages/Sales/Order/form.update"),
  loading: () => <StartUp />,
});

const SalesOrderDetail = Loadable({
  loader: () => import("../app/modules/pos/components/transactions/SaleOrder/detail"),
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
  loader: () => import("../pages/Purchasing/Orders/form.create"),
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
const ImportItem = Loadable({
  loader: () => import("../pages/Inventory/Items/import"),
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
const PurchaseReport = Loadable({
  loader: () => import("../app/modules/pos/components/reports/Purchase/PurchaseReport"),
  loading: () => <StartUp />,
});
const SaleReportCenter = Loadable({
  loader: () => import("../pages/Report/index"),
  loading: () => <StartUp />,
});
const SaleReport = Loadable({
  loader: () => import("../app/modules/pos/components/reports/Sale/SalesReport"),
  loading: () => <StartUp />,
});
const FinancialReport = Loadable({
  loader: () => import("../app/modules/pos/components/reports/Financial/FinancialReport"),
  loading: () => <StartUp />,
});
const ReportStock = Loadable({
  loader: () => import("../app/modules/pos/containers/reports/StockReport"),
  loading: () => <StartUp />,
});
const ReportProduct = Loadable({
  loader: () => import("../app/modules/pos/containers/reports/Product"),
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

export default class SiderDemo extends React.Component {
   store = new Localization(configureStore());

   state = {
     collapsed: false,
     alertData: null,
     currentPath: window.location.pathname,
     currentSearch: window.location.search,
     sidebarOpenKeys: getSidebarDefaultKeys(window.location.pathname, window.location.search).openKeys
   };

   componentDidMount() {
      ReactGA.initialize("G-1MQDE7W3RC");
      // Send pageview with a custom path
      ReactGA.send({ hitType: "pageview", page: "/landingpage", title: "Landing Page" });

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

      this.unlistenHistory = history.listen(location => {
        if (location.pathname !== this.state.currentPath || location.search !== this.state.currentSearch) {
          const nextKeys = getSidebarDefaultKeys(location.pathname, location.search);
          this.setState(previous => ({
            currentPath: location.pathname,
            currentSearch: location.search,
            sidebarOpenKeys: Array.from(new Set([...previous.sidebarOpenKeys, ...nextKeys.openKeys]))
          }));
        }
      });
   }

  componentWillUnmount() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("chat-message");
    if (this.unlistenHistory) this.unlistenHistory();
  }

   toggle = () => {
     this.setState({
       collapsed: !this.state.collapsed,
     });
   };

   onLogout = () => {
    localStorage.removeItem("ACCESS_TOKEN");
    localStorage.removeItem("STORE_ACCESS_TOKEN");
    window.location.replace("/login");
   }

   handleUpdate = () => {
    message.info("Application update flow is not connected yet.");
   }

   getHeaderUser() {
    const user = (new Util()).getCurrentUser() || {};
    const displayName = user.fullName || user.displayName || user.name || user.userName || user.username || "User";
    const roleName = user.roleName || user.position || (user.role && user.role.name) || user.roleCode || "Signed in";
    const avatar = user.photo || user.avatar || user.imageUrl;

    return {
      displayName,
      roleName,
      avatar,
      initials: this.getInitials(displayName),
    };
   }

   getInitials(name) {
    return String(name || "User")
      .trim()
      .split(/\s+/)
      .map(part => part.charAt(0))
      .join("")
      .slice(0, 2)
      .toUpperCase();
   }

   renderUserMenu() {
    return (
      <Menu className="market-header-profile-menu">
        <Menu.Item>
          <Link to="/profile">
            <Icon type="user" />
            <span>Profile</span>
          </Link>
        </Menu.Item>
        <Menu.Item onClick={this.handleUpdate}>
          <Icon type="redo" />
          <span>Update Now</span>
        </Menu.Item>
        <Divider style={{ marginTop: 5, marginBottom: 5 }} />
        <Menu.Item onClick={this.onLogout}>
          <Icon type="logout" />
          <span>Logout</span>
        </Menu.Item>
      </Menu>
    );
   }

   render() {
    const store = this.store;

    // const token = new URLSearchParams(window.location.search).get("token");
    const theme = 'light';
    const hasAuthSession = Boolean((new Util()).getAuthSession());
    const isOnboardingPage = this.state.currentPath.indexOf("/onboarding/") === 0;
    const isFullScreenPage = ["/pos", "/login"].includes(this.state.currentPath) || isOnboardingPage || !hasAuthSession;
    const sidebarDefaultKeys = getSidebarDefaultKeys(this.state.currentPath, this.state.currentSearch);
    const headerUser = this.getHeaderUser();
    const notificationCount = HEADER_UNREAD_NOTIFICATION_COUNT > 9 ? "9+" : HEADER_UNREAD_NOTIFICATION_COUNT;
    const styledContent = {
      margin: '0px 0px',
      // marginTop: 52,
      padding: 0,
      paddingTop: 58,
      height: '100vh'
    }


    return (
      <Provider store={store}>
        <BrowserRouter>
          <Switch>
            <Router history={history}>
              <Layout id="components-layout-demo-custom-trigger" className={this.state.collapsed ? "market-layout-sidebar-collapsed" : undefined}>
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
                {!isFullScreenPage ? (
                  <Sider className="market-sidebar" trigger={null} collapsible collapsed={this.state.collapsed} theme={theme} width={230} style={{ height: "100vh" }}>
                    <LogoTextOnly collapsed={this.state.collapsed} />
                    <nav id="market-sidebar-navigation" className="market-sidebar-navigation" aria-label="Main navigation">
                    {/* <DynamicMenu /> */}
                    <Menu
                      theme={theme}
                      mode="inline"
                      className="market-sidebar-menu"
                      selectedKeys={sidebarDefaultKeys.selectedKeys}
                      {...(!this.state.collapsed ? { openKeys: this.state.sidebarOpenKeys } : {})}
                      onOpenChange={sidebarOpenKeys => {
                        if (!this.state.collapsed) this.setState({ sidebarOpenKeys });
                      }}
                    >
                      <Menu.ItemGroup key="operations" title="OPERATIONS & CORE">
                        <Menu.Item key="1" title="Dashboard">
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
                          <Menu.Item key="21">
                            <Link to="/sales">All Sales</Link>
                          </Menu.Item>
                          {/* <Menu.Item key="22">
                            <Link to="/quotes">Quotes</Link>
                          </Menu.Item> */}
                          {/* <Menu.Item key="23">
                            <Link to="/invoices">Invoices</Link>
                          </Menu.Item> */}
                          <Menu.Item key="24">
                            <Link to="/customers">Customers</Link>
                          </Menu.Item>
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
                          <Menu.Item key="31">
                            <Link to="/purchase-orders">Orders</Link>
                          </Menu.Item>
                          {/* <Menu.Item key="32"><Link to="/rfps">RFPs</Link></Menu.Item> */}
                          <Menu.Item key="33">
                            <Link to="/vendors">Vendors</Link>
                          </Menu.Item>
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
                          <Menu.Item key="41">
                            <Link to="/inventories/items">Items</Link>
                          </Menu.Item>
                          <Menu.Item key="42">
                            <Link to="/inventories/stock-io">Stock Movement</Link>
                          </Menu.Item>
                          <Menu.Item key="43">
                            <Link to="/inventories/items">Pricing Management</Link>
                          </Menu.Item>
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
                            <Link to="/reports/sales-report">Sales Report</Link>
                          </Menu.Item>
                          <Menu.Item key="62">
                            <Link to="/reports/purchases">Purchase Report</Link>
                          </Menu.Item>
                          <Menu.Item key="63">
                            <Link to="/reports/stock">Stock Report</Link>
                          </Menu.Item>
                          <Menu.Item key="64">
                            <Link to="/reports/items">Item Report</Link>
                          </Menu.Item>
                          <Menu.Item key="65">
                            <Link to="/reports/financial">Financial Reports</Link>
                          </Menu.Item>
                        </SubMenu>

                      </Menu.ItemGroup>
                      <Menu.ItemGroup key="system" title="SYSTEM & SECURITY">
                        <Menu.Item key="8" title="User Management">
                          <Link to="/settings?tab=users">
                            <Icon type="team" />
                            <span>User Management</span>
                          </Link>
                        </Menu.Item>
                        <Menu.Item key="7" title="System Setting">
                          <Link to="/settings">
                            <Icon type="setting" />
                            <span>System Setting</span>
                          </Link>
                        </Menu.Item>
                      </Menu.ItemGroup>
                    </Menu>
                    </nav>
                    <SidebarHealthStatus collapsed={this.state.collapsed} />
                  </Sider>
                ) : (
                  <React.Fragment />
                )}

                <Layout>
                  {!isFullScreenPage && (
                    <Header
                      className="market-app-header"
                      style={{
                        background: "#fff",
                        padding: 0,
                        position: "fixed",
                        zIndex: 1,
                        // width: "87%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        paddingRight: "24px",
                      }}
                    >
                      {/* <div style={{ display: "flex", alignItems: "center" }}>
                        <Icon className="trigger" type={this.state.collapsed ? "menu-unfold" : "menu-fold"} onClick={this.toggle} />
                      </div> */}
                      <div className="market-header-left-spacer" />
                      <div className="market-header-right-actions">
                        <SidebarToggleButton collapsed={this.state.collapsed} onToggle={this.toggle} />
                        <span className="market-header-version">v{APP_VERSION}</span>
                        <Tooltip title="Check for updates">
                          <Button className="market-header-update-button" onClick={this.handleUpdate}>
                            <RefreshCw size={14} />
                            <span>Update</span>
                          </Button>
                        </Tooltip>
                        <Dropdown overlay={<NotificationMenu />} trigger={["click"]} placement="bottomRight">
                          <button type="button" className="market-header-icon-button" aria-label="Notifications">
                            <Badge count={notificationCount} className="market-header-notification-badge">
                              <Bell size={18} />
                            </Badge>
                          </button>
                        </Dropdown>
                        <Dropdown overlay={this.renderUserMenu()} trigger={["click"]} placement="bottomRight">
                          <button type="button" className="market-header-user-button">
                            <Avatar size={34} src={headerUser.avatar} className="market-header-avatar">
                              {headerUser.initials}
                            </Avatar>
                            <span className="market-header-user-copy">
                              <strong>{headerUser.displayName}</strong>
                              <span>{headerUser.roleName}</span>
                            </span>
                            <ChevronDown size={14} />
                          </button>
                        </Dropdown>
                      </div>
                    </Header>
                  )}

                  <Content
                    className={isOnboardingPage ? "mc-onboarding-content" : undefined}
                    style={isOnboardingPage ? { minHeight: "100vh", margin: 0, padding: 0, overflowY: "auto" } : isFullScreenPage ? { height: "100vh" } : styledContent}
                    id="center-container"
                  >
                    <Switch>
                      <Route path="/login" component={Login} />
                      <Route exact path="/onboarding/location" render={props => <Redirect to={{ pathname: ONBOARDING_SETUP_PATH, search: props.location.search }} />} />
                      <OnboardingRoute path="/onboarding/setup" component={OnboardingPage} />
                      <ProtectedRoute path="/pos" component={POS} />
                      <ProtectedRoute path="/sales/create" component={SalesOrderCreate} />
                      <ProtectedRoute path="/sales/update/:id" component={SalesOrderEdit} />
                      <ProtectedRoute path="/sales" component={SalesOrder} />
                      <ProtectedRoute path="/transactions/sale-order/detail/:id" component={SalesOrderDetail} />
                      <ProtectedRoute path="/quotes" component={Quotes} />
                      <ProtectedRoute path="/invoices/view/:id" component={InvoiceDetail} />
                      <ProtectedRoute path="/invoices/create" component={NewInoice} />
                      <ProtectedRoute path="/invoices/update/:id" component={NewInoice} />
                      <ProtectedRoute path="/invoices" component={Invoice} />
                      <ProtectedRoute path="/customers" component={Customers} />
                      <ProtectedRoute path="/customer-profile/:id" component={CustomerProfile} />
                      <ProtectedRoute path="/purchase-orders/create" component={NewPurchaseOrder} />
                      <ProtectedRoute path="/purchase-orders/update/:id" component={UpdatePurchaseOrder} />
                      <ProtectedRoute path="/purchase-orders" component={PurchaseOrder} />
                      <ProtectedRoute path="/vendors/create" component={Vendor} />
                      <ProtectedRoute path="/vendors/update/:id" component={Vendor} />
                      <ProtectedRoute path="/vendors" component={Vendor} />
                      <ProtectedRoute path="/inventories/items/import" component={ImportItem} />
                      <ProtectedRoute path="/inventories/items/create" component={NewItem} />
                      <ProtectedRoute path="/inventories/items/update/:id" component={EditItem} />
                      <ProtectedRoute path="/inventories/items/view/:id" component={ViewItem} />
                      <ProtectedRoute path="/inventories/items/split/:productVariantId" component={SplitItem} />
                      <ProtectedRoute path="/inventories/items" component={Item} />
                      {/* StockIO Management */}
                      <ProtectedRoute path="/inventories/stock-io/create" component={NewStockInOut} />
                      <ProtectedRoute path="/inventories/stock-io/update/:id" component={UpdateStockInOut} />
                      <ProtectedRoute path="/inventories/stock-io/import" component={StockIOBulkImport} />
                      <ProtectedRoute path="/inventories/stock-io/ai-import" component={StockIOAIImport} />
                      <ProtectedRoute path="/inventories/stock-io" component={StockInOut} />
                      <ProtectedRoute path="/inventories/transfers" component={Vendor} />
                      <ProtectedRoute path="/inventories/adjustments" component={Vendor} />
                      <ProtectedRoute path="/reports/sales-report-center" component={SaleReportCenter} />
                      <ProtectedRoute path="/reports/sales-report" component={SaleReport} />
                      <ProtectedRoute path="/reports/financial" component={FinancialReport} />
                      <ProtectedRoute path="/settings" component={SettingsPage} />
                      <ProtectedRoute path="/categories" component={Category} />
                      <ProtectedRoute path="/brands" component={Brand} />
                      <ProtectedRoute path="/setting-logs" component={SystemLogs} />

                      {/* Report */}
                      <ProtectedRoute path="/reports/items" component={ReportProduct} />
                      <ProtectedRoute path="/reports/purchases" component={PurchaseReport} />
                      <ProtectedRoute path="/reports/stock" component={ReportStock} />
                      {/* <Route path="/receipt" component={POSPaymentDrawer} /> */}
                      <ProtectedRoute path="/receipt" component={Receipt} />
                      <ProtectedRoute path="/SalesDashboard" component={SalesDashboard} />
                      <ProtectedRoute path="/order-dashboards" component={OrdersDashboard} />
                      <ProtectedRoute path="/table-views" component={TabletView} />
                      <ProtectedRoute path="/columns" component={ColumnSelection} />
                      <ProtectedRoute path="/stock-in-ui" component={POSMonitor} />
                      <ProtectedRoute path="/item-ai-ui" component={ItemManagementUI} />
                      <ProtectedRoute path="/item-ai-generator" component={ItemAIGenerator} />
                      <ProtectedRoute path="/sticky-footer-page" component={StickyFooterPage} />
                      <ProtectedRoute path="/stock-io-form" component={StockIOForm} />
                      <ProtectedRoute path="/vendor-detail" component={VendorDetailPage} />
                      <ProtectedRoute path="/" component={Dashboard} />
                    </Switch>
                  </Content>
                </Layout>
              </Layout>
            </Router>
          </Switch>
        </BrowserRouter>
      </Provider>
    );
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
