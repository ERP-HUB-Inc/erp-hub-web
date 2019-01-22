import React from "react";
import {
  isMobile
} from "react-device-detect";
import {Pagination} from "antd";
import NoPermission from "./NoPermission";
import StartUp from "../../StartUp";
import Component  from "../../Component";
import menuSource from "../../layout/SiderBar/datasource";
import BaseService from "../../../services/BaseService";
import PrivilegeAction from "../../../../pos/action/settings/privilege";
import PrivilegeService from "../../../../pos/services/settings/PrivilegeService";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      selectedRowKeys: [],
      selectedListIds: [],
      modalVisible: false,
      deleting: false,
      isClickFilter: false,
      modalSource: {},
      ListRoles: null,
      modalConten: null, // the content that show in modal content,
      modalContent1: null,
      columns: [],
      showExport : true,
      loadingPopup: false,
      isRequestDelete: false,
      isRequestAdd: false
    };

    this.rowSelection = true;
    this.showExport = false;
    this.ExportheadersCsv = [];
    this.exportCsvFileName = "filename.csv";

    this.columns = [];
    this.filter = [];
    this.module = ""; // This compare to parent key in datasource in sidebar when render breadcrump
    this.fetchingProp = "list"; // prop of reducer of fetching record that get from map state to prop from container
    this.addingProp = "add"; // prop of reducer of adding record that get from map state to prop from container
    this.updatingProp = "update"; // prop of reducer of adding record that get from map state to prop from container

    this.pageSize = 20; // default limit record display in table list
    this.confirmTextDelete = <this.Translate id="text_confirm_delete" />;
    this.requiredMessage = "Please input all required field."; // require message display on modal popup
    this.confirmTitle = "COMPLETED";
    this.okText = <this.Translate id="text_yes" />; // text button on alert of delete action
    this.cancelText = <this.Translate id="text_no" />; // text button on alert of delete action
    this.messageSuccess = "Success"; // message display after delete action
    this.messageNoPermissionKey = "text_no_permission";
    this.placeHolderForGeneralSearch = "place_holder_general_search";
    this.isShowExpandable = false;
    this.rowClassName = record => record ? "" : "";
    this.emptyCell = "N/A";
    this.columnFilterWithKey = [];
    this.service = new BaseService();
    this.action = null;
    this.PrivilegeService = PrivilegeService;
    this.PrivilegeAction = PrivilegeAction;
    this.initializeDefaultColumn();
    this.pageSizeOptions = ["20", "50", "80", "100"];
    this.columnNo = {};

    //FOR PERMISSION CHECKING OPERATION
    this.formCreate = null;
    this.formUpdate = null;
    this.callBackOnShowEditForm = null;

    this.tapedTwice = false;
    this.isMobile = isMobile;

    this.onChange = this.onChange.bind(this); // handle when user change filter, access pagination
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.expandedRender = this.expandedRender.bind(this);
    this.buttonActionCollection = this.buttonActionCollection.bind(this);
    this.handleShowFormAdd = this.handleShowFormAdd.bind(this);

    this.RESET_CONSTANT = "RESET";
  }

  /**===================================================================SHARE FUNCTION FOR CHILD CLASS============================================================**/

  formatDate(value) {
    const setting = this.Util.getSetting();
    return this.Util.formatDate(value, setting.dateFormat);
  }

  /**
   * handle for tranform from ant sorting string to match with api
   * api doesn't reconize descend or ascend just know only desc and asc
   * @param {*} order 
   */
  sortOrder(order) {
    if (order === "descend") {
      return "DESC";
    } else {
      return "ASC";
    }
  }

  /**
  * convert to array object to collection id of record for multiple delete ex: [1, 2, 3]
  * @param {*} values 
  */
  mapSelectedListIds(values) {
    return values.map(value => value.id);
  }

  /**===================================================================#SHARE FUNCTION FOR CHILD CLASS============================================================**/

  /**===================================================================EVENT CONTROL FOR CHILD CLASS============================================================**/
  componentDidMount() {
    this.props.dispatch(PrivilegeAction.reset());
    if (this.service.listRoute) {
      this.props.dispatch(PrivilegeAction.checkPermission(this.service.listRoute));
    }
    if (this.action) {
      this.props.dispatch(this.action.fetch(this.pageSize));
    }
  }

  /**
   * when user change sort in each column
   * @param {*} pagination 
   * @param {*} filters 
   * @param {*} sorter 
   */
  onChange(pagination, filters, sorter) {
    if (this.action != null) {
      const { dispatch } = this.props;
      this.filter = [
        this.pageSize,
        (pagination.current - 1) * this.pageSize,
        sorter.field,
        this.sortOrder(sorter.order)
      ];
      dispatch(this.action.fetch(...this.filter));
      this.setState({isClickFilter: false});
    }
  }

  /**
   * when user change pagination
   * @param {*} current: current page number of pagination 
   * @param {*} pageSize 
   */
  onChangePagination(current, pageSize) {
    if (this.action != null) {
      this.filter = [
        pageSize,
        (current - 1) * pageSize,
      ];
      this.props.dispatch(this.action.fetch(...this.filter));
      this.setState({current, isClickFilter: false});
    }
  }

  /**
   * when user change size of row
   * @param {*} current 
   * @param {*} pageSize 
   */
  onShowSizeChange(current, pageSize) {
    if (this.action) {
      this.filter = [
        pageSize,
        (current - 1) * pageSize,
      ];
      this.props.dispatch(this.action.fetch(...this.filter));
      this.setState({current, isClickFilter: false});
    }
  }

  /**
   * when user select check box
   * @param {*} selectedRowKeys 
   * @param {*} selectedRows 
   */
  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys
    });
  }

  /**
   * just handle for show create form only
   * it will overide in child class
   */

  handleShowFormAdd() {
    if (this.action && this.formCreate) {
      this.setState({
        loadingPopup: true
      });
      this.PrivilegeService.checkPermission(this.service.createRoute)
        .then(response => {
          this.props.dispatch(this.action.showForm());
          this.setState({
            modalConten: this.formCreate,
            loadingPopup: false
          });
        })
        .catch(error => {
          this.Message.warning(this.CATranslate(this.messageNoPermissionKey, this.props.locale));
          this.setState({loadingPopup: false});
        });
    }
  }

  /**
   * just handle for show user click on single row and display form edit
   * it will overide in child class
   */
  handleShowFormEdit(rowData) {
    if (this.checkIsAllowEditRecordOrNot(rowData)) {
      return;
    }

    if (this.action) {
      this.setState({loadingPopup: true});

      this.PrivilegeService.checkPermission(this.service.updateRoute)
        .then(response => {
          if (this.callBackOnShowEditForm) {
            this.callBackOnShowEditForm(rowData);
          } else {
            this.props.dispatch(this.action.showForm(rowData));
            this.setState({
              modalConten: this.formUpdate
            });
          }
          this.setState({loadingPopup: false});
        })
        .catch(error => {
          this.setState({
            loadingPopup: false
          });
          this.Message.warning(this.CATranslate(this.messageNoPermissionKey, this.props.locale));
        });
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

  checkIsAllowDeleteRecordOrNot() {
    if (this.state.selectedListIds &&
      this.state.selectedListIds.length > 0 &&
      this.props[this.fetchingProp]
    ) {
      let isHasDefaultRecord = false;
      this.state.selectedListIds.forEach(selectedId => {
        const result = this.props[this.fetchingProp].list.find(record => record.id === selectedId);

        if (result && result.isDefault === this.Enum.IS_DEFAULT) {
          isHasDefaultRecord = true;
          this.Message.warning(this.CATranslate("text_warning_delete_default_record", this.props.locale));
        }
      });
      return isHasDefaultRecord;
    }
  }

  /**
   * handle delete multi record
   * it will overide in child class
   */
  handleConfirm() {
    if (this.checkIsAllowDeleteRecordOrNot()) {
      return;
    }

    this.setState({isRequestDelete: true});

    this.PrivilegeService.checkPermission(this.service.archiveRoute)
      .then(response => {
        if (this.state.selectedRowKeys.length > 0) {
          this.setState({
            modalVisible: true,
            isRequestDelete: false
          });
        } else {
          this.setState({isRequestDelete: false});
          this.Message.warning(this.CATranslate("text_warning_select_row_to_delete", this.props.locale));
        }
      })
      .catch(error => {
        this.setState({isRequestDelete: false});
        this.Message.warning(this.CATranslate(this.messageNoPermissionKey, this.props.locale));
      });
  }

  /**
   * handle procedd delete
  */
  handleDelete() {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(response => {
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
          this.setState({
            selectedRowKeys: [],
            modalVisible: false,
            deleting: false
          });
        })
        .catch(err => {
          this.setState({deleting: false});
        });
    }
  }

  /**
   * 
   * @param {*} dataRow data from each row of table
   */
  handleShowRecordDetail(dataRow) {

  }

  /**
   * handle cancel confirm delete
  */
  handleCancel() {
    this.setState({
      modalVisible: false
    });
  }

  /**
   * handle when user want to filter record
   */
  handleSubmitFilter(e) {
    if (this.action) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          let filter = {};
          if (values.status != null) {
            const status = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
            filter["status"] = status;
          }

          filter = JSON.stringify(filter);

          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey));
          this.setState({isClickFilter: true});
        }
      });
    }
  }

  /**===================================================================#EVENT CONTROL FOR CHILD CLASS============================================================**/

  /**===================================================================LAYOUT CONTROL FOR CHILD CLASS============================================================**/
  
  initializeDefaultColumn() {
    this.columnStatus = {
      title: <this.Translate id="text_status" />,
      dataIndex: "status",
      key: "status",
      width: 120,
      render: value => {
        return (
          value === 1 ?
            <this.Badge status="success" text={<this.Translate id="select_text_active" />} />
            :
            <this.Badge status="error" text={<this.Translate id="select_text_deactive" />} />
        );
      },
      sorter: true
    };

    this.columnStatusExtend = {
      dataIndex: "status",
      key: "status",
      width: 100,
      render: value => {
        return (
          value === 1 ?
            <this.Badge text={<this.Translate id="select_text_active" />} status="success" />
            :
            <this.Badge text={<this.Translate id="select_text_deactive"/>} status="error" />
        );
      }
    };

    this.columnCreatedAt = {
      title: <this.Translate id="text_date" />,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: value => this.formatDate(value),
      sorter: true
    };
    this.columnUpdatedAt = {
      title: <this.Translate id="text_updated_at" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: value => this.formatDate(value),
      sorter: true
    };
    this.statusList = [
      {name: <this.Translate id="select_text_active"/>, value: this.Enum.ACTIVE},
      {name: <this.Translate id="select_text_deactive"/>, value: this.Enum.DEACTIVE},
      {name: <this.Translate id="select_text_all_status"/>, value: this.Enum.ALL_STATE}
    ];
  }
  renderBreadCrumb() {
    // get current path of breadcrum compare with url
    const currentPath = window.location.pathname;
    return (
      <div className="breadcrumb">
        <ul className="list-unstyled">
          <li>
            <this.Link to="/"><span className="icon-home"></span></this.Link>
          </li>
          <li className="fast-nav text-uppercase">
            <this.Link to="#">{this.module}</this.Link>
          </li>
          {
            menuSource[this.module]["subItems"].map((value, index) =>
              "isFashNav" in value && value["isFashNav"] ? 
                <li className={(currentPath === value["route"] ? "active" : "") + " fast-nav"} key={index}>
                  <this.Link to={value["route"]}>{value["title"]}</this.Link>
                </li>
                :
                ""
            )
          }
        </ul>
      </div>
    );
  }

  renderMiniBreadCrumb() {
    // get current path of breadcrum compare with url
    const currentPath = window.location.pathname;
    return (
      <div className="breadcrumb">
        <ul className="list-unstyled">
          <li>
            <this.Link to="/"><span className="icon-home"></span></this.Link>
          </li>
          {
            menuSource[this.module]["subItems"].map((value, index) =>
              currentPath === value["route"] ? 
                <li className="fast-nav text-uppercase" key={index}>
                  <this.Link to={value["route"]}>{value["title"]}</this.Link>
                </li>
                :
                ""
            )
          }
        </ul>
      </div>
    );
  }

  renderButtonAddNew() {
    return (
      <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        disabled={this.state.loadingPopup}
        onClick={this.handleShowFormAdd}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>
    );
  }

  renderButtonDelete() {
    return (
      <this.Button
        type="danger"
        className="text-uppercase"
        disabled={this.state.isRequestDelete}
        onClick={this.handleConfirm}>
        <span className="icon-delete icon-padding-right"></span>
        <this.Translate id="text_delete" />
      </this.Button>
    );
  }

  renderButtonExportCSV() {
    return (
      <this.CSVLink
        filename={this.exportCsvFileName}
        data={this.exportCsv()}
        headers={this.ExportheadersCsv !==null ? this.ExportheadersCsv : this.columns }>
        <this.Button type="info" disabled={this.exportCsv().length > 0 ? false : true }>
          <span className="icon-export icon-padding-right"></span>
          <this.Translate id="text_export_csv" />
        </this.Button>
      </this.CSVLink>
    );
  }


  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      this.renderButtonDelete()
    ];
  }
  /**
   * MAP ALL BUTTON ACTION FOR THE LIST
   */
  renderActionButton() {
    return this.buttonActionCollection().map((buttonAction, buttonActionIndex) => <span key={buttonActionIndex}>{buttonAction}</span>);
  }

  exportCsv(){
    const fetchingProps = this.props[this.fetchingProp];
    return  fetchingProps.list;
  }

  /**
   * modal alert to confirm delete
   */
  renderModalConfirmDelete() {
    return (
      <this.Modal
        visible={this.state.modalVisible}
        wrapClassName="confirm-delete"
        footer={null}>
        <div>
          <span className="icon-help icon-padding-right"></span>
          <span className="title">{this.confirmTitle}</span><br/>
          <span>{this.confirmTextDelete}</span>
        </div>
        <div className="ant-modal-footer">
          <this.Button className="danger text-uppercase" onClick={this.handleCancel}>
            <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_cancel"/>
          </this.Button>
          <this.Button onClick={this.handleDelete} loading={this.state.deleting} className="info text-uppercase">
            <span className="icon-checked icon-padding-right"></span><this.Translate id="text_yes"/>
          </this.Button>
        </div>
      </this.Modal>
    );
  }


  renderFilterGeneralKey() {
    return (
      <this.Col md="3">
        <this.InputText
          name="key"
          label={<this.Translate id="text_search" />}
          placeholder={this.CATranslate(this.placeHolderForGeneralSearch, this.props.locale)}
          form={this.props.form}/>
      </this.Col>
    );
  }

  renderFilterStatus() {
    return (
      <this.Col md="2">
        <this.Select
          name="status"
          label={<this.Translate id="text_status" />}
          dataSource={this.statusList}
          defaultValue={this.Enum.ALL_STATE}
          form={this.props.form}/>
      </this.Col>);
  }
  /**
   * render layout filter on the top of list
   */
  renderFilterRecord() {
    const {form} = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return (
      form == null ?
        ""
        :
        <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            {this.renderFilterGeneralKey()}
            {this.renderFilterStatus()}
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title="">Filter</label>
              </div>
              <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  /**
   * render sub table of the list
   */
  expandedRender(){}

  handleOnTapHandler(event, record) {

    if (!this.isMobile) {
      return;
    }

    if(!this.tapedTwice) {
      this.tapedTwice = true;
      setTimeout( () => { this.tapedTwice = false; }, 300 );
      return false;
    }
    event.preventDefault();
    //action on double tap goes below
    this.handleShowFormEdit(record);
  }


  /**
   * render datatale
   */
  renderTable(fetchingProps) {
    // handle for change select checkbox on table row
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        // disabled: "isSystem" in record && record["isSystem"] ? true : false, // Column configuration not to be checked
        name: record.name,
      })
    };
    
    return (
      this.isShowExpandable ?
        <this.TableExpand
          dataSource={fetchingProps.list}
          columns={this.columns}
          rowClassName={this.rowClassName}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          expandedRowRender={this.expandedRender}
          onRow={record =>({
            onDoubleClick:() => this.handleShowFormEdit(record),
            onClick: () => this.handleOnTapHandler(record)
          })}
          rowSelection={rowSelection}
          loading={fetchingProps.fetching || this.state.loadingPopup} />
        :
        <this.Table 
          rowSelection={this.rowSelection ? rowSelection : null}
          dataSource={fetchingProps.list}
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          onRow={record =>({
            onDoubleClick:() => this.handleShowFormEdit(record),
            onClick: (event) => this.handleOnTapHandler(event, record)
          })}
          loading={fetchingProps.fetching || this.state.loadingPopup} />
    );
  }

  /**statusList
   * include from render table to be as the list
   * @param {*} fetchingProps 
   */
  renderPagination(fetchingProps) {
    let pagination = {
      total: fetchingProps.pagination.total,
      pageSize: fetchingProps.pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };
    return( 
      pagination.total > 0 ?
        <div className="float-right">
          <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
        </div>
        :
        ""
    );
  }

  renderTableList(fetchingProps) {
    return (
      <div className="table-wrapper">

        {this.renderActionButton()}

        {this.renderPagination(fetchingProps)}

        <this.clearFloating/>        

        {this.renderTable(fetchingProps)}

      </div>
    );
  }

  /**===================================================================#LAYOUT CONTROL FOR CHILD CLASS============================================================**/

  /**
   * bind all function and layout above to be display
   */
  render() {

    let fetchingProps = this.props[this.fetchingProp];
    
    // Here is repsonse from add action and combinde response data to the list.
    if (this.addingProp) {
      const addingProps = this.props[this.addingProp];
      if (addingProps && addingProps.response) {
        if (addingProps.response.data) {
          fetchingProps.list = [addingProps.response.data, ...fetchingProps.list];
        }
        this.props.dispatch({type: this.RESET_CONSTANT});
      }
    }

    // Here is repsonse from updating action and update response data to the list.
    if (this.updatingProp) {
      const updatingProps = this.props[this.updatingProp];
      if (updatingProps && updatingProps.response) {
        if (updatingProps.response.data) {
          const updateIndex = this.Util.findArrayIndex(fetchingProps.list, "id", updatingProps.response.data.id);
          fetchingProps.list.splice(updateIndex, 1, updatingProps.response.data);
        }
        this.props.dispatch({type: this.RESET_CONSTANT});
      }
    }
    
    return (
      
      <div className="content-list">

        {
          this.isMobile ?
            this.renderMiniBreadCrumb()
            :
            this.renderBreadCrumb()
        }
        
        {
          this.Util.isCheckingPermission(this.props) ?
            <StartUp/>
            :
            this.Util.isNoPermissionProp(this.props) ?
              <NoPermission />
              :
              <div style={{height: "100%"}}>
                <div className="wrap-filter">
                  { this.renderFilterRecord() }
                </div>

                { this.renderTableList(fetchingProps) }
        
                { this.state.modalContent1 }

                { this.state.modalConten }
            
                { this.renderModalConfirmDelete() }
              </div>
        }
      </div>
      
    );
  }
}

