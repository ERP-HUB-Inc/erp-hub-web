import React from "react";
import {Col, DatePicker, Icon, Input, Pagination, Row, Tag} from "antd";
import Component from "../../../../common/components/Component";
import history from "../../../../common/router/history";
import StockConsignmentService from "../../../services/stock/StockConsignmentService";
import LocationService from "../../../../pos/services/settings/LocationService";
import moment from "moment";

export default class StockConsignment extends Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      data: [],
      locations: [],
      pagination: {},
      dataForSendMail: null,
      emailForPushToSupplier: null,
      selectedListIds: [],
      selectedRowKeys: [],
      selectedRows: [],
      modalVisible: false,
      loading: false,
      deleting: false
    };
    this.title = <this.Translate id="text_stock_consignment"/>;
    this.pageSize = 50;
    this.path = "/stock/consignment/list";
    this.pathCreate = "/stock/consignment/create";
    this.pathUpdate = "/stock/consignment/update";
    this.fetchingProp = "list";
    this.service = StockConsignmentService;
    this.columnFilterWithKey = ["name", "title", "number"];
    this.locations = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.status_options = [{name: <this.Translate id="text_all_step"/>, value: -1}];
    this.STATUS_STEP_STR = {
      "Draft": {title: <this.Translate id="text_draft" />, color: "#bfbfbf"},
      "Received": {title: <this.Translate id="text_received" />, color: "#1890ff"},
      "Returned": {title: <this.Translate id="text_returned" />, color: "#f50"}
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "date",
        key: "date",
        render: (date) => this.Util.formatDate(date, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location"
      },
      {
        title: <this.Translate id="text_seller" />,
        dataIndex: "seller",
        key: "seller"
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        width: 150,
        render: (status) => {
          const statusValue = this.STATUS_STEP_STR[status];
          return <Tag color={statusValue.color} style={{width: 120, textAlign: "center"}}>{statusValue.title}</Tag>;
        }
      }
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    Object.keys(this.STATUS_STEP_STR).forEach((prop) => {
      this.status_options.push({name: this.STATUS_STEP_STR[prop].name, value: prop});
    });
    LocationService.lists().then(({data})=>{
      this.setState({locations: [...this.locations, ...data.data]});
      this.locations = [...this.locations, ...data.data];
    });
    this.fetchList(true);

  }

  fetchList(withPagination= false) {
    let searchKey = "";
    let limit = this.pageSize;
    let date = "";
    let offset = this.state.current;
    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;

    if (params.get("search")) {
      searchKey = params.get("search");
    }

    if (params.get("date")) {
      date = params.get("date");
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.Util.pushParamsToURL(this.pathname, params.toString());
      this.setState({current: 1});
    }

    this.setState({loading: true});
    this.service.lists(limit, offset, searchKey, date)
      .then((response) => {
        if (response.data && response.data.data) {
          this.setState({
            data: response.data.data,
            pagination: response.data.pagination
          });
        }
      })
      .finally(() => this.setState({loading: false}));
  }

  checkIsAllowDeleteRecordOrNot() {
    if (
        this.state.selectedListIds &&
        this.state.selectedListIds.length > 0 &&
        this.props[this.fetchingProp]
    ) {
      let isHasSystemRecord = false;
      this.state.selectedListIds.forEach((selectedId) => {
        const result = this.props[this.fetchingProp].list.find(
            (record) => record.id === selectedId
        );

        if (result && result.isSystem === this.Enum.IS_SYSTEM) {
          isHasSystemRecord = true;
          this.Message.warning(
              this.CATranslate(
                  "text_warning_delete_system_record",
                  this.props.locale
              )
          );
        }
      });
      return isHasSystemRecord;
    }
  }

  handleSearch = (e) => {
    const params = new URLSearchParams(document.location.search);
    const value = e.target.value;
    if (value && value.trim()){
      params.set("search", value.trim());
    }else{
      params.delete("search");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 1000);
  }

  handleChangeDate = (date) => {
    const params = new URLSearchParams(document.location.search);
    if (date){
      params.set("date", date ? moment(date).format("YYYY-MM-DD") : "");
    }else{
      params.delete("date");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  onShowSizeChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList(true);
  }

  onSelectChange = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys,
      selectedRows
    });
  }

  mapSelectedListIds(values) {
    return values.map(value => value.id);
  }

  handleDelete = () => {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
          .then(() => {
            this.fetchList(true);
            this.setState({
              selectedRowKeys: []
            });
          })
          .catch((err) => {
            const error = err.response && err.response.data && err.response.data.error;
            if (error){
              this.Message.error(error.message);
            }
          })
          .finally(() => {
            this.setState({
              modalVisible: false,
              deleting: false
            });
          });

    }
  }

  showDeleteModal = () => {
    if (this.checkIsAllowDeleteRecordOrNot()) {
      return;
    }
    if (this.state.selectedRowKeys.length > 0) {
      this.setState({modalVisible: true, showDeleteModal: true});
    } else {
      this.Message.warning(this.CATranslate("text_warning_select_row_to_delete", this.props.locale));
    }
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
                  onShowSizeChange={this.onShowSizeChange}
                  onChange={this.onChangePagination}
                  {...pagination} />
            </div>
            :
            ""
    );
  }

  render() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
      })
    };
    const params = new URLSearchParams(window.location.search);

    return (
        <React.Fragment>
          <div className="content-list">
            <div style={{height: "100%"}}>
              <div className="table-wrapper">
                <Row>
                  <Col span={8} style={{marginBottom: 0}}>
                    <h3 style={{marginBottom: 0, fontWeight: 600}}>{this.title}</h3>
                  </Col>
                  <Col span={16} style={{textAlign: "right", display: "flex", justifyContent: "flex-end"}}>
                    <Input
                      name="search"
                      placeholder={this.CATranslate("text_search", this.props.locale)}
                      prefix={<Icon type="search" />}
                      defaultValue={params.get("search") ? params.get("search") : ""}
                      style={{height: 32, width: 200, marginRight: 10}}
                      allowClear={true}
                      onChange={this.handleSearch}
                    />
                    <DatePicker
                      onChange={this.handleChangeDate}
                      name="date"
                      placeholder={this.CATranslate("text_select_date", this.props.locale)}
                      defaultValue={params.get("date") ? moment(params.get("date")) : ""}
                      style={{maxWidth: 200, marginRight: 10}}
                    />
                    <this.Button
                      type="info"
                      id="btnAdd"
                      className="mg-right text-uppercase"
                      onClick={()=> history.push({pathname: this.pathCreate})}>
                      <span className="icon-add icon-padding-right"></span>
                      <this.Translate id="text_add_new" />
                    </this.Button>
                    <this.Button
                      type="danger"
                      className="text-uppercase"
                      disabled={this.state.isRequestDelete}
                      onClick={this.showDeleteModal}>
                    <span className="icon-delete icon-padding-right"></span>
                    <this.Translate id="text_delete" />
                  </this.Button>
                  </Col>
                </Row>
                <this.Table
                    bordered={true}
                    rowKey="id"
                    rowSelection={rowSelection}
                    loading={this.state.loading}
                    columns={this.columns}
                    dataSource={this.state.data}
                    onRow={record =>({
                      onDoubleClick:() => history.push({pathname: this.pathUpdate +"/"+ record.id})
                    })}
                />
                <div style={{marginTop: 15}}>
                  {this.renderPagination(this.state.pagination)}
                </div>
                <this.clearFloating/>
              </div>
            </div>
          </div>
          <this.Modal
              visible={this.state.modalVisible}
              wrapClassName="confirm-delete"
              footer={null}>
            <div>
              { this.state.showDeleteModal &&
              <React.Fragment>
                <span className="icon-help icon-padding-right"></span>
                <span className="title">COMPLETED</span><br/>
                <span><this.Translate id="text_confirm_delete" /></span>
              </React.Fragment>
              }
            </div>
            <div className="ant-modal-footer">
              <this.Button className="danger text-uppercase" onClick={()=>this.setState({modalVisible: false})}>
                <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel"/>
              </this.Button>
              <this.Button onClick={this.handleDelete} loading={this.state.deleting} className="info text-uppercase">
                <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes"/>
              </this.Button>
            </div>
          </this.Modal>
        </React.Fragment>
    );
  }
}
