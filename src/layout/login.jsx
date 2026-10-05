import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { t } from "i18next";
import { Button, Form, Input, Row, Col, Icon } from "antd";
import { ArrowRight, AtSign, Building2, Circle, KeyRound, ShieldCheck } from "lucide-react";
import ClientService from "../app/modules/common/services/ClientService";
import ConstantAuth from "../app/modules/common/constants/authentication";
import HttpCode from "../enums/http-status";
import Enum from "../enums";
import InventoryEnum from "../app/modules/inventory/enums";
import "./signin.css";

const FormItem = Form.Item;
const APP_VERSION = process.env.REACT_APP_VERSION || "2.0.51";
const loginMetrics = [
  { value: "98.9%", label: "UPTIME SLA", isMock: true },
  { value: "340ms", label: "AVG RESPONSE", isMock: true },
  { value: "ISO 27001", label: "CERTIFIED", isMock: true },
];

function translateWithFallback(key, fallback) {
  const label = t(key);
  return label && label !== key ? label : fallback;
}

class UserAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, errorMessage: "" };
    this.storeInputRef = React.createRef();
    this.userNameInputRef = React.createRef();
  }

  componentDidMount() {
    const { form } = this.props;
    const savedURL = localStorage.getItem("PRIVATE_URL");
    if (savedURL) {
      form.setFieldsValue({ privateURL: savedURL });
      // slight delay so the ref is mounted
      setTimeout(() => {
        this.userNameInputRef.current && this.userNameInputRef.current.focus();
      }, 100);
    } else {
      setTimeout(() => {
        this.storeInputRef.current && this.storeInputRef.current.focus();
      }, 100);
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    const { form, history } = this.props;

    form.validateFields(async (err, values) => {
      if (err) return;

      const storeName = String(values.privateURL || "").trim();
      const userName = String(values.userName || "").trim();
      const password = values.password;

      this.setState({ loading: true, errorMessage: "" });
      localStorage.setItem("PRIVATE_URL", storeName);

      try {
        const response = await ClientService.signin(userName, password, storeName);
        const authSession = response && response.data && response.data.data;

        if (!authSession) {
          this.setState({ errorMessage: "Unable to sign in. Please try again." });
          return;
        }

        localStorage.setItem(ConstantAuth.ACCESS_TOKEN, JSON.stringify(authSession));
        await this.loadInitializeSetting();

        const currentUser = authSession.currentUser || {};
        history.push(currentUser.roleCode === Enum.CASHIER_ROLE ? "/pos" : "/");
      } catch (error) {
        this.setState({ errorMessage: this.getLoginErrorMessage(error) });
      } finally {
        this.setState({ loading: false });
      }
    });
  };

  async loadInitializeSetting() {
    try {
      const initializeSetting = await ClientService.getInitializeSetting();
      const data = initializeSetting && initializeSetting.data && initializeSetting.data.data;

      if (!data) return;

      localStorage.setItem(InventoryEnum.LOCAL_SCHEMA.LANGUAGE, JSON.stringify(data.languages || []));
      localStorage.setItem(InventoryEnum.LOCAL_SCHEMA.LOCATION, JSON.stringify(data.locations || []));
      localStorage.setItem(InventoryEnum.LOCAL_SCHEMA.TAX, JSON.stringify(data.taxes || []));
    } catch (error) {
      // Login remains valid even if optional cached settings fail to hydrate.
    }
  }

  getLoginErrorMessage(error) {
    const code = error && error.response && error.response.data && error.response.data.error && error.response.data.error.code;

    if (code === HttpCode.NOT_FOUND) return "User account does not exist.";
    if (code === HttpCode.DEACTIVE) return "Your account is deactivated.";
    if (code === HttpCode.INVALID_USER_PASSWORD) return "Invalid email or password.";
    if (code === HttpCode.NO_PERMISSION_ON_STORE) return "Your account has no permission for this store.";
    if (code === HttpCode.INTERNAL_SERVER_ERROR || error.message === HttpCode.NETWORK_ERROR) return "Please check your connection and try again.";

    return "Unable to sign in. Please check your credentials.";
  }

  handleHelpCenter = (e) => {
    e.preventDefault();
    // TODO: connect Help Center route when support center is available.
  };

  handleAzureLogin = () => {
    // TODO: connect Azure/Entra SSO.
  };

  handleOktaLogin = () => {
    // TODO: connect Okta SSO.
  };

  render() {
    const { loading, errorMessage } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Row type="flex" className="signin-root">
        {/* ── Left visual panel ── */}
        <Col xs={0} sm={0} md={14} lg={15} xl={15} className="signin-visual">
          <div className="signin-visual__bg" />
          <div className="signin-visual__grid" />

          {/* Logo badge */}
          <div className="signin-visual__logo">
            <div className="brand-logo-card">
              <img src="/logo.png" alt="MarketChain ERP" />
            </div>
          </div>

          {/* Headline copy */}
          <div className="signin-visual__copy">
            <h1>
              Connect every link in
              <br />
              your
              <br />
              <em>supply chain.</em>
            </h1>
            <p>Unified inventory, purchasing, sales, finance and operations — all in one intelligent business platform.</p>
          </div>

          {/* Stats row */}
          <div className="signin-visual__divider" />
          <div className="signin-stats">
            {loginMetrics.map(metric => (
              <div key={metric.label} data-mock-metric={metric.isMock ? "true" : "false"}>
                <span className="stat-num">{metric.value}</span>
                <span className="stat-label">{metric.label}</span>
              </div>
            ))}
          </div>
          <div className="signin-visual__footer">
            <span>Environment: Production</span>
            <span>Version {APP_VERSION}</span>
          </div>
        </Col>

        {/* ── Right form panel ── */}
        <Col xs={24} sm={24} md={10} lg={9} xl={9} className="signin-panel">
          <div className="signin-container">
            <div className="signin-mobile-brand">
              <img src="/logo.png" alt="MarketChain ERP" />
            </div>

            {/* Header */}
            <div className="signin-top-row">
              <div className="signin-header__eyebrow">
                <span />
                WELCOME BACK
              </div>
              <a href="#help-center" onClick={this.handleHelpCenter}>Help Center</a>
            </div>

            <div className="signin-header">
              <h2 className="signin-header__title">Sign in to your workspace</h2>
              <div className="signin-header__sub">Enter your MarketChain workspace credentials to continue</div>
            </div>

            {/* Form */}
            <Form layout="vertical" className="signin-form" onSubmit={this.handleSubmit}>
              {errorMessage ? (
                <div className="signin-error" role="alert">
                  {errorMessage}
                </div>
              ) : null}

              {/* Store URL */}
              <FormItem label="STORE IDENTIFIER">
                {getFieldDecorator("privateURL", {
                  rules: [
                    {
                      required: true,
                      message: translateWithFallback("text_private_url_is_required", "Store identifier is required"),
                    },
                  ],
                })(<Input ref={this.storeInputRef} suffix={<Building2 size={16} />} placeholder="agp-regional-01" />)}
              </FormItem>

              {/* Username */}
              <FormItem label="CORPORATE EMAIL">
                {getFieldDecorator("userName", {
                  rules: [
                    {
                      required: true,
                      message: translateWithFallback("text_username_is_required", "Corporate email is required"),
                    },
                  ],
                })(<Input ref={this.userNameInputRef} suffix={<AtSign size={16} />} placeholder="armsadmin@asean.org" autoComplete="username" />)}
              </FormItem>

              {/* Password */}
              <FormItem
                label={(
                  <span className="password-label-row">
                    <span>ACCESS KEY / PASSWORD</span>
                    <button type="button" onClick={this.handleHelpCenter}>Reset key?</button>
                  </span>
                )}
              >
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: translateWithFallback("text_password_is_required", "Access key / password is required"),
                    },
                  ],
                })(<Input.Password prefix={<KeyRound size={15} />} placeholder="Enter access key" autoComplete="current-password" iconRender={(visible) => (visible ? <Icon type="eye" /> : <Icon type="eye-invisible" />)} />)}
              </FormItem>

              {/* Submit */}
              <FormItem style={{ marginBottom: 0 }}>
                <Button loading={loading} type="primary" htmlType="submit" className="signin-btn">
                  <span>{loading ? "Authenticating..." : "Authenticate & Enter"}</span>
                  {!loading && <ArrowRight size={16} />}
                </Button>
              </FormItem>
            </Form>

            <div className="sso-divider">
              <span />
              <strong>OR SSO GATEWAY</strong>
              <span />
            </div>

            <div className="sso-grid">
              <Button onClick={this.handleAzureLogin} disabled>
                <span className="sso-mark">M</span>
                Azure AD
              </Button>
              <Button onClick={this.handleOktaLogin} disabled>
                <Circle size={13} />
                Okta SSO
              </Button>
            </div>

            {/* Footer trust bar */}
            <div className="signin-footer">
              <div className="signin-footer-rule" />
              <div className="signin-footer-row">
                <div className="signin-trust">
                  <ShieldCheck size={13} />
                  <span>Secure encrypted connection</span>
                </div>
                <span className="signin-tenant">Workspace: DEFAULT</span>
              </div>
            </div> 
          </div>
        </Col>
      </Row>
    );
  }
}

export default withRouter(Form.create({ name: "signin" })(UserAuthentication));
