import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {
  Form,
  Row,
  Col,
  Card,
  Statistic,
  Pagination,
  Dropdown,
  Menu
} from "antd";
import Enum from "../../enum";
import Component from "../../../common/components/Component";
import FormCreate from "./FormCreate";
import BookingService from "../../services/BookingService";
import FormUpdate from "./FormUpdate";

class BookingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      detail: {},
      summary: {},
      customers: [],
      action: "",
      pagination: {},
      current: 1,
      loading: false
    };
    this.dateFormat = "DD/MM/YYYY h:mm A";
    this.BOOKING_STATUS_STR = {
      [Enum.BOOKING_STATUS.BOOKED]: {title: <this.Translate id="text_booked" />, color: "#bfbfbf"},
      [Enum.BOOKING_STATUS.CANCELLED]: {title: <this.Translate id="text_cancelled" />, color: "#f5222d"},
      [Enum.BOOKING_STATUS.SERVING]: {title: <this.Translate id="text_serving" />, color: "#1890ff"},
      [Enum.BOOKING_STATUS.SERVED]: {title: <this.Translate id="text_served" />, color: "#52c41a"},
      [Enum.BOOKING_STATUS.DELAYED]: {title: <this.Translate id="text_delayed" />, color: "#ffc069"}
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "start",
        key: "start",
        width: 700,
        render: (start, record) => {
          const menu = (
            <Menu>
              <Menu.Item onClick={() => this.handleShowFormEdit(record.id)}>
                <this.Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
              </Menu.Item>
              <Menu.Item onClick={() => this.handleMarkAction(record.id, Enum.MARK_COMPLETED)}>
                <this.Icon type="check" /> <this.Translate id="text_mark_as_completed" />
              </Menu.Item>
              {
                record.status === Enum.BOOKING_STATUS.BOOKED ?
                <Menu.Item onClick={() => this.handleMarkCancelled(record.id)}>
                  <this.Icon type="close-circle" /> <this.Translate id="text_mark_as_cancelled" />
                </Menu.Item>
                : null
              }
              <Menu.Item onClick={() => this.handleMarkAction(record.id, Enum.MARK_DELAY)}>
                <this.Icon type="clock-circle" /> <this.Translate id="text_mark_as_delay" />
              </Menu.Item>
              <Menu.Item onClick={() => this.handleDelete(record.id)}>
                <this.Icon type="delete" style={{marginRight: 10}} /> <this.Translate id="text_delete" />
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {moment(start).format("DD/MM/YYYY")} ~ ({moment(start).format("hh:mm A")} - {moment(record.end).format("hh:mm A")})
            <Dropdown className="product-row-option" overlay={menu}>
              {/* eslint-disable-next-line */}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName ? record.lastName : ""}`
      },
      {
        title: <this.Translate id="text_phone_number" />,
        dataIndex: "phoneNumber",
        key: "phoneNumber"
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusValue = this.BOOKING_STATUS_STR[status];

          if (statusValue) {
              let statusColor = statusValue.color;
              let statusTitle = statusValue.title;
              return <this.Tag color={statusColor} style={{width: 120, textAlign: "center"}}>{statusTitle}</this.Tag>;
          }
        }
      }
    ];
    this.pathname = "/bookings/list";
    this.timer = null;
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList(withPagination = false) {
    let limit = this.pageSize,
      offset = this.state.current,
      search = "",
      range = "";

    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      search = params.get("search");
    }

    if (params.get("start")) {
      range = JSON.stringify({value: [params.get("start"), params.get("end")]});
    }

    offset = (offset - 1) * limit;

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    BookingService.list(limit, offset, search, 0, "", range)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));

    BookingService.summary(search, range)
    .then(response => {
      this.setState({summary: response.data.data});
    });
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

  handleChangDate = (dates) => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("start", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("end", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("start");
      params.delete("end");
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  handleAfterCreate = () => {
    this.fetchList();
  }

  handleAfterUpdate = () => {
    this.setState({detail: {}});
    this.fetchList();
  }

  handleAfterAction = () => {
    this.setState({detail: {}, action: ""});
    this.fetchList();
  }

  handleShowFormCreate() {
    this.formCreateRef.handleShowForm();
  }

  handleShowFormEdit(id) {
    BookingService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data}, () => {
        this.formUpdateRef.handleShow();
      });
    });
  }

  handleMarkAction(id, action) {
    BookingService.detail(id)
    .then(response => {
      this.setState({detail: response.data.data, action}, () => {
        this.formUpdateRef.handleShow();
      });
    });
  }

  handleMarkCancelled(id) {
    this.Util.sweetAlertConfirm(
      "Confirm",
      this.CATranslate("text_are_you_sure", this.props.locale),
      ["No", "Yes"]
    )
    .then(willCancel => {
      if (willCancel) {
        BookingService.markAsCancelled(id)
        .then(() => this.handleAfterAction());
      }
    });
  }

  handleCloseForm = () => {
    this.setState({action: ""});
  }

  handleDelete(id) {
    this.Util.sweetAlertConfirm(
      "",
      this.CATranslate("text_are_you_sure", this.props.locale),
      [this.CATranslate("text_cancel", this.props.locale), this.CATranslate("text_delete", this.props.locale)]
    )
    .then(willDelete => {
      if (willDelete) {
        BookingService.delete(id)
        .then(() => {
          this.fetchList();
          this.Util.sweetAlertMessageV2(this.CATranslate("text_success", this.state.locale), this.CATranslate("text_one_record_deleted", this.props.locale), "success");
        })
        .catch(err => {
          if (err.response && err.response.data) {
            this.Util.sweetAlertMessageV2(
              this.CATranslate("text_sorry", this.props.locale),
              this.CATranslate("text_something_went_wrong", this.props.locale),
              "error"
            );
          }
        });
      }
    });
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys,
      selectedRows
    });
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
    const {data, summary} = this.state;
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={6} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_booking" /></h3>
                </Col>
                <Col span={18} style={{display: "flex", justifyContent: "flex-end"}}>
                  <this.InputText
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<this.Icon type="search" />}
                    style={{height: 32, width: 200, marginBottom: 0}}
                    allowClear={true}
                    onChange={this.handleSearch}
                    form={this.props.form}
                  />
                  <this.DateRangePicker 
                    name="dates"
                    placeholder={[this.CATranslate("text_start_date", this.props.locale), this.CATranslate("text_end_date", this.props.locale)]}
                    allowClear={true}
                    ranges={{
                      [`${this.CATranslate("text_today", this.props.locale)}`]: [moment(), moment()],
                      [`${this.CATranslate("text_this_week", this.props.locale)}`]: [moment().startOf("isoWeek"), moment().endOf("isoWeek")]
                    }}
                    dateFormat="DD-MM-YYYY"
                    style={{width: 260, marginLeft: 15, marginBottom: 0}}
                    onChange={this.handleChangDate}
                    form={this.props.form}
                  />
                </Col>
              </Row>

              <Row gutter={16} style={{marginTop: 9}}>
                <Col span={8}>
                  <Card>
                    <Statistic 
                      title={<this.Translate id="text_booked"/>}
                      value={summary && summary.booked}
                      valueStyle={{color: "#bfbfbf"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_serving"/>}
                      value={summary && summary.serving}
                      valueStyle={{color: "#1890ff"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_served"/>}
                      value={summary && summary.served}
                      valueStyle={{color: "#52c41a"}}
                    />
                  </Card>
                </Col>
              </Row>

              <div style={{marginTop: 26}}>
                <this.Button type="info" onClick={() => this.handleShowFormCreate()}>
                  <this.Icon type="plus-circle" /> <this.Translate id="text_create_booking" />
                </this.Button>
              </div>
              <this.Table 
                bordered={true}
                rowKey="id"
                loading={this.state.loading}
                columns={this.columns}
                dataSource={data}
              />

              <div style={{marginTop: 15}}>
                {this.renderPagination(this.state.pagination)}
              </div>

              <this.clearFloating/>

              <FormCreate 
                ref={ref => this.formCreateRef = ref}
                locale={this.props.locale}
                onSuccess={this.handleAfterCreate}
                form={this.props.form}/>

              <FormUpdate
                ref={ref => this.formUpdateRef = ref}
                locale={this.props.locale}
                formData={this.state.detail}
                action={this.state.action}
                afterAction={this.handleAfterAction}
                onSuccess={this.handleAfterUpdate}
                handleClose={this.handleCloseForm}
                form={this.props.form} />
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

const bookingList =  Form.create(mapPropsToFields)(BookingList);
  
export default connect(mapStateToProps)(bookingList);