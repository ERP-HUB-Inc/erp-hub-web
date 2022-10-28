import React from "react";
import {
  isMobile,
  isMobileOnly
} from "react-device-detect";
import {Pagination} from "antd";
import Component  from "../../Component";
import menuSource from "../../layout/SiderBar/datasource";
import BaseService from "../../../services/BaseService";
import PrivilegeAction from "../../../../pos/action/settings/privilege";
import PrivilegeService from "../../../../pos/services/settings/PrivilegeService";

export default class DataTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {
        datas: [],
        pagination: {
          total: 0,
          offset: 0,
          limit: 50
        }
      },
      current: 1,
      selectedRowKeys: [],
      selectedListIds: [],
      selectedRows: [],
      loading: true,
      modalVisible: false,
      deleting: false,
      isClickFilter: false,
      modalSource: {},
      modalContent: null,
      columns: [],
      loadingPopup: false,
      isRequestDelete: false,
      isRequestAdd: false,
      isShowFilter: !isMobileOnly //default show filter on difference from mobile
    };

    this.rowSelection = true;

    this.modalRef = React.createRef();
    this.columns = [];
    this.filter = [];
    this.module = ""; // This compare to parent key in datasource in sidebar when render breadcrump
    this.fetchingProp = "list"; // prop of reducer of fetching record that get from map state to prop from container
    this.addingProp = "add"; // prop of reducer of adding record that get from map state to prop from container
    this.updatingProp = "update"; // prop of reducer of adding record that get from map state to prop from container

    this.localStorageKey = null; // key of localstorage in case you want to store it as caching

    this.pageSize = 50; // default limit record display in table list
    this.confirmTextDelete = <this.Translate id="text_confirm_delete" />;
    this.requiredMessage = "Please input all required field."; // require message display on modal popup
    this.generalSearchLabel = "text_search";
    this.confirmTitle = "COMPLETED";
    this.okText = <this.Translate id="text_yes" />; // text button on alert of delete action
    this.cancelText = <this.Translate id="text_no" />; // text button on alert of delete action
    this.messageSuccess = "Success"; // message display after delete action
    this.placeHolderForGeneralSearch = "text_general";
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
    this.formUpdate = () => <div />;
    this.callBackOnShowEditForm = null;

    this.tapedTwice = false;
    this.isMobile = isMobile;
    this.isMobileOnly = isMobileOnly;

    this.onChange = this.onChange.bind(this); // handle when user change filter, access pagination
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.buttonActionCollection = this.buttonActionCollection.bind(this);
    this.handleShowFormAdd = this.handleShowFormAdd.bind(this);
    this.handleOnToggleFilter = this.handleOnToggleFilter.bind(this);
    this.RESET_CONSTANT = "RESET";
  }

  componentDidMount() {
    this.fetchData();
  }

  /**===================================================================SHARE FUNCTION FOR CHILD CLASS============================================================**/

  fetchData = () => {
    this.service.lists(this.pageSize, (this.state.current - 1) * this.pageSize)
    .then(response => {
      if (response && response.data) {
        this.setState({data: response.data});
      }
    })
    .finally(() => this.setState({loading: false}));
  }
  
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
      selectedRowKeys,
      selectedRows
    });
  }

  /**
   * just handle for show create form only
   * it will overide in child class
   */

  handleShowFormAdd() {
    if (this.action && this.formCreate) {
      this.props.dispatch(this.action.showForm());
      this.setState({
        modalContent: this.formCreate,
        loadingPopup: false
      });
    }
  }

  /**
   * just handle for show user click on single row and display form edit
   * it will overide in child class
   */
  handleShowFormEdit(rowData) {
    if (this.action) {
      this.props.dispatch(this.action.showForm(rowData));
      this.setState({
        modalContent: this.formUpdate
      });
    }
  }

  /**
   * handle delete multi record
   * it will overide in child class
   */
  handleConfirm() {
    this.setState({isRequestDelete: true});

    if (this.state.selectedRowKeys.length > 0) {
      this.setState({
        modalVisible: true,
        isRequestDelete: false
      });
    } else {
      this.setState({isRequestDelete: false});
      this.Message.warning(this.CATranslate("text_warning_select_row_to_delete", this.props.locale));
    }
  }

  /**
   * handle procedd delete
  */
  handleDelete() {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.fetchData();
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
        }
      });
    }
  }

  handleOnToggleFilter() {
    if (this.state.isShowFilter) {
      this.setState({isShowFilter: false});
    } else {
      this.setState({isShowFilter: true});
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
      render: value => this.Util.formatDate(value, "DD/MM/YYYY")
    };
    this.columnUpdatedAt = {
      title: <this.Translate id="text_updated_at" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 180,
      render: value => this.Util.formatDate(value, "DD/MM/YYYY"),
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
            <this.Link to="#">{menuSource[this.module]["title"]}</this.Link>
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
        disabled={this.state.loadingPopup || this.props[this.fetchingProp].fetching}
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

  renderOtherAction(){}


  buttonActionCollection() {
    return [
      this.renderButtonAddNew(),
      this.renderButtonDelete(),
      this.renderOtherAction()
    ];
  }
  /**
   * MAP ALL BUTTON ACTION FOR THE LIST
   */
  renderActionButton() {
    return this.buttonActionCollection().map((buttonAction, buttonActionIndex) => <span key={buttonActionIndex}>{buttonAction}</span>);
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
          label={<this.Translate id={this.generalSearchLabel}/>}
          placeholder={this.CATranslate(this.placeHolderForGeneralSearch, this.props.locale)}
          form={this.props.form}
          allowClear={true} />
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
    this.handleShowFormEdit(record);
  }


  /**
   * render datatale
   */
  renderTable = () => {
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
      <this.Table
          bordered={true}
          rowSelection={this.rowSelection ? rowSelection : null}
          dataSource={this.state.data.data}
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          onRow={record =>({
            onDoubleClick:() => this.handleShowFormEdit(record),
            onClick: (event) => this.handleOnTapHandler(event, record)
          })}
          loading={this.state.loading} />
    );
  }

  /**statusList
   * include from render table to be as the list
   * @param {*} fetchingProps 
   */
  renderPagination(classsName = "float-right") {
    let pagination = {
      total: this.state.data.pagination.total,
      pageSize: this.state.data.pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className={classsName}>
          <Pagination size="small" showTotal={showTotal} showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
        </div>
        :
        ""
    );
  }

  renderTableList() {
    return (
      <div className="table-wrapper">

        {
          this.isMobileOnly ?
            <div className="wrap-button-action">
              <div className="action-button-left">
                {this.renderActionButton()}
              </div>
              <div className="action-button-right">
                <this.Button
                  type="info"
                  disabled={this.state.loadingPopup}
                  onClick={this.handleOnToggleFilter}>
                  <span className="anticon anticon-filter"></span>
                </this.Button>
              </div>
            </div>
            :
            this.renderActionButton()
        }

        {
          this.isMobileOnly ?
            ""
            :
            this.renderPagination()
        }

        <this.clearFloating/>        

        {this.renderTable()}

        {
          this.isMobileOnly ?
            ""
            :
            <div style={{marginTop: 15}}>
              {this.renderPagination()}
            </div>
        }

        {
          this.isMobileOnly ?
            this.renderPagination("text-center mobile-pagination")
            :
            ""
        }

        <this.clearFloating/>

      </div>
    );
  }

  /**===================================================================#LAYOUT CONTROL FOR CHILD CLASS============================================================**/

  /**
   * bind all function and layout above to be display
   */
  render() {
    
    return (
      
      <div className="content-list">

        {
          this.renderBreadCrumb()
        }
        
        {
          <div style={{height: "100%"}}>
          { this.renderTableList() }

          { this.state.modalContent }
      
          { this.renderModalConfirmDelete() }
          </div>    
        }
      </div>
      
    );
  }
}

