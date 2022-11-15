import React from "react";
import {Col, DatePicker, Icon, Input, Pagination, Row, Select} from "antd";
import Component from "../../../../common/components/Component";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import StockTransferService from "../../../services/stock/StockTransferService";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";
import LocationService from "../../../../pos/services/settings/LocationService";
import moment from "moment";

export default class StockTransferList extends Component {

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
    this.title = <this.Translate id="text_stock_transfer"/>;
    this.pageSize = 50;
    this.path = "/stock/transfer";
    this.pathCreate = "/stocks/transfer/create";
    this.pathUpdate = "/stocks/transfer/update";
    this.fetchingProp = "list";
    this.service = StockTransferService;
    this.action = StockAdjustmentRequestAction;
    this.columnFilterWithKey = ["name", "title", "number"];
    this.locations = [{name: <this.Translate id="text_all_store"/>, id: 0}];
    this.status_options = [{name: <this.Translate id="text_all_step"/>, value: -1}];
    this.STATUS_STEP_STR = {
      [Enum.STOCK_STRANSFER_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color: this.Enum.STOCK_TRANSFER_STEP_COLOR.PROCESS},
      [Enum.STOCK_STRANSFER_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.RECEIVED},
      [Enum.STOCK_STRANSFER_STEP.CANCEL]: {name: <this.Translate id="text_canceled" />, color:  this.Enum.STOCK_TRANSFER_STEP_COLOR.CANCEL}
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: value => this.Util.formatDate(value, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_from_location" />,
        dataIndex: "fromLocation",
        key: "fromLocation",
        render: fromLocation => fromLocation.name
      },
      {
        title: <this.Translate id="text_to_location" />,
        dataIndex: "toLocation",
        key: "toLocation",
        render: toLocation => toLocation.name
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "description",
        key: "description"
      },
      {
        title: <this.Translate id="text_step" />,
        dataIndex: "step",
        key: "step",
        width: 100,
        render: step => step in this.STATUS_STEP_STR ? <this.Tag color={this.STATUS_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.STATUS_STEP_STR[step].name}</this.Tag> : ""
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

    Object.keys(this.STATUS_STEP_STR).map((prop) => {
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
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
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
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("start") && params.get("end")) {
      ranges = JSON.stringify({column: "createdAt", value: [params.get("start"), params.get("end")]});
    }

    if (params.get("status")) {
      filter.step = [Number(params.get("status"))];
    }

    if (params.get("location")) {
      filter.fromLocationId = [Number(params.get("location"))];
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.Util.pushParamsToURL(this.pathname, params.toString());
      this.setState({current: 1});
    }

    this.setState({loading: true});
    this.service.lists(limit, offset, "", "", JSON.stringify(filter), searchKey, ranges)
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

  handleChangeStatus = (status) => {
    const params = new URLSearchParams(document.location.search);
    if (status && status >= 0){
      params.set("status", status);
    }else{
      params.delete("status");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  handleChangeDate = (dates) => {
    const params = new URLSearchParams(document.location.search);
    if (dates.length) {
      params.set("start", moment(dates[0]).format("YYYY-MM-DD"));
      params.set("end", moment(dates[1]).format("YYYY-MM-DD"));
    } else {
      params.delete("start");
      params.delete("end");
    }
    this.Util.pushParamsToURL(this.pathname,  params.toString());
    this.fetchList();
  }

  handleChangeLocation = (location) => {
    const params = new URLSearchParams(document.location.search);
    if (location != 0){
      params.set("location", location);
    }else{
      params.delete("location");
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
          .catch(() => {
            this.Message.error(this.CATranslate("error_warning_delete_adjustment", this.props.locale));
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
    /*const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
      })
    };*/
    const params = new URLSearchParams(window.location.search);

    return (
        <React.Fragment>
          <div className="content-list">
            <div style={{height: "100%"}}>
              <div className="table-wrapper">
                <Row>
                  <Col span={5} style={{marginBottom: 0}}>
                    <h3 style={{marginBottom: 0, fontWeight: 600}}>{this.title}</h3>
                  </Col>
                  <Col span={19} style={{textAlign: "right", display: "flex", justifyContent: "end"}}>
                    <Input
                      name="search"
                      placeholder={this.CATranslate("text_search", this.props.locale)}
                      prefix={<Icon type="search" />}
                      defaultValue={params.get("search") ? params.get("search") : ""}
                      style={{height: 32, width: 200, marginRight: 10}}
                      allowClear={true}
                      onChange={this.handleSearch}
                    />
                    <DatePicker.RangePicker
                      name="dates"
                      placeholder={this.CATranslate("text_select_date", this.props.locale)}
                      defaultValue={params.get("start") && params.get("end") ? [moment(params.get("start")),moment(params.get("end"))] : ""}
                      style={{maxWidth: 200, marginRight: 10, textAlign: "left"}}
                      onChange={this.handleChangeDate}
                    />
                    <Select
                      defaultValue={params.get("status") == null ? this.status_options[0].value : params.get("status") }
                      onChange={this.handleChangeStatus}
                      style={{width: 150, marginRight: 10}}
                    >
                      {
                        this.status_options.map((statusOption, index) =>
                          <Select.Option value={statusOption.value} key={index}>{statusOption.name}</Select.Option>
                        )
                      }
                    </Select>
                    {this.state.locations.length &&
                      <Select
                        defaultValue={params.get("location") ? parseInt(params.get("location")) : this.state.locations[0].id}
                        onChange={this.handleChangeLocation}
                        style={{width: 150, marginRight: 10}}
                      >
                        {
                          this.state.locations.map((location, index) =>
                            <Select.Option value={location.id} key={index}>{location.name}</Select.Option>
                          )
                        }
                      </Select>
                    }
                    <this.Button
                      type="info"
                      id="btnAdd"
                      className="mg-right text-uppercase"
                      onClick={()=> history.push({pathname: this.pathCreate})}>
                    <span className="icon-add icon-padding-right"></span>
                    <this.Translate id="text_add_new" />
                  </this.Button>
                    {/*<this.Button
                      type="danger"
                      className="text-uppercase"
                      disabled={this.state.isRequestDelete}
                      onClick={this.showDeleteModal}>
                    <span className="icon-delete icon-padding-right"></span>
                    <this.Translate id="text_delete" />
                  </this.Button>*/}
                  </Col>
                </Row>
                <this.Table
                  bordered={true}
                  rowKey="id"
                  /*rowSelection={rowSelection}*/
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
