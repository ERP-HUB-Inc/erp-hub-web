import React from "react";
// import {Offline} from "react-detect-offline";
import { Layout } from "antd";
import {
  Route,
  Switch
} from "react-router-dom";
import { connect } from "react-redux";
import history from "./history";
import Profile from "../containers/user/Profile";
import Home from "../containers/home";
import SideBar from "../components/layout/SiderBar";
import Headers from "../containers/layout/Header";
import Component from "../components/Component";
import dataSource from "../components/layout/SiderBar/datasource";
import AuthService from "../services/AuthService";
import Authentication from "../constants/authentication";
import Util from "../util";
import ProductCreate from "../../inventory/containers/products/Product/FormCreate";
import ProductSplit from "../../inventory/components/products/Product/ProductSplit";
import ProductUpdate from "../../inventory/containers/products/Product/FormUpdate";
import ProductDetail from "../../inventory/components/products/Product/ProductDetail";
import ProductImport from "../../inventory/components/products/Product/FormImport";
import PromotionCreate from "../../inventory/components/products/Promotion/FormItem";
import PromotionUpdate from "../../inventory/components/products/Promotion/FormItem";
import EmployeeCreate from "../../hr/containers/employees/Employee/FormCreate";
import EmployeeUpdate from "../../hr/containers/employees/Employee/FormUpdate";
import AdjustmentCreate from "../../inventory/containers/stock/StockAdjustmentRequest/FormCreate";
import AdjustmentUpdate from "../../inventory/containers/stock/StockAdjustmentRequest/FormUpdate";
import StockTransferCreate from "../../inventory/containers/stock/StockTransfer/FormCreate";
import StockTransferUpdate from "../../inventory/containers/stock/StockTransfer/FormUpdate";
import PurchaseOrderCreate from "../../inventory/containers/stock/PurchaseOrder/FormCreate";
import PurchaseOrderUpdate from "../../inventory/containers/stock/PurchaseOrder/FormUpdate";
import ReportSaleSummary from "../../pos/components/reports/Sale/ReportSaleSummary";
import ReportSaleByProduct from "../../pos/containers/reports/Sale/ReportSaleByProduct";
import ReportSaleReceipt from "../../pos/containers/reports/Sale/ReportSaleReceipt";
import ReportSaleByCategory from "../../pos/components/reports/Sale/ReportSaleByCategory";
import ReportSaleByCashier from "../../pos/components/reports/Sale/ReportSaleByCashier";
import ReportSaleByCustomer from "../../pos/components/reports/Sale/ReportSaleByCustomer";
import ReportSaleByLocation from "../../pos/components/reports/Sale/ReportSaleByLocation";
import ReportPurchaseSummary from "../../pos/components/reports/Purchase/ReportPurchaseSummary";
import ReportPurchaseByProduct from "../../pos/components/reports/Purchase/ReportPurchaseByProduct";
import ReportPurchaseBySupplier from "../../pos/components/reports/Purchase/ReportPurchaseBySupplier";
import ReportConsignmentSummary from "../../pos/components/reports/Stock/Consignment/ReportConsignmentSummary";
import ReportConsignmentByProduct from "../../pos/components/reports/Stock/Consignment/ReportConsignmentByProduct";
import POS from "../../pos/containers/transactions/SaleWalkin";
import OpenSaleRegistration from "../../pos/containers/transactions/OpenSaleRegistration";
import InvoiceCreate from "../../pos/components/transactions/Invoice/FormItem";
import InvoiceUpdate from "../../pos/components/transactions/Invoice/FormItem";
import InvoiceDetail from "../../pos/components/transactions/Invoice/Details";
import InvoiceReceipt from "../../pos/components/transactions/receipt";
import SaleOrderCreate from "../../pos/components/transactions/SaleOrder/FormItem";
import SaleOrderUpdate from "../../pos/components/transactions/SaleOrder/FormItem";
import SaleOrderDetail from "../../pos/components/transactions/SaleOrder/detail";
import ExportPDFPurchaseSummary from "../../pos/components/reports/Purchase/ExportPDFPurchaseSummary";
import ExportPDFPurchaseByProduct from "../../pos/components/reports/Purchase/ExportPDFPurchaseByProduct";
import ExportPDFSaleByProduct from "../../pos/components/reports/Sale/ExportPDFSaleByProduct";
import ExportPDFSalesReceipt from "../../pos/components/reports/Sale/ExportPDFSalesReceipt";
import PrintPDF from "../../pos/components/settings/OperationRecord/PrintPDF";

const { Content } = Layout;

