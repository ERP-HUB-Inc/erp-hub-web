import React from "react";
import moment from "moment";
import FormCreate from "../../../containers/settings/OperationRecord/FormCreate";
import FormUpdate from "../../../containers/settings/OperationRecord/FormUpdate";
import Constant from "../../../constants/settings/operationRecord";
import OperationRecordAction from "../../../action/settings/operationRecord";
import OperationRecordService from "../../../services/settings/OperationRecordService";
import {Card, Col, message, Pagination, Row, Statistic} from "antd";
import Component from "../../../../common/components/Component";

export default class IncomeExpense extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      summaryData: {},
      modalVisible: false,
      loading: false,
      deleting: false,
      showDeleteModal: false,
      showCreateFrom: false,
      pagination: {},
      current: 1,
      content: "",
      selectedListIds: [],
      selectedRowKeys: [],
      selectedRows: []
    };

    this.module = "transactions";
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
    this.generalSearchLabel = "text_search";
    this.placeHolderForGeneralSearch = "text_description";
    this.columnFilterWithKey = ["name"];
    this.pageSize = 50;
    this.fetchingProp = "list";
    this.pathname = "/transactions/income_expense";
    this.service = OperationRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
  }

  componentDidMount() {
    const params = new URLSearchParams(document.location.search);

    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    if (params.get("search")) {
      this.props.form.setFieldsValue({search: params.get("search")});
    }

    if (params.get("start")) {
      this.props.form.setFieldsValue({dates: [moment(params.get("start")), moment(params.get("end"))]});
    }

    this.service.summary().then(({summaryData})=>{
      this.setState({summaryData});
    });
    this.fetchList(true);
  }

  componentWillUpdate(nextProps) {

    if (nextProps.add.added) {
      this.fetchList();
      this.props.dispatch(this.action.reset());
    }
    if (nextProps.update.updated) {
      const {data} = this.state;
      const index = data.data.findIndex(item =>item.id === nextProps.update.response.data.id);
      if (index >= 0 && nextProps.update.response){
        data.data[index] = nextProps.update.response.data;
        this.setState({data});
        this.props.dispatch(this.action.reset());
      }
    }
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

    if (params.get("start")) {
      ranges = params.get("start") +","+params.get("end");
    }

    offset = (offset - 1) * limit;
    if (!withPagination){
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
        .catch(err => message.error("Error"))
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

  renderFilterRecord() {
    const { form } = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return form == null ? (
        ""
    ) : (
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="3">
              <this.InputText
                  name="search"
                  label={<this.Translate id={this.generalSearchLabel}/>}
                  placeholder={this.CATranslate(this.placeHolderForGeneralSearch, this.props.locale)}
                  form={this.props.form}
                  allowClear={true} />
            </this.Col>
            <this.DateRangePicker
                name="dates"
                label={<this.Translate id="text_date" />}
                ranges={[]}
                form={this.props.form}
            />
            <this.Col md="2" className="wrap-btn-search">
              <div
                  className="ant-form-item-label"
                  style={{ visibility: "hidden" }}
              >
                <label htmlFor="status" className="" title="">
                  Filter
                </label>
              </div>
              <this.Button
                  htmlType="submit"
                  type="default"
                  loading={this.state.isClickFilter && fetchingProps.fetching}
              >
                <span className="icon-search icon-padding-right text-uppercase"></span>
                <this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  handleSubmitFilter = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = new URLSearchParams(document.location.search);

        if (values.search) {
          params.set("search", values.search);
        } else {
          params.delete("search");
        }

        if (values.dates && values.dates.length) {
          params.set("start", moment(values.dates[0]).format("YYYY-MM-DD"));
          params.set("end", moment(values.dates[1]).format("YYYY-MM-DD"));
        } else {
          params.delete("start");
          params.delete("end");
        }
        this.Util.pushParamsToURL(this.pathname, params.toString());
        this.fetchList();
        this.setState({ isClickFilter: true });
      }
    });
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

    return (
      <React.Fragment>
        <Row gutter={16} style={{marginTop: 15, marginBottom: 15}}>
          <Col span={8}>
            <Card>
              <Statistic
                  title={<this.Translate id="text_income"/>}
                  value={summaryData.income ? summaryData.income : 0 }
                  precision={2}
                  valueStyle={{ color: "#3f8600" }}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card>
              <Statistic
                  title={<this.Translate id="text_expense"/>}
                  value={summaryData.expense ? summaryData.expense : 0 }
                  precision={2}
                  valueStyle={{ color: "#cf1322" }}
              />
            </Card>
          </Col>
        </Row>
        <div className="content-list">
          <div style={{height: "100%"}}>
            <div className="table-wrapper">
              {this.renderFilterRecord()}
            </div>
          </div>
        </div>
        <div className="content-list">
          <div style={{height: "100%"}}>
            <div className="table-wrapper">
              <this.Button
                  type="info"
                  id="btnAdd"
                  className="mg-right text-uppercase"
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
                  className="text-uppercase"
                  disabled={this.state.isRequestDelete}
                  onClick={this.showDeleteModal}>
                <span className="icon-delete icon-padding-right"></span>
                <this.Translate id="text_delete" />
              </this.Button>

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