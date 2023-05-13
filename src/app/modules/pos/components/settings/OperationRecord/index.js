import React from "react";
import moment from "moment";
import FormCreate from "../../../containers/settings/OperationRecord/FormCreate";
import FormUpdate from "../../../containers/settings/OperationRecord/FormUpdate";
import Constant from "../../../constants/settings/operationRecord";
import OperationRecordAction from "../../../action/settings/operationRecord";
import OperationRecordService from "../../../services/settings/OperationRecordService";
import {Card, Col, Icon, Input, message, Pagination, Row, Statistic, DatePicker} from "antd";
import Component from "../../../../common/components/Component";
import PrivilegeService from "../../../services/settings/PrivilegeService";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";

export default class IncomeExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      summaryData: {},
      selectedListIds: [],
      selectedRowKeys: [],
      selectedRows: [],
      current: 1,
      content: "",
      modalVisible: false,
      loading: false,
      deleting: false,
      showDeleteModal: false,
      showCreateFrom: false,
      isHasAccessPermission: null
    };

    this.placeHolderForGeneralSearch = "text_description";
    this.pageSize = 50;
    this.fetchingProp = "list";
    this.pathname = "/transactions/income_expense";
    this.permissionModuleCode = "income_expense";
    this.service = OperationRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
    this.columnFilterWithKey = ["name"];
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "date",
        key: "date",
        width: 160,
        render: (date) => this.Util.formatDate(date, "DD/MM/YYYY"),
      },
      {
        title: <this.Translate id="text_category" />,
        dataIndex: "name",
        key: "name",
        render: (name, record) => {
          if (record.type === this.Enum.OPERATION_TYPE.EXPENSE) {
            return (
                <div>
                  <div
                      style={{
                        color: "#c72727",
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 5,
                      }}
                  >
                    <this.Translate id="text_expense" />
                  </div>
                  <div>
                    {record.category}: {name}
                  </div>
                </div>
            );
          } else {
            return (
                <div>
                  <div
                      style={{
                        color: "#4cb64c",
                        fontSize: 16,
                        fontWeight: 500,
                        marginBottom: 5,
                      }}
                  >
                    <this.Translate id="text_income" />
                  </div>
                  <div>
                    {record.category}: {name}
                  </div>
                </div>
            );
          }
        },
      },
      {
        title: <this.Translate id="text_recorded_by" />,
        dataIndex: "user",
        key: "user",
        width: 180,
      },
      {
        title: <this.Translate id="text_recorded_date" />,
        dataIndex: "registerDate",
        key: "registerDate",
        width: 180,
        render: (registerDate) =>
            this.Util.formatDate(registerDate, "DD/MM/YYYY"),
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        align: "right",
        width: 180,
        render: (amount) => this.Util.formatCurrency(amount),
      },
    ];
  }

  componentDidMount() {
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    this.getPermission();
    this.service.summary().then(({data})=>{
      this.setState({summaryData: data.data});
    });

    this.fetchList(true);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(OperationRecordAction.reset());
      this.props.dispatch(OperationRecordAction.reset(Constant.RESET_OPERATION_RECORD));
      this.fetchList(true);
    }
  }

  getPermission(){
    PrivilegeService.checkPermission(this.permissionModuleCode, "view")
        .then(({data}) => this.setState({isHasAccessPermission: data}))
        .catch(() => this.setState({isHasAccessPermission: false}));
  }

  fetchList(withPagination = false) {

    let searchKey = "";
    let filter = {};
    let limit = this.pageSize;
    let ranges = "";
    let offset = this.state.current;
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("search")) {
      searchKey = JSON.stringify({column: this.columnFilterWithKey, value: params.get("search")});
    }

    if (params.get("start") && params.get("end")) {
      ranges = params.get("start") +","+params.get("end");
    }

    offset = (offset - 1) * limit;

    if (!withPagination) {
      offset = 0;
      params.delete("offset");
      this.setState({current: 1});
    }

    this.Util.pushParamsToURL(this.pathname, params.toString());

    this.setState({loading: true});
    this.service.lists(limit, offset, "", "", filter, searchKey, ranges)
      .then(response => {
        this.setState({data: response && response.data});
      })
      .catch(() => message.error("Error"))
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
      this.fetchList();
      this.service.archive(this.state.selectedListIds)
          .then(() => {
            this.fetchList();
          }).finally(() => {
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

  checkIsAllowEditRecordOrNot(rowData) {
    let isHasDefaultRecord = false;
    if (rowData && rowData.isSystem === this.Enum.IS_SYSTEM) {
      isHasDefaultRecord = true;
      this.Message.warning(this.CATranslate("text_warning_edit_system_record", this.props.locale));
    }
    return isHasDefaultRecord;
  }

  handleShowFormEdit(rowData) {
    if (this.checkIsAllowEditRecordOrNot(rowData)) {
      return;
    }

    this.props.dispatch(this.action.showForm(rowData));
    this.setState({
      content: <FormUpdate/>
    });
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return(
        pagination.total > 0 ?
            <div className={className}>
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

  handleSearch = (e) => {
    const queryParams = new URLSearchParams(document.location.search);
    const search = e.target.value ? e.target.value.trim() : "";

    if (search){
      queryParams.set("search", search);
    }else{
      queryParams.delete("search");
    }
    this.Util.pushParamsToURL(this.pathname,  queryParams.toString());

    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.fetchList();
    }, 1000);
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

  render() {

    const {summaryData} = this.state;
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
          {this.Util.isNotCheckingPermissionV2(this.state.isHasAccessPermission) &&
          (this.state.isHasAccessPermission ?
            <React.Fragment>
              <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
                <Col span={12}>
                  <Card>
                    <Statistic
                        title={<this.Translate id="text_income"/>}
                        value={summaryData.income ? summaryData.income : 0 }
                        precision="0"
                        prefix="$"
                        valueStyle={{ color: "#3f8600" }}
                    />
                  </Card>
                </Col>
                <Col span={12}>
                  <Card>
                    <Statistic
                        title={<this.Translate id="text_expense"/>}
                        value={summaryData.expense ? summaryData.expense : 0 }
                        precision="0"
                        prefix="$"
                        valueStyle={{ color: "#cf1322" }}
                    />
                  </Card>
                </Col>
              </Row>
              <div className="content-list">
                <div style={{height: "100%"}}>
                  <div className="table-wrapper">
                    <Row>
                      <Col span={6} style={{marginBottom: 0}}>
                        <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_income_and_expense" /></h3>
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
                        <DatePicker.RangePicker
                            name="dates"
                            onChange={this.handleChangeDate}
                            style={{maxWidth: 300, marginRight: 10}}
                            defaultValue={params.get("start") && params.get("end") ? [moment(params.get("start")),moment(params.get("end"))] : null}
                        />
                        <this.Button
                            type="info"
                            id="btnAdd"
                            className="mg-right"
                            disabled={this.state.loadingPopup || this.props[this.fetchingProp].fetching}
                            onClick={()=> {
                              this.props.dispatch(this.action.showForm());
                              this.props.add.showForm = true;
                              this.setState({modalVisible: false, content: <FormCreate />});
                            }}>
                          <span className="icon-add icon-padding-right"></span>
                          <this.Translate id="text_add_new" />
                        </this.Button>
                        <this.Button
                            type="danger"
                            disabled={this.state.isRequestDelete}
                            onClick={this.showDeleteModal}>
                          <span className="icon-delete icon-padding-right"></span>
                          <this.Translate id="text_delete" />
                        </this.Button>
                      </Col>
                    </Row>
                    <this.Table
                        bordered={true}
                        rowSelection={rowSelection}
                        rowKey="id"
                        loading={this.state.loading}
                        columns={this.columns}
                        dataSource={this.state.data.data}
                        onChange={this.onChange}
                        onRow={record =>({
                          onDoubleClick:() => this.handleShowFormEdit(record)
                        })}
                    />

                    <div style={{marginTop: 15}}>
                      {this.renderPagination(this.state.pagination)}
                    </div>
                    <this.clearFloating/>

                  </div>
                </div>
              </div>
              {
                this.state.content
              }
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
                  <this.Button className="danger" onClick={()=>this.setState({modalVisible: false})}>
                    <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel"/>
                  </this.Button>
                  <this.Button onClick={this.handleDelete} loading={this.state.deleting} className="info">
                    <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes"/>
                  </this.Button>
                </div>
              </this.Modal>
            </React.Fragment>
            :
            <NoPermissionV2/>
          )
          }
        </React.Fragment>
    );

  }
}