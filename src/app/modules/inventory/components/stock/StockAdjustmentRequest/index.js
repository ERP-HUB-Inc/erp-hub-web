import React from "react";
import {Col, Icon, Input, Pagination, Row, Select} from "antd";
import Component from "../../../../common/components/Component";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import StockAdjustmentRequestService from "../../../services/stock/StockAdjustmentRequestService";
import StockAdjustmentRequestAction from "../../../actions/stock/stockAdjustmentRequest";

export default class PurchaseOrderLists extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      data: [],
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
    this.title = <this.Translate id="text_stock_adjustment"/>;
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "createdAt",
        key: "createdAt",
        width: 180,
        render: value => this.Util.formatDate(value, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_description" />,
        dataIndex: "title",
        key: "title"
      },
      {
        title: <this.Translate id="text_requested_by" />,
        dataIndex: "user",
        key: "user",
        render: user => user ? <span style={{textTransform: "uppercase"}}>{user.fullName}</span> : this.emptyText
      },
      {
        title: <this.Translate id="text_approved_by" />,
        dataIndex: "approver",
        key: "approver",
        render: approver => approver ? <span style={{textTransform: "uppercase"}}>{approver.fullName}</span> : this.emptyText
      },
      {
        title: <this.Translate id="text_reason" />,
        dataIndex: "reason",
        key: "reason"
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "step",
        key: "step",
        width: 80,
        render: step => step in this.ADJUSTMENT_STEP ? <this.Tag color={this.ADJUSTMENT_STEP[step].color} className="text-uppercase text-center adjustment-step-tag">{this.ADJUSTMENT_STEP[step].name}</this.Tag> : ""
      }
    ];
    this.fetchingProp = "adjustment";
    this.service = StockAdjustmentRequestService;
    this.fetchingProp = "list";
    this.pageSize = 50;
    this.pathname = "/stock/adjustment/request";
    this.status_options = [{name: <this.Translate id="text_all_step"/>, value: -1}];
    this.ADJUSTMENT_STEP = {
      [Enum.STOCK_ADJUST_STEP.REQUEST]: {name: <this.Translate id="text_requested" />, color:  this.Enum.STOCK_ADJUST_COLOR.REQUEST},
      [Enum.STOCK_ADJUST_STEP.COMPLETE]: { name: <this.Translate id="text_approved" />, color: this.Enum.STOCK_ADJUST_COLOR.COMPLETE}
    };
    this.action = StockAdjustmentRequestAction;
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    Object.keys(this.ADJUSTMENT_STEP).map((prop) => {
      this.status_options.push({name: this.ADJUSTMENT_STEP[prop].name, value: prop});
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
    }else{
      params.delete("search");
    }

    if (params.get("status")) {
      filter.step = [Number(params.get("status"))];
    }

    if (!withPagination){
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

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
    const queryParams = new URLSearchParams(document.location.search);
    const value = e.target.value;
    queryParams.set("search", value ? value.trim() : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
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
         .finally(() => {
           this.fetchList();
           this.setState({
              selectedRowKeys: [],
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
                  <Col span={6} style={{marginBottom: 0}}>
                    <h3 style={{marginBottom: 0, fontWeight: 600}}>{this.title}</h3>
                  </Col>
                  <Col span={18} style={{textAlign: "right", display: "flex", justifyContent: "end"}}>
                    <Input
                        name="search"
                        placeholder={this.CATranslate("text_search", this.props.locale)}
                        prefix={<Icon type="search" />}
                        defaultValue={params.get("search") ? params.get("search") : ""}
                        style={{height: 32, width: 200, marginRight: 10}}
                        allowClear={true}
                        onChange={this.handleSearch}
                    />
                    <Select
                        defaultValue={params.get("status") == null ? this.status_options[0].value : params.get("status") }
                        onChange={this.handleChangeStatus}
                        style={{width: 200, marginRight: 10}}
                    >
                      {
                        this.status_options.map((statusOption, index) =>
                            <Select.Option value={statusOption.value} key={index}>{statusOption.name}</Select.Option>
                        )
                      }
                    </Select>
                    <this.Button
                        type="info"
                        id="btnAdd"
                        className="mg-right text-uppercase"
                        onClick={()=> history.push({pathname: "/stocks/adjustment/create"})}>
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
                      onDoubleClick:() => history.push({pathname: "/stocks/adjustment/update/"+record.id})
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