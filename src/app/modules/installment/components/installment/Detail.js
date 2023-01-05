import React from "react";
import {connect} from "react-redux";
import {Translate} from "react-localize-redux";
import {Link} from "react-router-dom";
import {
  Form,
  Badge,
  PageHeader,
  Spin,
  Dropdown,
  Menu,
  Icon,
  Result,
  Button
} from "antd";
import Util from "../../../common/util";
import EnumINS from "../../enum";
import InstallmentService from "../../services/InstallmentService";
import PrivilegeService from "../../../pos/services/settings/PrivilegeService";
import RepaymentService from "../../services/RepaymentService";
import history from "../../../common/router/history";
import {stringTranslate} from "../../../common/helper/stringTranslate";
import DownPaymentTable from "./DownPayment";
import PaymentForm from "./PaymentForm";
import PaymentHistory from "./PaymentHistory";

class DetailInstallment extends React.Component {
  state = {
    detail: {},
    paymentsHistory: [],
    loading: false,
    loadingPaymentHistory: false,
    isCanPay: false,
    isCanEdit: false
  }
  INSTALLMENT_STATUS_STR = {
    [EnumINS.INSTALLMENT_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf"},
    [EnumINS.INSTALLMENT_STATUS.RECEIVED]: { title: stringTranslate("text_received", this.props.locale), color: "#1890ff"},
    [EnumINS.INSTALLMENT_STATUS.COMPLETED]: { title: stringTranslate("text_completed", this.props.locale), color: "#f50"},
  };
  util = new Util();
  isRequestPrint = false;
  permissionModuleCode = "installment";

  componentDidMount() {
    const id = this.props.match.params.id;
    this.setState({loading: true});
    InstallmentService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    })
    .finally(() => {
      this.setState({loading: false}, () => {
        const params = new URLSearchParams(document.location.search);
        const action = params.get("action");
        const pageSize = params.get("size");
        if (action === "print" && Object.keys(this.state.detail).length) {
          if (!this.state.loading) {
            if (pageSize && pageSize === "A5") {
              document.getElementById("invoice-content").classList.add("invoice-A5");
              setTimeout(() => {
                window.print();
              }, 600);
            } else {
              setTimeout(() => {
                window.print();
              }, 600);
            }
          }
          this.isRequestPrint = true;
          params.delete("action");
          params.delete("size");
          this.util.pushParamsToURL(`/installment/detail/${id}`, params.toString());
        }
      });
    });

    this.checkPermission();
  }

  checkPermission() {
    PrivilegeService.checkPermission(this.permissionModuleCode, "pay")
    .then(({data}) => this.setState({isCanPay: data}));

    PrivilegeService.checkPermission(this.permissionModuleCode, "edit")
    .then(({data}) => this.setState({isCanEdit: data}));
  }

  handlePay = () => {
    this.setState(preState => {
      preState.detail.payment = null;
      return preState;
    });
    this.paymentFormRef.onShowDrawer();
  }

  handleAfterPayment = (id) => {
    this.setState({loading: true});
    InstallmentService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    })
    .finally(() => this.setState({loading: false}));
    this.paymentFormRef.onCloseDrawer();
  }

  handleShowPaymentHistory = () => {
    this.setState({loadingPaymentHistory: true});
    RepaymentService.getHistory(this.state.detail.id)
    .then(response => {
      this.setState({paymentsHistory: response.data.data});
    })
    .finally(() => this.setState({loadingPaymentHistory: false}));
    this.paymentHistoryRef.onShowDrawer();
  }

  handleEditPayment = (paymentId) => {
    RepaymentService.detail(paymentId)
    .then(response => {
      const {detail} = this.state;
      detail.payment = response.data.data;
      detail.isEditPayment = true;
      this.setState({detail}, () => {
        this.paymentHistoryRef.onCloseDrawer();
        this.paymentFormRef.onShowDrawer();
      });
    });
  }

  handleAfterPaymentUpdate = (id) => {
    this.setState({loading: true});
    InstallmentService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    })
    .finally(() => this.setState({loading: false}));
    this.paymentFormRef.onCloseDrawer();
    this.handleShowPaymentHistory();
  }

  handlePrintA5 = () => {
    document.getElementById("invoice-content").classList.add("invoice-A5");
    setTimeout(() => {
      window.print();
    }, 500);
  }

  render() {
    onafterprint = (() => {
      document.getElementById("invoice-content").classList.remove("invoice-A5");
    });

    const {detail, loading} = this.state;
    return (
      <div style={{marginBottom: 25}}>
        <PageHeader 
          style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0,
            position: "relative"
          }}
          onBack={() => {
            if (this.isRequestPrint) {
              history.push("/installment/list");
            } else {
              history.goBack();
            }
          }}
          title={<Translate id="text_installment" />}
          subTitle={detail.status && <Badge count={this.INSTALLMENT_STATUS_STR[detail.status].title} style={{background: this.INSTALLMENT_STATUS_STR[detail.status].color}} />}
          extra={[
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item onClick={() => window.print()} title="Ctrl + P"><Translate id="text_print" /></Menu.Item>
                {/* <Menu.Item onClick={this.handlePrintA5}><Translate id="text_print" /> A5</Menu.Item> */}
                {
                  this.state.isCanEdit ?
                    <Menu.Item>
                      <Link to={`/installment/update/${detail.id && detail.id}`}><Translate id="text_edit" /></Link>
                    </Menu.Item>
                  : null
                }
                
                {
                  this.state.isCanPay && detail.status !== EnumINS.INSTALLMENT_STATUS.DRAFT ?
                    <Menu.Item className="ant-dropdown-menu-item" onClick={this.handlePay}><Translate id="text_pay" /></Menu.Item>
                  : null
                }
                {
                  this.state.isCanPay ?
                    <Menu.Item className="ant-dropdown-menu-item" onClick={this.handleShowPaymentHistory}><Translate id="text_view_payment_history" /></Menu.Item>
                  : null
                }
              </Menu>
            )}>
              <button className="ant-btn ant-dropdown-link" onClick={e => e.preventDefault()}>
                <Translate id="text_option" /> <Icon type="down" />
              </button>
            </Dropdown>
          ]}
        />

        {
          loading ?
            <div style={{width: 30, margin: "0 auto", paddingTop: 30}}>
              <Spin />
            </div>
          :
            Object.keys(detail).length ?
              <DownPaymentTable 
                formData={detail}
                locale={this.props.locale}
              />
            :
              <Result  
                status={404}
                title="404"
                subTitle="Installment not found"
                extra={<Button type="primary" onClick={() => history.goBack()}><Translate id="text_back" /></Button>}
              />
        }

        <PaymentForm
          ref={ref => this.paymentFormRef = ref}
          formData={detail}
          locale={this.props.locale}
          onGoBackHistory={this.handleShowPaymentHistory}
          onSuccess={this.handleAfterPayment}
          onSuccessUpdate={this.handleAfterPaymentUpdate}
          form={this.props.form} />

        <PaymentHistory
          ref={ref => this.paymentHistoryRef = ref}
          loading={this.state.loadingPaymentHistory}
          data={this.state.paymentsHistory}
          handleEditPayment={this.handleEditPayment}
          locale={this.props.locale}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const installmentDetail =  Form.create(mapPropsToFields)(DetailInstallment);
  
export default connect(mapStateToProps)(installmentDetail);