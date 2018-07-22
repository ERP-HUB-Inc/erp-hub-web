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
      columns: [],
      selectedRowKeys: [],
      selectedListIds: [],
      modaltitle: "Payment Method",
      modalVisible: false,
      modalSource: {},
      modalConten: null, // the content that show in modal content
    };

    this.filter= [],
    this.title = "General"; // title of the list
    this.module = "settings"; // This compare to parent key in datasource in sidebar when render breadcrump
    this.fetchingProp = "paymentMethod"; // prop of reducer of fetching record that get from map state to prop from container
    this.addingProp = "paymentMethodAdd"; // prop of reducer of adding record that get from map state to prop from container

    this.pageSize = 10;
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
   * @param {*} page 
   * @param {*} pageSize 
   */
  onChangePagination(page, pageSize) {
    console.log(page, pageSize);
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

  handleSubmit() {}

  handleAdd() {}

  handleEdit(modalSource) {
    this.setState({
      modalSource
    });
  }

  handleDelete() {}

  handleCancel() {
    this.props.dispatch({type: this.RESET_CONSTANT});
  }

  render() {
    let fetchingProps = this.props[this.fetchingProp];
    const addingProps = this.props[this.addingProp];
    const pagination = {
      total: fetchingProps.list.total,
      pageSize: fetchingProps.list.limit,
      current: this.state.current
    };

    if (addingProps.response != null) { // Here is repsonse from add action and combinde response data to the list.
      fetchingProps.list.data = [addingProps.response.data, ...fetchingProps.list.data];
      this.props.dispatch({type: this.RESET_CONSTANT});
    }
    
    // handle for change select checkbox on table row
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };
  
    // get current path of breadcrum compare with url
    const currentPath = window.location.pathname;

    // get value for display popup value 
    let showModal = this.state.modalVisible;

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
            <this.Button type="info" className="mg-right" onClick={() => this.handleAdd()}>
              <span className="icon-add icon-padding-right"></span>Add
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
            dataSource={fetchingProps.list.data}
            columns={this.state.columns}
            pagination={false} //
            onChange={this.onChange}
            onRow={record =>({
              onDoubleClick:(e)=> this.handleEdit(record)
            })}
            loading={fetchingProps.fetching}
          />
        </div>
        {/* ===============END TABLE LIST============ */}

        {/* ===============MODAL============ */}
        {
          addingProps.showForm ? 
            <this.Modal
              title={this.state.modaltitle}
              wrapClassName="vertical-center-modal"
              visible={true}
              onOk={this.onOk}
              footer={
                <div>
                  <this.Button className="danger" onClick={() => this.handleCancel()}>
                    <span className="icon-close icon-padding-right"></span>CANCEL
                  </this.Button>
                  <this.Button loading={addingProps.adding}  className="info" onClick={() => this.handleSubmit()}>
                    <span className="icon-checked icon-padding-right"></span>OK
                  </this.Button>
                </div>
              }
            >
              {addingProps.error != null ? <this.Alert message={this.requiredMessage} type="error" /> : ""}
              {this.state.dataSource}
              {this.state.modalConten}
            </this.Modal>
            :
            ""
        }
        {/* ===============END MODAL============ */}
      </div>
    );
  }
}

