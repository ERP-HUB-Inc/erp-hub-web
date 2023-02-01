import React from "react";
import moment from "moment";
import {connect} from "react-redux";
import {
  Form,
  Row,
  Col,
  DatePicker,
  Pagination,
  Tag,
  Menu,
  Dropdown
} from "antd";
import Enum from "../../../enums";
import StockCountService from "../../../services/stock/StockCountService";
import LocationService from "../../../../pos/services/settings/LocationService";
import history from "../../../../common/router/history";
import Component from "../../../../common/components/Component";
import { Select } from "../../../../common/elements/ant-ui";


class StockCountList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      locations: [],
      pagination: {},
      current: 1,
      loading: false
    };
    const STATUS_STR = {
      [Enum.STOCK_COUNT_STATUS.IN_PROGRESS]: {title: <this.Translate id="text_in_progress" />, color: "#ffa940"},
      [Enum.STOCK_COUNT_STATUS.PAUSE]: {title: <this.Translate id="text_pause" />, color: "#f50"},
      [Enum.STOCK_COUNT_STATUS.COMPLETED]: {title: <this.Translate id="text_completed" />, color: "#87d068"}
    };
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        width: 500,
        render: (name, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/stock/stock-count/update/${record.id}`}>
                  <this.Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_continue_count" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/stock/stock-count/detail/${record.id}`}>
                  <this.Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_details" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );

          return <div className="wrap-product-name" style={{display: "flex"}}>
            {name}
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
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location"
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusStr = STATUS_STR[status];
          return <Tag style={{width: 120, textAlign: "center"}} color={statusStr.color}>{statusStr.title}</Tag>;
        }
      }
    ];
    this.locations = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.pathname = "/stock/stock-count/list";
  }

  componentDidMount() {
    this.fetchList();

    LocationService.lists(this.pageSize, 0)
    .then(response => {
      this.setState({locations: this.locations.concat(response.data.data)});
    });
  }

  fetchList(withPagination = false) {
    let limit = this.pageSize;
    let offset = this.state.current;
    let filter = "";
    let search = "";
    let range = "";
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("date")) {
      range = JSON.stringify({column: "startDate", value: [params.get("date"), params.get("date")]});
    }

    if (params.get("locationId")) {
      filter = JSON.stringify({locationId: Number(params.get("locationId"))});
    }

    offset = (offset - 1) * limit;
    if (!withPagination) {
      offset = 0;
      params.delete(offset);
      this.Util.pushParamsToURL(this.pathname, params.toString());
    }

    this.setState({loading: true});
    StockCountService.lists(limit, offset, "", "", filter, search, range)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  onChangeDate = (date) => {
    const params = new URLSearchParams(document.location.search);
    if (date) {
      params.set("date", this.Util.formatDateForMYSQL(date));
    } else {
      params.delete("date");
    }
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangeLocation = (locationId) => {
    const params = new URLSearchParams(document.location.search);
    if (locationId) {
      params.set("locationId", locationId);
    } else {
      params.delete("locationId");
    }
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  render() {
    const params = new URLSearchParams(document.location.search);
    const {pagination} = this.state;
    return (
      <React.Fragment>
        <div className="content-list">
          <div style={{height: "100%", marginTop: 10}}>
            <div className="table-wrapper">
              <Row>
                <Col span={12} style={{marginBottom: 0}}>
                  <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_stock_count" /></h3>
                </Col>
                <Col span={12} style={{display: "flex", justifyContent: "flex-end"}}>
                  <DatePicker
                    onChange={this.onChangeDate}
                    name="date"
                    placeholder={this.CATranslate("text_select_date", this.props.locale)}
                    defaultValue={params.get("date") ? moment(params.get("date")) : null}
                    style={{maxWidth: 200, marginRight: 10}}
                  />
                  <Select 
                    name="locationId"
                    valueKey="id"
                    placeholder={`${this.CATranslate("text_all_location", this.props.locale)}`}
                    defaultValue={params.get("locationId") ? Number(params.get("locationId")) : null}
                    dataSource={this.state.locations}
                    style={{width: 200, margin: "-4px 10px 0 0"}}
                    onChange={this.onChangeLocation}
                    form={this.props.form} />
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
                  pagination.total ?
                  <div className="float-right">
                    <Pagination 
                      total={pagination.total}
                      showTotal={(total) => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`}
                      pageSize={pagination.limit}
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