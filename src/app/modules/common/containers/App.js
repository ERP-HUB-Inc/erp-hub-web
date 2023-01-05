import React from "react";
import Loadable from "react-loadable";
import {
  BrowserRouter,
  Route,
  Router,
  Switch
} from "react-router-dom";
import history from "../router/history";
import StartUp from "../components/StartUp";
import PublicInvoice from "../../pos/components/transactions/Invoice/PublicInvoice";
import SaleOrderPublicInvoice from "../../pos/components/transactions/SaleOrder/Invoice/public";
import QuotePreview from "../../pos/components/transactions/Quotation/invoice/PublicQuote";
import ReceiptPreview from "../../pos/components/transactions/receipt/publicReceipt";
import ExportPDFSaleByProduct from "../../pos/components/reports/Sale/ExportPDFSaleByProduct";

export default class App extends React.Component {
  render() {
    const Application = Loadable({
      loader: () => import("../router"),
      loading: () => <StartUp />,
    });

    const PrivateRoute = Loadable({
      loader: () => import("../router/privateRouter"),
      loading: () => <StartUp />,
    });

    const UserLogin = Loadable({
      loader: () => import("./client/signin"),
      loading: () => <StartUp />,
    });

    const LoginStore = Loadable({
      loader: () => import("./client/loginStore"),
      loading: () => <StartUp />,
    });

    const ClientRegister = Loadable({
      loader: () => import("./client/register"),
      loading: () => <StartUp />,
    });

    const ClientRegisterDetail = Loadable({
      loader: () => import("./client/registerDetail"),
      loading: () => <StartUp />,
    });

    const ClientRegisterComplete = Loadable({
      loader: () => import("./client/registerComplete"),
      loading: () => <StartUp />,
    });

    const token = new URLSearchParams(window.location.search).get("token");

    return (
      <BrowserRouter>
        <Switch>
          <Router history={history}>
            <div style={{height: "100%"}} id="main-route-content">
              <Route path="/signin" component={UserLogin} />
              <Route path="/store" component={LoginStore} />
              <Route path="/register" component={ClientRegister} />
              <Route path="/register/detail" component={ClientRegisterDetail} />
              <Route path="/signin-complete" component={ClientRegisterComplete} />
              <Route path="/public/invoice-preview" component={PublicInvoice} />
              <Route path="/public/sales-order-preview" component={SaleOrderPublicInvoice} /> {/* Query params: saleOrderId, token */}
              <Route path="/public/quotation-preview" component={QuotePreview} />
              <Route path="/public/receipt-preview" component={ReceiptPreview} />
              <Route path="/reports/sold_products/pdf-preview" component={ExportPDFSaleByProduct} />
              {!token && (
                <PrivateRoute
                path="/"
                component={Application} loginComponent={UserLogin} />
              )}
            </div>
          </Router>
        </Switch>
      </BrowserRouter>
    );
  }
}
