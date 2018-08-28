import React from "react";
import {Pagination} from "antd";
import Component  from "../../Component";
import ConstantAuth from "../../../constants/authentication";
import menuSource from "../../layout/SiderBar/datasource";
import "./index.css";

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
      columns: []
    };

    // this.hideActionButton = false;
    
    //access role
    this.showListRoles = "";
    this.layout = "";

    this.columns = [];
    this.filter = [];
    this.module = ""; // This compare to parent key in datasource in sidebar when render breadcrump
    this.fetchingProp = ""; // prop of reducer of fetching record that get from map state to prop from container
    this.addingProp = ""; // prop of reducer of adding record that get from map state to prop from container
    this.updatingProp = ""; // prop of reducer of adding record that get from map state to prop from container

    this.pageSize = 10; // default limit record display in table list
    this.confirmTextDelete = "Are you sure delete this record?";
    this.requiredMessage = "Please input all required field."; // require message display on modal popup
    this.confirmTitle = "COMPLETED";
    this.okText = "Yes"; // text button on alert of delete action
    this.cancelText = "No"; // text button on alert of delete action
    this.messageSuccess = "Success"; // message display after delete action
    this.isShowExpandable = false;

    this.columnNo = {};
    
    this.columnStatus = {
      title: <this.Translate id="text_status" />,
      dataIndex: "status",
      key: "status",
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
      title: <this.Translate id="text_created_at" />,
      dataIndex: "createdAt",
      key: "createdAt",
      width: 200,
      render: value => this.formatDate(value),
      sorter: true
    };
    this.columnUpdatedAt = {
      title: <this.Translate id="text_updated_at" />,
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: value => this.formatDate(value),
      sorter: true
    };
    this.statusList = [
      {name: <this.Translate id="select_text_active"/>, value: this.Enum.ACTIVE},
      {name: <this.Translate id="select_text_deactive"/>, value: this.Enum.DEACTIVE},
      {name: <this.Translate id="select_text_all_status"/>, value: this.Enum.ALL_STATE}
    ];

    this.columnFilterWithKey = [];

    this.service = null;
    this.action = null;

    this.onChange = this.onChange.bind(this); // handle when user change filter, access pagination
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handleSubmitFilter = this.handleSubmitFilter.bind(this);
    this.renderTable = this.renderTable.bind(this);
    this.expandedRender = this.expandedRender.bind(this);

    this.RESET_CONSTANT = "RESET";
  }

  /**===================================================================SHARE FUNCTION FOR CHILD CLASS============================================================**/

  formatDate(value) {
    const setting = this.Util.getSetting(ConstantAuth.ACCESS_TOKEN);
    return this.Util.formatDate(value, setting.dateFormat);
  }
 
  formatCurrency(value) {
    const setting = this.Util.getSetting(ConstantAuth.ACCESS_TOKEN);
    return this.Util.formatCurrency(value, setting.currency, setting.currencyPosition);
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
    if (this.action != null) {
      const {dispatch} = this.props;
      dispatch(this.action.fetch(this.pageSize));
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
      const { dispatch } = this.props;
      this.filter = [
        pageSize,
        (current - 1) * pageSize,
      ];
      dispatch(this.action.fetch(...this.filter));
      this.setState({current, isClickFilter: false});
    }
  }

  /**
   * when user change size of row
   * @param {*} current 
   * @param {*} pageSize 
   */
  onShowSizeChange(current, pageSize) {
    if (this.action != null) {
      const {dispatch} = this.props;
      this.filter = [
        pageSize,
        (current - 1) * pageSize,
      ];
      dispatch(this.action.fetch(...this.filter));
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
  handleShowFormAdd() {}

  /**
   * just handle for show user click on single row and display form edit
   * it will overide in child class
   */
  handleShowFormEdit(modalSource) {
    this.setState({
      modalSource
    });
  }

  /**
   * 
   * @param {*} dataRow data from each row of table
   */
  handleShowRecordDetail(dataRow) {

  }

  /**
   * handle delete multi record
   * it will overide in child class
   */
  handleConfirm() {
    if (this.state.selectedRowKeys.length > 0) {
      this.setState({modalVisible: true});
    }
  }

  /**
   * handle cancel confirm delete
  */
  handleCancel() {
    this.setState({modalVisible: false});
  }

  /**
   * handle procedd delete
  */
  handleDelete() {
    if (this.service != null) {
      const { dispatch } = this.props;
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(response => {
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
          this.setState({
            selectedRowKeys: [],
            modalVisible: false,
            deleting: false
          });
          this.Message.info(this.messageSuccess);
        })
        .catch(err => {
          this.setState({deleting: false});
        });
    }
  }

  /**
   * handle when user want to filter record
   */
  handleSubmitFilter(e) {
    if (this.action != null) {
      e.preventDefault();
      this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const {dispatch} = this.props;
          const status = values.status === this.Enum.ALL_STATE ? [this.Enum.ACTIVE, this.Enum.DEACTIVE] : [values.status];
          const filter = JSON.stringify({status});
          const searchKey = JSON.stringify({column: this.columnFilterWithKey, value: values.key});
          console.log("searchKey",filter,searchKey);
          dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize, "", "", filter, searchKey));
          this.setState({isClickFilter: true});
        }
      });
    }
  }

  /**===================================================================#EVENT CONTROL FOR CHILD CLASS============================================================**/

  /**===================================================================LAYOUT CONTROL FOR CHILD CLASS============================================================**/
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
            <this.Link to="/">{this.module}</this.Link>
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

  renderActionButton() {
    return (
      <div className="float-left">
        <this.Button type="info" className="mg-right" onClick={() => this.handleShowFormAdd()}>
          <span className="icon-add icon-padding-right"></span>Add New
        </this.Button>
        <this.Button disabled={this.state.selectedRowKeys.length <= 0} type="danger" onClick={() => this.handleConfirm()}>
          <span className="icon-delete icon-padding-right"></span>Delete
        </this.Button>
      </div> 
    );
  }

  /**
   * modal alert to confirm delete
   */
  renderModalConfirmDelete() {
    return (
      <this.Modal
        visible={this.state.modalVisible}
        wrapClassName="confirm-delete"
        footer={null}    
      >
        <div>
          <span className="icon-help icon-padding-right"></span>
          <span className="title">{this.confirmTitle}</span><br/>
          <span>{this.confirmTextDelete}</span>

        </div>
        <div className="ant-modal-footer">
          <this.Button className="danger" onClick={() => this.handleCancel()}>
            <span className="icon-close icon-padding-right"></span>CANCEL
          </this.Button>
          <this.Button onClick={() => this.handleDelete()} loading={this.state.deleting} className="info">
            <span className="icon-checked icon-padding-right"></span>YES
          </this.Button>
        </div>
      </this.Modal>
    );
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
        <this.Form layout="inline" onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout form-group">
            <this.Col md="3">
              <this.InputText
                name="key"
                label="Search"
                placeholder="Search for code, name and address"
                form={form}
              />
            </this.Col>
            <this.Col md="2">
              <this.Select
                name="status"
                label={<this.Translate id="text_status" />}
                placeholder="Please select status"
                dataSource={this.statusList}
                defaultValue={this.Enum.ALL_STATE}
                form={form}
              />
            </this.Col>
            <this.Button htmlType="submit" type="info" loading={this.state.isClickFilter && fetchingProps.fetching}>
              <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
            </this.Button>
          </this.Row>
        </this.Form>
    );
  }

  /**
   * render sub table of the list
   */
  expandedRender(){
    
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
        disabled: "isSystem" in record && record["isSystem"] ? true : false, // Column configuration not to be checked
        name: record.name,
      })
    };

    return (
      this.isShowExpandable ?
        <this.TableExpand
          dataSource={fetchingProps.list}
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          expandedRowRender={this.expandedRender}
          onRow={record =>({
            onDoubleClick:() => this.handleShowFormEdit(record),
            onClick: () => this.handleShowRecordDetail(record)
          })}
          rowSelection={rowSelection}
          loading={fetchingProps.fetching}
        />
        :
        <this.Table 
          rowSelection={rowSelection}
          dataSource={fetchingProps.list}
          columns={this.columns}
          onChange={this.onChange}
          locale={{emptyText: <this.Translate id="table_empty_data"/>}}
          onRow={record =>({
            onDoubleClick:() => this.handleShowFormEdit(record),
            onClick: () => this.handleShowRecordDetail(record)
          })}
          loading={fetchingProps.fetching}
        />
    );
  }

  /**
   * include from render table to be as the list
   * @param {*} fetchingProps 
   */
  renderTableList(fetchingProps) {
    let pagination = {
      total: fetchingProps.pagination.total,
      pageSize: fetchingProps.pagination.limit,
      current: this.state.current
    };

    return (
      <div className="table-wrapper">

        {this.renderFilterRecord()}

        {this.renderActionButton()}

        { 
          pagination.total > 0 ?
            <div className="float-right">
              <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
            </div>
            :
            ""
        }

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
    const addingProps = this.props[this.addingProp];
    const updatingProps = this.props[this.updatingProp];
    
    // Here is repsonse from add action and combinde response data to the list.
    if (addingProps.response != null) {
      fetchingProps.list = [addingProps.response.data, ...fetchingProps.list];
      this.props.dispatch({type: this.RESET_CONSTANT});
    }

    // Here is repsonse from updating action and update response data to the list.
    if (updatingProps.response != null) {
      const updateIndex = this.Util.findArrayIndex(fetchingProps.list, "id", updatingProps.response.data.id);
      fetchingProps.list.splice(updateIndex, 1, updatingProps.response.data);
      this.props.dispatch({type: this.RESET_CONSTANT});
    }
    
    return (
      
      <div style={{marginTop: "15px"}}>

        { this.renderBreadCrumb()}

        { this.renderTableList(fetchingProps) }
        
        { this.state.modalContent1 }

        { this.state.modalConten }
            
        { this.renderModalConfirmDelete() }

      </div>
      
    );
  }
}

