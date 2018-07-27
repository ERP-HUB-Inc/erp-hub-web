import React from "react";
import { Pagination } from "antd";
import Component  from "../../common/components/Component";
import menuSource from "../../common/components/layout/SiderBar/datasource";
import "./index.css";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      selectedRowKeys: [],
      selectedListIds: [],
      modalVisible: false,
      modalSource: {},
      modalConten: null, // the content that show in modal content
    };

    this.columns = [],
    this.filter = [],
    this.module = "settings"; // This compare to parent key in datasource in sidebar when render breadcrump
    this.fetchingProp = ""; // prop of reducer of fetching record that get from map state to prop from container
    this.addingProp = ""; // prop of reducer of adding record that get from map state to prop from container
    this.updatingProp = ""; // prop of reducer of adding record that get from map state to prop from container

    this.pageSize = 10; // default limit record display in table list
    this.confirmTextDelete = "Are you sure delete this record?";
    this.requiredMessage = "Please input all required field."; // require message display on modal popup
    this.okText = "Yes"; // text button on alert of delete action
    this.cancelText = "No"; // text button on alert of delete action
    this.messageSuccess = "Success"; // message display after delete action

    this.onChange = this.onChange.bind(this); // handle when user change filter, access pagination
    this.onShowSizeChange = this.onShowSizeChange.bind(this);
    this.onChangePagination = this.onChangePagination.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.RESET_CONSTANT = "RESET";
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

  componentDidMount() {}

  /**
   * when user change sort in each column
   * @param {*} pagination 
   * @param {*} filters 
   * @param {*} sorter 
   */
  onChange(pagination, filters, sorter) {
    this.filter = [
      this.pageSize,
      (pagination.current - 1) * this.pageSize,
      sorter.field,
      this.sortOrder(sorter.order)
    ];
    this.setState({current: pagination.current});
  }

  /**
   * when user change pagination
   * @param {*} current: current page number of pagination 
   * @param {*} pageSize 
   */
  onChangePagination(current, pageSize) {
    console.log(current, pageSize);
  }

  /**
   * when user change size of row
   * @param {*} current 
   * @param {*} pageSize 
   */
  onShowSizeChange(current, pageSize) {
    console.log(current, pageSize);
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
   * handle delete multi record
   * it will overide in child class
   */
  handleDelete() {}

  render() {
    let fetchingProps = this.props[this.fetchingProp];
    const addingProps = this.props[this.addingProp];
    const updatingProps = this.props[this.updatingProp];
    const pagination = {
      total: fetchingProps.pagination.total,
      pageSize: fetchingProps.pagination.limit,
      current: this.state.current
    };
    
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
    
    // handle for change select checkbox on table row
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };
  
    // get current path of breadcrum compare with url
    const currentPath = window.location.pathname;

    return (
      <div style={{marginTop: "15px"}}>
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
                <li className={(currentPath==value["route"] ? "active" : "") + " fast-nav"} key={index}>
                  <this.Link to={value["route"]}>{value["title"]}</this.Link>
                </li>
              )
            }
          </ul>
        </div>
        {/* ===============ENDACTION BUTTON====== */}

        {/* ===============TABLE LIST============ */}
        <div className="table-wrapper">
          {/* ===============ACTION BUTTON============ */}
          <div className="float-left">
            <this.Button type="info" className="mg-right" onClick={() => this.handleShowFormAdd()}>
              <span className="icon-add icon-padding-right"></span>Add New
            </this.Button>
            <this.Popconfirm placement="topLeft" title={this.confirmTextDelete} onConfirm={this.handleDelete} okText={this.okText} cancelText={this.cancelText}>
              <this.Button type="danger">
                <span className="icon-bin icon-padding-right"></span>Delete
              </this.Button>
            </this.Popconfirm>
          </div>

          <div className="float-right">
            <Pagination showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
          </div>
          <this.clearFloating/>
          <this.Table 
            rowSelection={rowSelection}
            dataSource={fetchingProps.list}
            columns={this.columns}
            pagination={false} //
            onChange={this.onChange}
            onRow={record =>({
              onDoubleClick:(e)=> this.handleShowFormEdit(record)
            })}
            loading={fetchingProps.fetching}
          />
        </div>
        {/* ===============END TABLE LIST============ */}

        {/* ===============DISPLAY MODAL POPUP============ */}
        {
          this.state.modalConten
        }
        {/* ===============END DISPLAY MODAL POPUP============ */}
      </div>
    );
  }
}

