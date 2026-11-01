import React from "react";
import { Alert, Button, Icon, Modal } from "antd";

const GROUP_LABELS = ["Walk-in", "Regular", "VIP", "Wholesale"];

function normalizeCambodianPhone(value) {
  const digits = String(value || "").replace(/\D/g, "");
  let localDigits = digits;

  if (localDigits.indexOf("855") === 0) {
    localDigits = localDigits.slice(3);
  }

  localDigits = localDigits.replace(/^0+/, "");
  return `855${localDigits}`;
}

function getGroupOptions() {
  return GROUP_LABELS.map(label => ({ label, value: label }));
}

export default class NewCustomerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: "",
      name: "",
      day: "",
      month: "",
      groupId: "",
      errors: {},
    };
    this.phoneInput = React.createRef();
  }

  componentDidUpdate(previousProps) {
    if (!previousProps.visible && this.props.visible) {
      const walkInGroup = getGroupOptions().find(group => group.label === "Walk-in");
      this.setState({
        phone: "",
        name: "",
        day: "",
        month: "",
        groupId: walkInGroup ? walkInGroup.value : "",
        errors: {},
      });
      setTimeout(() => {
        if (this.phoneInput.current) this.phoneInput.current.focus();
      }, 0);
    }

  }

  componentDidMount() {
    if (this.props.visible && this.phoneInput.current) this.phoneInput.current.focus();
  }

  getGroupOptions() {
    return getGroupOptions();
  }

  handleChange = (field, value) => {
    this.setState({
      [field]: value,
      errors: { ...this.state.errors, [field]: null, form: null },
    });
  };

  validate = () => {
    const errors = {};
    const normalizedPhone = normalizeCambodianPhone(this.state.phone);
    const localPhone = normalizedPhone.slice(3);

    if (!/^855\d{8,9}$/.test(normalizedPhone) || !/^(1|3|6|7|8|9)\d{7,8}$/.test(localPhone)) {
      errors.phone = "Enter a valid Cambodian phone number.";
    }

    if ((this.state.day && !this.state.month) || (!this.state.day && this.state.month)) {
      errors.birthday = "Select both day and month, or clear both fields.";
    } else if (this.state.day && this.state.month) {
      const maximumDay = new Date(2000, Number(this.state.month), 0).getDate();
      if (Number(this.state.day) > maximumDay) errors.birthday = "Select a valid day for the chosen month.";
    }

    this.setState({ errors });
    return Object.keys(errors).length ? null : normalizedPhone;
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.props.loading) return;

    const normalizedPhone = this.validate();
    if (!normalizedPhone) return;

    const name = this.state.name.trim();
    const customer = {
      phoneNumber: normalizedPhone,
      name: name || `Guest (Phone #${normalizedPhone})`,
      address: "",
    };

    this.props.onSubmit(customer);
  };

  renderError(field) {
    return this.state.errors[field] ? <div className="pos-new-customer-error">{this.state.errors[field]}</div> : null;
  }

  render() {
    const groupOptions = this.getGroupOptions();
    const apiError = this.props.error && (this.props.error.data?.message || this.props.error.message || "Unable to create customer. Please try again.");

    return (
      <Modal
        visible={this.props.visible}
        footer={null}
        width={444}
        centered
        destroyOnClose={false}
        maskClosable={false}
        onCancel={this.props.onCancel}
        wrapClassName="pos-new-customer-modal"
        title={null}
      >
        <form onSubmit={this.handleSubmit} noValidate>
          <div className="pos-new-customer-header">
            <div className="pos-new-customer-header-icon" aria-hidden="true"><Icon type="user-add" /></div>
            <div className="pos-new-customer-heading">
              <div className="pos-new-customer-title">Add New Customer</div>
              <div className="pos-new-customer-subtitle">Create customer profile for loyalty &amp; order history</div>
            </div>
            <button type="button" className="pos-new-customer-close" onClick={this.props.onCancel} aria-label="Close new customer form">
              <Icon type="close" />
            </button>
          </div>

          <div className="pos-new-customer-body">
            {apiError ? <Alert type="error" showIcon message={apiError} className="pos-new-customer-api-error" /> : null}
            <div className="pos-new-customer-field">
              <div className="pos-new-customer-label-row">
                <label htmlFor="pos-new-customer-phone">Phone Number <span className="pos-new-customer-required">*</span></label>
                <span>e.g. 012 / 096 / +855</span>
              </div>
              <div className={`pos-new-customer-phone-input ${this.state.errors.phone ? "has-error" : ""}`}>
                <span className="pos-new-customer-phone-prefix" aria-hidden="true">🇰🇭 +855</span>
                <input
                  ref={this.phoneInput}
                  id="pos-new-customer-phone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="tel"
                  placeholder="012 345 678"
                  value={this.state.phone}
                  onChange={event => this.handleChange("phone", event.target.value)}
                  aria-invalid={Boolean(this.state.errors.phone)}
                  aria-describedby="pos-new-customer-phone-error"
                />
                <Icon type="phone" aria-hidden="true" />
              </div>
              {this.renderError("phone")}
            </div>

            <div className="pos-new-customer-field">
              <div className="pos-new-customer-label-row">
                <label htmlFor="pos-new-customer-name">Customer Name</label>
                <span>Optional</span>
              </div>
              <div className="pos-new-customer-input-wrap">
                <input
                  id="pos-new-customer-name"
                  type="text"
                  autoComplete="name"
                  placeholder="e.g. Sok Sovan, Miss Bopha"
                  value={this.state.name}
                  onChange={event => this.handleChange("name", event.target.value)}
                />
                <Icon type="idcard" aria-hidden="true" />
              </div>
              <div className="pos-new-customer-help">If empty, defaults to Guest (Phone #).</div>
            </div>

            <div className="pos-new-customer-birthday">
              <div className="pos-new-customer-birthday-header">
                <div><Icon type="gift" /> <strong>Date of Birth</strong></div>
                <span>Day &amp; Month only</span>
              </div>
              <div className="pos-new-customer-help">Day &amp; Month only for privacy safe birthday rewards (no year required).</div>
              <div className="pos-new-customer-date-fields">
                <label>DAY<select value={this.state.day} onChange={event => this.handleChange("day", event.target.value)}><option value="">Day</option>{Array.from({ length: 31 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}</option>)}</select></label>
                <label>MONTH<select value={this.state.month} onChange={event => this.handleChange("month", event.target.value)}><option value="">Month</option>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1} - {new Date(2000, index, 1).toLocaleString("en", { month: "long" })}</option>)}</select></label>
              </div>
              {this.renderError("birthday")}
            </div>

            <fieldset className="pos-new-customer-groups">
              <legend>Customer Group</legend>
              <div role="radiogroup" aria-label="Customer Group">
                {groupOptions.map(group => (
                  <button
                    type="button"
                    role="radio"
                    aria-checked={String(this.state.groupId) === String(group.value)}
                    className={`pos-new-customer-group ${String(this.state.groupId) === String(group.value) ? "selected" : ""}`}
                    key={group.label}
                    onClick={() => this.handleChange("groupId", group.value)}
                  >
                    {group.label}
                  </button>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="pos-new-customer-footer">
            <Button type="button" className="pos-new-customer-cancel" onClick={this.props.onCancel} disabled={this.props.loading}>Cancel <span>(Esc)</span></Button>
            <Button type="primary" htmlType="submit" className="pos-new-customer-submit" loading={this.props.loading}>
              <Icon type="user-add" /> Save &amp; Assign to Order <span>(Enter)</span>
            </Button>
          </div>
        </form>
      </Modal>
    );
  }
}
