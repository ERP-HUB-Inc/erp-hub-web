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
  Icon
} from "antd";
import Util from "../../../common/util";
import EnumINS from "../../enum";
import InstallmentService from "../../services/InstallmentService";
import history from "../../../common/router/history";
import {stringTranslate} from "../../../common/helper/stringTranslate";
import DownPaymentTable from "./downPayment";

class DetailInstallment extends React.Component {
  state = {
    detail: {},
    loading: false
  }
  INSTALLMENT_STATUS_STR = {
    [EnumINS.INSTALLMENT_STATUS.DRAFT]: { title: stringTranslate("text_draft", this.props.locale), color: "#bfbfbf"},
    [EnumINS.INSTALLMENT_STATUS.RECEIVED]: { title: stringTranslate("text_received", this.props.locale), color: "#1890ff"},
    [EnumINS.INSTALLMENT_STATUS.COMPLETED]: { title: stringTranslate("text_completed", this.props.locale), color: "#f50"},
  };
  util = new Util();

  componentDidMount() {
    const id = this.props.match.params.id;
    InstallmentService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data});
    });
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
          onBack={() => history.goBack()}
          title={<Translate id="text_installment" />}
          subTitle={detail.status && <Badge count={this.INSTALLMENT_STATUS_STR[detail.status].title} style={{background: this.INSTALLMENT_STATUS_STR[detail.status].color}} />}
          extra={[
            <Dropdown key={1} overlay={(
              <Menu>
                <Menu.Item onClick={() => window.print()} title="Ctrl + P"><Translate id="text_print" /></Menu.Item>
                <Menu.Item onClick={this.handlePrintA5}><Translate id="text_print" /> A5</Menu.Item>
                <Menu.Item>
                  <Link to={`/installment/update/${detail.id && detail.id}`}><Translate id="text_edit" /></Link>
                </Menu.Item>
                <Menu.Item><Translate id="text_pay" /></Menu.Item>
                <Menu.Item><Translate id="text_view_payment_history" /></Menu.Item>
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
            <DownPaymentTable formData={detail} />
        }
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