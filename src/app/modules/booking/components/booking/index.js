import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {
  Form,
  Row,
  Col,
  Card,
  Statistic
} from "antd";
import Enum from "../../enum";
import Component from "../../../common/components/Component";
import FormCreate from "./FormCreate";
import BookingService from "../../services/BookingService";

class BookingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      summary: {},
      customers: [],
      pagination: {},
      current: 1,
      loading: false
    };
    this.dateFormat = "DD/MM/YYYY h:mm A";
    this.BOOKING_STATUS_STR = {
      [Enum.BOOKING_STATUS.BOOKED]: {title: <this.Translate id="text_booked" />, color: "#bfbfbf" },
      [Enum.BOOKING_STATUS.SERVING]: {title: <this.Translate id="text_serving" />, color: "#ffa940" },
      [Enum.BOOKING_STATUS.SERVED]: {title: <this.Translate id="text_served" />, color: "#52c41a" }
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "start",
        key: "start",
        render: (start, record) => `${moment(start).format(this.dateFormat)} ~ ${moment(record.end).format(this.dateFormat)}`
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusValue = this.BOOKING_STATUS_STR[status];
          let statusColor = statusValue.color;
          let statusTitle = statusValue.title;
          return <this.Tag color={statusColor} style={{width: 120, textAlign: "center"}}>{statusTitle}</this.Tag>;
        }
      }
    ];
    this.pathname = "/bookings/list";
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList() {
    let limit = this.pageSize,
      offset = this.state.current,
      search = "",
      range = "";

    offset = (offset - 1) * limit;
    this.setState({loading: true});
    BookingService.list(limit, offset, search, 0, "", range)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  handleAfterCreate = () => {
    this.fetchList();
  }

  handleShowFormCreate() {
    this.formCreateRef.handleShowForm();
  }

  handleShowFormEdit(id) {

  }

  renderPagination(pagination) {
    return;
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
                      valueStyle={{color: "#52c41a"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_serving"/>}
                      value={summary && summary.serving}
                      valueStyle={{color: "#ffa940"}}
                    />
                  </Card>
                </Col>
                <Col span={8}>
                  <Card>
                    <Statistic
                      title={<this.Translate id="text_served"/>}
                      value={summary && summary.served}
                      valueStyle={{color: "#f5222d"}}
                    />
                  </Card>
                </Col>
              </Row>

              <div style={{marginTop: 26, textAlign: "right"}}>
                <this.Button type="info" onClick={() => this.handleShowFormCreate()}>
                  <this.Icon type="plus-circle" /> <this.Translate id="text_create_booking" />
                </this.Button>
              </div>
              <this.Table 
                bordered={true}
                rowKey="id"
                loading={this.state.loading}
                columns={this.columns}
                onRow={record => ({
                  onDoubleClick: () => this.handleShowFormEdit(record.id)
                })}
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