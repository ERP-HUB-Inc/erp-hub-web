import React from "react";
import { Alert, Button, Drawer, Icon, Input, Spin } from "antd";
import POSCustomerService from "../../../services/customers/CustomerService";

const FILTERS = ["All", "Recent", "VIP Members", "Wholesale"];

function getCustomerName(customer) {
  return [customer.firstName, customer.lastName].filter(Boolean).join(" ") || customer.name || customer.company || "Customer";
}

function getInitials(customer) {
  return getCustomerName(customer).split(/\s+/).filter(Boolean).slice(0, 2).map(value => value[0]).join("").toUpperCase() || "CU";
}

function getGroupName(customer) {
  return customer.groupCustomer && customer.groupCustomer.name ? customer.groupCustomer.name : "General";
}

function isRecent(customer) {
  if (!customer.createdAt) return false;
  const createdAt = new Date(customer.createdAt).getTime();
  return Number.isFinite(createdAt) && Date.now() - createdAt <= 30 * 24 * 60 * 60 * 1000;
}

export default class CustomerSelectorDrawer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      filter: "All",
      customers: [],
      loading: false,
      error: null,
      highlightedIndex: -1,
      selectedId: null,
    };
    this.searchTimer = null;
    this.requestId = 0;
    this.searchInput = React.createRef();
    this.resultRefs = {};
  }

  componentDidMount() {
    window.addEventListener("keydown", this.handleGlobalKeyDown);
  }

  componentDidUpdate(previousProps) {
    if (!previousProps.visible && this.props.visible) {
      this.loadCustomers(this.state.search);
      setTimeout(() => {
        if (this.searchInput.current) this.searchInput.current.focus();
      }, 0);
    }

    if (this.props.visible && previousProps.currentCustomer !== this.props.currentCustomer) {
      this.setState({ selectedId: this.props.currentCustomer ? this.props.currentCustomer.id : null });
    }
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimer);
    window.removeEventListener("keydown", this.handleGlobalKeyDown);
  }

  handleGlobalKeyDown = (event) => {
    if (!this.props.visible || event.isComposing) return;
    if (event.key === "F3") {
      event.preventDefault();
      this.props.onNew();
    }
  };

  loadCustomers = (search = this.state.search) => {
    const requestId = ++this.requestId;
    this.setState({ loading: true, error: null });

    POSCustomerService.list(search)
      .then(response => {
        if (requestId !== this.requestId) return;
        const responseData = response && response.data;
        const customers = responseData && Array.isArray(responseData.data) ? responseData.data : Array.isArray(responseData) ? responseData : [];
        this.setState({ customers, loading: false, highlightedIndex: customers.length ? 0 : -1 });
      })
      .catch(error => {
        if (requestId !== this.requestId) return;
        this.setState({ loading: false, error });
      });
  };

  handleSearch = (event) => {
    const search = event.target.value;
    this.setState({ search, highlightedIndex: -1 });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => this.loadCustomers(search), 300);
  };

  handleClearSearch = () => {
    clearTimeout(this.searchTimer);
    this.setState({ search: "", highlightedIndex: -1 });
    this.loadCustomers("");
  };

  handleFilter = (filter) => {
    this.setState({ filter, highlightedIndex: 0 });
  };

  getFilteredCustomers() {
    const { customers, filter } = this.state;
    if (filter === "Recent") return customers.filter(isRecent);
    if (filter === "VIP Members") return customers.filter(customer => /vip/i.test(getGroupName(customer)));
    if (filter === "Wholesale") return customers.filter(customer => /whole|commercial/i.test(getGroupName(customer)) || Number(customer.type) === 1);
    return customers;
  }

  handleResultClick = (customer, index) => {
    this.setState({ selectedId: customer.id, highlightedIndex: index });
  };

  handleSelect = (customer) => {
    if (!customer || this.props.assigning) return;
    this.props.onSelect(customer);
  };

  handleAssignHighlighted = () => {
    const customers = this.getFilteredCustomers();
    const customer = customers[this.state.highlightedIndex];
    if (customer) this.handleSelect(customer);
  };

  handleKeyDown = (event) => {
    if (event.isComposing || event.target.tagName === "INPUT" || event.target.tagName === "SELECT") return;
    const customers = this.getFilteredCustomers();
    if (!customers.length) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const direction = event.key === "ArrowDown" ? 1 : -1;
      const nextIndex = (this.state.highlightedIndex + direction + customers.length) % customers.length;
      this.setState({ highlightedIndex: nextIndex, selectedId: customers[nextIndex].id });
      setTimeout(() => {
        const element = this.resultRefs[customers[nextIndex].id];
        if (element && element.scrollIntoView) element.scrollIntoView({ block: "nearest" });
      }, 0);
    } else if (event.key === "Enter") {
      event.preventDefault();
      this.handleAssignHighlighted();
    }
  };

  formatPhone = (phoneNumber) => {
    const phone = String(phoneNumber || "");
    return phone.indexOf("855") === 0 ? `+${phone}` : phone;
  };

  renderCustomerCard = (customer, index) => {
    const name = getCustomerName(customer);
    const isHighlighted = index === this.state.highlightedIndex;
    const isAssigned = this.props.currentCustomer && this.props.currentCustomer.id === customer.id;

    return (
      <div
        className={`pos-customer-result-card ${isHighlighted ? "highlighted" : ""} ${isAssigned ? "assigned" : ""}`}
        key={customer.id}
        ref={element => { this.resultRefs[customer.id] = element; }}
        onClick={() => this.handleResultClick(customer, index)}
        onKeyDown={this.handleKeyDown}
        role="option"
        aria-selected={isHighlighted}
        tabIndex={0}
      >
        <div className="pos-customer-result-topline">
          <div className="pos-customer-avatar">{getInitials(customer)}</div>
          <div className="pos-customer-result-identity">
            <div className="pos-customer-result-name">{name}</div>
            <span className="pos-customer-result-badge">{getGroupName(customer)}</span>
          </div>
          <Button type={isAssigned ? "default" : "primary"} size="small" onClick={(event) => { event.stopPropagation(); this.handleSelect(customer); }}>
            {isAssigned ? "Selected" : "Select"}
          </Button>
        </div>
        <div className="pos-customer-result-meta">
          <span><Icon type="phone" /> {this.formatPhone(customer.phoneNumber)}</span>
          {customer.number ? <span className="pos-customer-result-code">{customer.number}</span> : null}
          {customer.rewardPoint != null ? <span className="pos-customer-result-points">{customer.rewardPoint} points</span> : null}
        </div>
        {customer.company ? <div className="pos-customer-result-company">{customer.company}</div> : null}
      </div>
    );
  };

  render() {
    const customers = this.getFilteredCustomers();
    const activeCustomer = this.props.currentCustomer;
    const queryLabel = this.state.search ? `SEARCH RESULTS MATCHING "${this.state.search}"` : "CUSTOMER LIST";

    return (
      <Drawer
        visible={this.props.visible}
        placement="right"
        width={440}
        onClose={this.props.onClose}
        closable={false}
        destroyOnClose={false}
        className="pos-customer-selector-drawer"
      >
        <div className="pos-customer-drawer-shell" onKeyDown={this.handleKeyDown}>
          <div className="pos-customer-drawer-header">
            <div className="pos-customer-drawer-header-icon"><Icon type="user" /></div>
            <div className="pos-customer-drawer-heading">
              <div className="pos-customer-drawer-title">Select Customer</div>
              <div className="pos-customer-drawer-subtitle">Search loyalty members or assign walk-in guest</div>
            </div>
            <Button type="primary" size="small" className="pos-customer-drawer-new" onClick={this.props.onNew}>
              <Icon type="user-add" /> New <span>F3</span>
            </Button>
            <button type="button" className="pos-customer-drawer-close" onClick={this.props.onClose} aria-label="Close customer selector">
              <Icon type="close" />
            </button>
          </div>

          <div className="pos-customer-drawer-content">
            <div className="pos-customer-drawer-search">
              <Icon type="search" />
              <Input ref={this.searchInput} value={this.state.search} onChange={this.handleSearch} onKeyDown={event => { if (event.key === "Escape") this.props.onClose(); else event.stopPropagation(); }} placeholder="Search name, phone, or member code" />
              {this.state.search ? <button type="button" onClick={this.handleClearSearch} aria-label="Clear customer search"><Icon type="close-circle" /></button> : null}
            </div>

            <div className="pos-customer-filter-row" aria-label="Customer filters">
              {FILTERS.map(filter => <button type="button" key={filter} className={this.state.filter === filter ? "selected" : ""} onClick={() => this.handleFilter(filter)}>{filter}{filter === "Recent" ? <i /> : null}</button>)}
            </div>

            <div className="pos-customer-default-card">
              <div className="pos-customer-avatar neutral"><Icon type="user" /></div>
              <div className="pos-customer-default-copy">
                <strong>Walk-in Customer (Default)</strong>
                <span>Default guest checkout · 0 loyalty points</span>
              </div>
              <Button size="small" onClick={() => this.props.onSelect(null)} disabled={this.props.assigning}>{activeCustomer ? "Use Default" : "Keep Default"}</Button>
            </div>

            <div className="pos-customer-results-heading">
              <span>{queryLabel}</span>
              <strong>{customers.length} accounts found</strong>
            </div>

            {this.state.error ? <Alert type="error" showIcon message="Unable to load customers." action={<Button size="small" onClick={() => this.loadCustomers()}>Retry</Button>} /> : null}
            {this.state.loading ? <div className="pos-customer-loading"><Spin size="small" /> Loading customers…</div> : null}
            {!this.state.loading && !this.state.error && !customers.length ? <div className="pos-customer-empty">No customers found.</div> : null}
            {!this.state.loading && <div className="pos-customer-results" role="listbox" aria-label="Customer search results">{customers.map(this.renderCustomerCard)}</div>}
          </div>

          <div className="pos-customer-drawer-footer">
            <div className="pos-customer-footer-count"><i /> Showing {customers.length} matching customers</div>
            <div className="pos-customer-footer-actions">
              <Button onClick={this.props.onClose}>Cancel</Button>
              <Button type="primary" onClick={this.handleAssignHighlighted} disabled={this.state.highlightedIndex < 0 || !customers.length || this.props.assigning} loading={this.props.assigning}><Icon type="check" /> Assign Highlighted <span>Enter</span></Button>
            </div>
            <div className="pos-customer-keyboard-help"><span>↑ ↓ Navigate</span><span>Enter Confirm</span><span>Esc Close</span></div>
          </div>
        </div>
      </Drawer>
    );
  }
}