class Router extends Component {
  lastPath = "";
  componentDidUpdate() {
    if (window.location.pathname !== this.lastPath) {
      this.lastPath = window.location.pathname;
      const accessToken = (new Util()).getAccessToken(Authentication.ACCESS_TOKEN);

      AuthService.checkAuthenticated(accessToken)
        .then(response => {
          if (response.data === false) {
            localStorage.removeItem(Authentication.ACCESS_TOKEN);
            history.push("/signin");
          }
        });
    }
  }

  render() {
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
        <Content className={`layoutContent${window.location.pathname === "/pos" ? "full-screen" : ""}`} id="center-container">
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
            <Route path="/pos" component={POS} />
            <Route path="/transactions/saleregister" component={OpenSaleRegistration} />
            <Route path="/transactions/create-invoice" component={InvoiceCreate} />
            <Route path="/transactions/update-invoice/:id" component={InvoiceUpdate} />
            <Route path="/transactions/detail-invoice/:id" component={InvoiceDetail} />
            <Route path="/transactions/invoice-receipt/:id" component={InvoiceReceipt} />
            <Route path="/transactions/sale-order/create" component={SaleOrderCreate} />
            <Route path="/transactions/sale-order/update/:id" component={SaleOrderUpdate} />
            <Route path="/transactions/sale-order/detail/:id" component={SaleOrderDetail} />
            <Route path="/products/create" component={ProductCreate} />
            <Route path="/products/import" component={ProductImport} />
            <Route path="/products/split/:productVariantId" component={ProductSplit} />
            <Route path="/products/update/:id" component={ProductUpdate} />
            <Route path="/products/detail/:id" component={ProductDetail} />
            <Route path="/promotions/create" component={PromotionCreate} />
            <Route path="/promotions/update/:id" component={PromotionUpdate} />
            <Route path="/stocks/adjustment/create" component={AdjustmentCreate} />
            <Route path="/stocks/adjustment/update/:id" component={AdjustmentUpdate} />
            <Route path="/stocks/transfer/create" component={StockTransferCreate} />
            <Route path="/stocks/transfer/update/:id" component={StockTransferUpdate} />
            <Route path="/stocks/purchase/create" component={PurchaseOrderCreate} />
            <Route path="/stocks/purchase/update/:id" component={PurchaseOrderUpdate} />
            <Route path="/employees/create" component={EmployeeCreate} />
            <Route path="/employees/update/:id" component={EmployeeUpdate} />
            <Route path="/reports/sale_summaries" component={ReportSaleSummary} />
            <Route path="/reports/expense/pdf-preview" component={PrintPDF} />
            <Route path="/reports/sold_products/pdf-preview" component={ExportPDFSaleByProduct} />
            <Route path="/reports/sold_products" component={ReportSaleByProduct} />
            <Route path="/reports/sales_receipt/pdf-preview" component={ExportPDFSalesReceipt} />
            <Route path="/reports/sales_receipt" component={ReportSaleReceipt} />
            <Route path="/reports/sold_categories" component={ReportSaleByCategory} />
            <Route path="/reports/sold_cashiers" component={ReportSaleByCashier} />
            <Route path="/reports/sold_customers" component={ReportSaleByCustomer} />
            <Route path="/reports/sold_locations" component={ReportSaleByLocation} />
            <Route path="/reports/purchase_summaries/pdf-preview" component={ExportPDFPurchaseSummary} />
            <Route path="/reports/purchase_summaries" component={ReportPurchaseSummary} />
            <Route path="/reports/purchased_products/pdf-preview" component={ExportPDFPurchaseByProduct} />
            <Route path="/reports/purchased_products" component={ReportPurchaseByProduct} />
            <Route path="/reports/purchased_suppliers" component={ReportPurchaseBySupplier} />
            <Route path="/reports/stock-consignment-summary" component={ReportConsignmentSummary} />
            <Route path="/reports/stock-consignment-product" component={ReportConsignmentByProduct} />
            <Route path="/" component={Home} />
            <Route path="/profile" component={Profile} />
          </Switch>
        </Content>
        <this.Button
          type="info"
          onClick={() => window.location.reload(true)}
          style={{
            display: "none",
            position: "fixed",
            bottom: 8,
            borderRadius: 50,
            height: 50,
            width: 50,
            right: 18,
            backgroundColor: "#ff4b55",
            boxShadow: "0 1px 1px 0 rgba(0,0,0,0.14), 0 2px 1px -1px rgba(0,0,0,0.12), 0 1px 3px 0 rgba(0,0,0,0.2)"
          }}>
          <span className="icon-reload" style={{ fontSize: "18pt" }}></span>
        </this.Button>
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


