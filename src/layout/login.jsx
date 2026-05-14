import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { t } from "i18next";
import { Button, Form, Input, Row, Col, Icon } from "antd";
import swal from "sweetalert";
import "./signin.css";

const FormItem = Form.Item;

class UserAuthentication extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false };
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

    form.validateFields((err, values) => {
      if (err) return;

      this.setState({ loading: true });
    });
  };

  render() {
    const { loading } = this.state;
    const { getFieldDecorator } = this.props.form;

    return (
      <Row type="flex" className="signin-root">
        {/* ── Left visual panel ── */}
        <Col xs={0} sm={0} md={14} lg={16} xl={17} className="signin-visual">
          <div className="signin-visual__bg" />
          <div className="signin-visual__grid" />
          <div className="orb orb-1" />
          <div className="orb orb-2" />
          <div className="orb orb-3" />

          {/* Logo badge */}
          <div className="signin-visual__logo">
            <div className="logo-icon">
              <Icon type="thunderbolt" />
            </div>
            <div>
              <div className="logo-name">MarketChain</div>
              <div className="logo-sub">Enterprise Resource Planning</div>
            </div>
          </div>

          {/* Headline copy */}
          <div className="signin-visual__copy">
            <h1>
              Connect every
              <br />
              link in your
              <br />
              <em>supply chain.</em>
            </h1>
            <p>Unified procurement, inventory, finance and operations — all in one intelligent platform built for scale.</p>
          </div>

          {/* Stats row */}
          <div className="signin-stats">
            <div>
              <span className="stat-num">98.9%</span>
              <span className="stat-label">Uptime SLA</span>
            </div>
            <div>
              <span className="stat-num">340ms</span>
              <span className="stat-label">Avg Response</span>
            </div>
            <div>
              <span className="stat-num">ISO 27001</span>
              <span className="stat-label">Certified</span>
            </div>
          </div>
        </Col>

        {/* ── Right form panel ── */}
        <Col xs={24} sm={24} md={10} lg={8} xl={7} className="signin-panel">
          <div className="signin-container">
            {/* Header */}
            <div className="signin-header">
              <div className="signin-header__eyebrow">Welcome back</div>
              <h2 className="signin-header__title">
                Sign in to
                <br />
                your workspace
              </h2>
              <div className="signin-header__sub">Enter your store credentials to continue</div>
            </div>

            {/* Form */}
            <Form layout="vertical" className="signin-form" onSubmit={this.handleSubmit}>
              {/* Store URL */}
              <FormItem label={t("text_private_url")}>
                {getFieldDecorator("privateURL", {
                  rules: [
                    {
                      required: true,
                      message: t("text_private_url_is_required"),
                    },
                  ],
                })(<Input ref={this.storeInputRef} prefix={<Icon type="link" />} placeholder={t("text_ex_ca_mp_mega")} />)}
              </FormItem>

              {/* Username */}
              <FormItem label={t("text_username")}>
                {getFieldDecorator("userName", {
                  rules: [
                    {
                      required: true,
                      message: t("text_username_is_required"),
                    },
                  ],
                })(<Input ref={this.userNameInputRef} prefix={<Icon type="user" />} placeholder={t("text_please_enter_your_username")} />)}
              </FormItem>

              {/* Password */}
              <FormItem label={t("text_password")}>
                {getFieldDecorator("password", {
                  rules: [
                    {
                      required: true,
                      message: t("text_password_is_required"),
                    },
                  ],
                })(<Input.Password prefix={<Icon type="lock" />} placeholder={t("text_password")} iconRender={(visible) => (visible ? <Icon type="eye" /> : <Icon type="eye-invisible" />)} />)}
              </FormItem>

              {/* Submit */}
              <FormItem style={{ marginBottom: 0 }}>
                <Button loading={loading} type="primary" htmlType="submit" className="signin-btn">
                  {!loading && <Icon type="arrow-right" />}
                  {t("text_log_in")}
                </Button>
              </FormItem>
            </Form>

            {/* Footer trust bar */}
            <div className="signin-footer">
              <div className="signin-divider">
                <div className="signin-divider__line" />
                <span className="signin-divider__text">Protected workspace</span>
                <div className="signin-divider__line" />
              </div>
              <div className="signin-trust">
                <Icon type="safety-certificate" />
                <span>256-bit TLS · SOC 2 Type II compliant</span>
              </div>
            </div>
          </div>
        </Col>
      </Row>
    );
  }
}

export default withRouter(Form.create({ name: "signin" })(UserAuthentication));
