import React from "react";
import {connect} from "react-redux";
import {
  Col,
  Pagination,
  Row,
  Icon,
  Input,
  Form,
  Tag
} from "antd";
import InstallmentService from "../../services/InstallmentService";
import history from "../../../common/router/history";
import Component from "../../../common/components/Component";
import Enum from "../../enum";

class Installment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      current: 1,
      loading: false
    };
    this.INSTALLMENT_STATUS_STR = {
      [Enum.INSTALLMENT_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "#bfbfbf"},
      [Enum.INSTALLMENT_STATUS.RECEIVED]: { title: <this.Translate id="text_received" />, color: "#1890ff"},
      [Enum.INSTALLMENT_STATUS.COMPLETED]: { title: <this.Translate id="text_completed" />, color: "#f50"},
    };
    this.columns = [
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "customer",
        render: (firstName, record) => firstName + " " + record.lastName
      },
      {
        title: <this.Translate id="text_product" />,
        dataIndex: "product",
        key: "product"
      },
      {
        title: <this.Translate id="text_received_date" />,
        dataIndex: "receiveDate",
        key: "receiveDate",
        width: 140,
        render: receiveDate => this.Util.formatDate(receiveDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_payment_date" />,
        dataIndex: "paymentDate",
        key: "paymentDate",
        render: paymentDate => this.Util.formatDate(paymentDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_duration" />,
        dataIndex: "duration",
        key: "duration",
        render: (duration, record) => `${duration} ${this.CATranslate(`text_${record.durationType.toLowerCase()}`, this.props.locale)}`
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status) => {
          const statusValue = this.INSTALLMENT_STATUS_STR[status];
          const statusColor = statusValue.color;
          const stepTitle = statusValue.title;
          return <Tag color={statusColor} style={{width: 100, textAlign: "center"}}>{stepTitle}</Tag>;
        }
      },
      {
        title: <this.Translate id="text_price" />,
        dataIndex: "price",
        key: "price",
        align: "right",
        render: price => this.Util.formatCurrency(price)
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "total",
        key: "total",
        align: "right",
        render: total => this.Util.formatCurrency(total)
      }
    ];
    this.pathname = "/installment/list";
    this.timer = null;
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    this.fetchList();
  }

  fetchList(withPagination = false) {
    const params = new URLSearchParams(document.location.search);
    let limit = this.pageSize,
      offset = this.state.current,
      searchKey = "";

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    offset = (offset - 1) * limit;
    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    InstallmentService.list(limit, offset, searchKey)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  handleSearch = (e) => {
    clearTimeout(this.timer);
    const value = e.target.value;
    const params = new URLSearchParams(document.location.search);
    if (value) {
      params.set("search", value);
    } else {
      params.delete("search");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 600);
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  renderPagination(pagination) {
    pagination = {
      total: pagination.total,
      pageSize: pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className="float-right">
          <Pagination 
            size="small" 
            showTotal={showTotal} 
            showSizeChanger
            defaultCurrent={this.state.current}
            defaultPageSize={this.pageSize}
            onShowSizeChange={this.onTableChange} 
            onChange={this.onTableChange} 
            {...pagination} />
        </div>
        :
        ""
    );
  }

  render() {
    const params = new URLSearchParams(document.location.search);
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={6} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_installment" /></h3>
                </Col>
                <Col span={18} style={{textAlign: "right", display: "flex", justifyContent: "flex-end"}}>
                  <Input
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<Icon type="search" />}
                    defaultValue={params.get("search") ? params.get("search") : ""}
                    style={{height: 32, width: 200, marginRight: 10}}
                    allowClear={true}
                    onChange={this.handleSearch}
                  />

                  <this.Button
                    type="info"
                    id="btnAdd"
                    className="text-uppercase"
                    onClick={() => history.push("/installment/create")}
                  >
                    <span className="icon-add icon-padding-right"></span>
                    <this.Translate id="text_add_new" />
                  </this.Button>
                </Col>
              </Row>
              <this.Table 
                bordered={true}
                rowKey="id"
                loading={this.state.loading}
                columns={this.columns}
                dataSource={this.state.data}
                onChange={this.onChange}
                onRow={record => ({
                  onDoubleClick:() => history.push(`/installment/update/${record.id}`)
                })}
              />
              <div style={{marginTop: 15}}>
                {this.renderPagination(this.state.pagination)}
              </div>

              <this.clearFloating/>
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale,
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const installment =  Form.create(mapPropsToFields)(Installment);
  
export default connect(mapStateToProps)(installment);