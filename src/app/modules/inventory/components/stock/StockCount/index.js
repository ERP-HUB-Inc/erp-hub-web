import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {
  Form,
  Row,
  Col,
  DatePicker,
  Input,
  Pagination
} from "antd";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";


class StockCountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "startDate",
        key: "startDate",
        render: (startDate, record) => `${this.Util.formatDate(startDate)} ${this.Util.formatDate(record.startTime, "hh:mm A")}`
      },
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location"
      }
    ];
  }

  render() {
    const params = new URLSearchParams(document.location.search);
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={12} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_stock_count" /></h3>
                </Col>
                <Col span={12} style={{textAlign: "right"}}>
                  <Input
                    name="search"
                    placeholder={this.CATranslate("text_search", this.props.locale)}
                    prefix={<this.Icon type="search" />}
                    defaultValue={params.get("search") ? params.get("search") : ""}
                    style={{width: 200, marginRight: 10}}
                    allowClear={true}
                    onChange={this.handleSearch}
                  />
                  <DatePicker
                    onChange={this.handleChangeDate}
                    name="date"
                    placeholder={this.CATranslate("text_select_date", this.props.locale)}
                    defaultValue={params.get("date") ? moment(params.get("date")) : null}
                    style={{maxWidth: 200, marginRight: 10}}
                  />
                  <this.Button
                    type="info"
                    id="btnAdd"
                    className="text-uppercase"
                    onClick={() => history.push({pathname: "/stock/stock-count/create"})}
                  >
                    <span className="icon-add icon-padding-right"></span>
                    <this.Translate id="text_add_new" />
                  </this.Button>
                </Col>
              </Row>

              <this.Table 
                rowKey="id"
                bordered={true}
                columns={this.columns}
                loading={this.state.loading}
                dataSource={this.state.data}
              />

              <div style={{marginTop: 15}}>
                {
                  this.state.pagination.total ?
                  <div className="float-right">
                    <Pagination 
                      total={this.state.pagination.total}
                      showTotal={(total) => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`}
                      pageSize={this.state.pagination.limit}
                      current={this.state.current}
                      size="small"
                      showSizeChanger
                      onShowSizeChange={this.onTableChange}
                      onChange={this.onTableChange}
                    />
                  </div>
                  : null
                }
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
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const stockCountList = Form.create(mapPropsToFields)(StockCountList);
export default connect(mapStateToProps)(stockCountList);