import React from "react";
import moment from "moment";
import {Col, DatePicker, Icon, Input, Pagination, Row} from "antd";
import Component from "../../../../common/components/Component";
import "./index.css";
import Enum from "../../../enums";
import history from "../../../../common/router/history";
import PurchaseAction from "../../../actions/stock/purchaseOrder";
import PurchaseService from "../../../services/stock/PurchaseOrderService";
import Permission from "../../../../pos/components/settings/RoleAccess/permission";
import PrivilegeService from "../../../../pos/services/settings/PrivilegeService";
import NoPermissionV2 from "../../../../common/components/shares/List/NoPermissionV2";

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
      permissions: {},
      modalVisible: false,
      loading: false,
      deleting: false,
      isHasAccessPermission: null
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
        title: <this.Translate id="text_location" />,
        dataIndex: "location",
        key: "location",
        render: location => location ? location.name: this.emptyText
      },
      {
        title: <this.Translate id="text_supplier" />,
        dataIndex: "supplier",
        key: "supplierId",
        render: supplier => supplier ? supplier.name : this.emptyText
      },
      {
        title: <this.Translate id="text_receiver"/>,
        dataIndex: "receiver",
        key: "receiverId",
        render: receiver => receiver ? <span style={{textTransform: "uppercase"}}>{receiver.fullName}</span> : this.emptyText
      },
      {
        title: <this.Translate id="text_total" />,
        dataIndex: "requestTotal",
        key: "requestTotal",
        align: "right",
        render: (text, record) => {
          let key = "requestTotal";
          if (record.step === Enum.PO_STEP.RECEIVED) {
            key = "receiveTotal";
          } else if (record.step === Enum.PO_STEP.RETURN) {
            key = "returnTotal";
          }
          return this.formatCurrency(record[key]);
        }
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "step",
        key: "step",
        width: 100,
        render: step => step in this.PO_STEP_STR ? <this.Tag color={this.PO_STEP_STR[step].color} className="text-uppercase text-center po-step-tag">{this.PO_STEP_STR[step].name}</this.Tag> : ""
      }
    ];
    this.fetchingProp = "purchaseOrder";
    this.service = PurchaseService;
    this.title = <this.Translate id="text_sales"/>;
    this.fetchingProp = "list";
    this.pageSize = 50;
    this.pathname = "/stock/purchase/order";
    this.pathCreate= "/stocks/purchase/create";
    this.pathUpdate= "/stocks/purchase/update";
    this.permissionModuleCode = "purchase_order";
    this.PO_STEP_STR = {
      [Enum.PO_STEP.DRAFT]: {name: <this.Translate id="text_draft" />, color: this.Enum.PO_STEP_COLOR.DRAFT},
      [Enum.PO_STEP.PROCESS]: {name: <this.Translate id="text_process" />, color:  this.Enum.PO_STEP_COLOR.PROCESS},
      [Enum.PO_STEP.RECEIVED]: {name: <this.Translate id="text_received" />, color:  this.Enum.PO_STEP_COLOR.RECEIVE},
      [Enum.PO_STEP.CANCEL]: {name: <this.Translate id="text_cancel" />, color:  this.Enum.PO_STEP_COLOR.CANCEL},
      [Enum.PO_STEP.RETURN]: {name: <this.Translate id="text_returned" />, color:  this.Enum.PO_STEP_COLOR.RETURN},
      [Enum.PO_STEP.PAID]: {name: <this.Translate id="purchase_order_step_paid" />, color:  this.Enum.PO_STEP_COLOR.PAID}
    };
    this.columnFilterWithKey = ["name", "number", "invoiceNo", "shippingFee", "requestTotal", "returnTotal", "receiveTotal"];
    this.action = PurchaseAction;
  }

  componentDidMount() {
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      this.pageSize = parseInt(params.get("limit"));
    }

    if (params.get("offset")) {
      this.setState({current: parseInt(params.get("offset"))});
    }

    this.getPermission();
    this.fetchList(true);

  }

  getPermission(){
    PrivilegeService.checkPermission(this.permissionModuleCode, "view")
        .then(({data}) => this.setState({isHasAccessPermission: data}))
        .catch(() => this.setState({isHasAccessPermission: false}));
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

    if (params.get("date")) {
      ranges = JSON.stringify({column: "invoiceDate", value: [params.get("date"), params.get("date")]});
    }else{
      params.delete("date");
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

  getAllPermissionsByModule(){
    const permissionModule = Permission.find(item => item.code === this.permissionModuleCode);

    if (permissionModule && permissionModule.permissions && permissionModule.permissions.length){

      const promises = [];
      const permissions = {};

      permissionModule.permissions.forEach((permission) => {
        promises.push(PrivilegeService.checkPermission(this.permissionModuleCode, permission.code));
      });

      Promise.allSettled(promises).then((response) =>{
        permissionModule.permissions.forEach(function (permission, index) {
          const {status, value} = response[index];
          if (status === "fulfilled"){
            permissions[permission.code] = value.data;
          }
        });
        this.setState({permissions});
      });
    }
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

  handleChangeDate = (date) => {
    const queryParams = new URLSearchParams(document.location.search);
    queryParams.set("date", date ? moment(date).format("YYYY-MM-DD") : "");
    history.push({pathname: this.pathname, search: queryParams.toString()});
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
          this.Message.error(this.CATranslate("error_warning_delete_po", this.props.locale));
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
    const {permissions} = this.state;

    return (
        <React.Fragment>
          {this.Util.isNotCheckingPermissionV2(this.state.isHasAccessPermission) &&
          (this.state.isHasAccessPermission ?
            <React.Fragment>
              <div className="content-list">
                <div style={{height: "100%"}}>
                  <div className="table-wrapper">
                    <Row>
                      <Col span={6} style={{marginBottom: 0}}>
                        <h3 style={{marginBottom: 0, fontWeight: 600}}><this.Translate id="text_purchase_order" /></h3>
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
                          onDoubleClick:() => permissions.edit && history.push({pathname: this.pathUpdate+"/"+record.id})
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
            :
            <NoPermissionV2/>
          )
          }
        </React.Fragment>
    );
  }

}