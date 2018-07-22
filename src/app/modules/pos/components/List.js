import React from "react";
import Component  from "../../common/components/Component";
import menuSource from "../../common/components/layout/SiderBar/datasource";
import "./index.css";

export default class List extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      columns: [],
      selectedRowKeys: [],
      selectedListIds: [],
      modaltitle: "Payment Method",
      modalVisible: false,
      modalSource: {},
      modalConten: null,
      submitPending: false
    };

    this.filter= [],
    this.title = "General";
    this.module = "settings"; // This compare to parent key in datasource in sidebar
    this.reducerProp = "";

    this.pageSize = 10;
    this.confirmTextDelete = "Are you sure delete this record?";
    this.requiredMessage = "Please input all required field.";
    this.okText = "Yes";
    this.cancelText = "No";
    this.messageSuccess = "Success";

    this.onChange = this.onChange.bind(this);
    this.onSelectChange = this.onSelectChange.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

    this.RESET_CONSTANT = "RESET";
  }

  sortOrder(order) {
    if (order === "descend") {
      return "DESC";
    } else {
      return "ASC";
    }
  }
 
  mapSelectedListIds(values) {
    return values.map(value => value.id);
  }

  componentDidMount() {}

  onChange(pagination, filters, sorter) {
    this.filter = [
      this.pageSize,
      (pagination.current - 1) * this.pageSize,
      sorter.field,
      this.sortOrder(sorter.order)
    ];
    this.setState({current: pagination.current});
  }

  onSelectChange(selectedRowKeys, selectedRows) {
    this.setState({
      selectedListIds: this.mapSelectedListIds(selectedRows),
      selectedRowKeys
    });
  }

  handleSubmit() {
  }

  handleAdd() {
    this.setState({
      modalVisible: true
    });
  }

  handleEdit(modalSource) {
    this.setState({
      modalVisible: true,
      modalSource
    });
  }

  handleDelete() {}

  handleCancel() {
    this.setState({
      modalVisible: false,
      modalConten: null
    });
  }

  render() {
    let props = this.props;
    const pagination = {
      total: props.list.total,
      pageSize: props.list.limit
    };

    if (props.response != null) { // Here is repsonse from add action
      props.list.data = [props.response.data, ...props.list.data];
      this.props.dispatch({type: this.RESET_CONSTANT});
    }
  
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange
    };

    const currentPath = window.location.pathname;
    return (
      <div style={{marginTop: "15px"}}>
        <div className="float-left list-title">
          {this.title}
        </div>
        {/* ===============ACTION BUTTON============ */}
        <div className="float-right">
          <this.Button type="info" className="mg-right" onClick={() => this.handleAdd()}>
            <span className="icon-add icon-padding-right"></span>Add
          </this.Button>
          <this.Popconfirm placement="topLeft" title={this.confirmTextDelete} onConfirm={this.handleDelete} okText={this.okText} cancelText={this.cancelText}>
            <this.Button type="danger">
              <span className="icon-bin icon-padding-right"></span>Delete
            </this.Button>
          </this.Popconfirm>
        </div>
        
        <this.clearFloating/>
        <div className="breadcrumb">
          <ul className="list-unstyled">
            <li><this.Link to="/"><span className="icon-home"></span></this.Link></li>
            <li className="fast-nav text-uppercase"><this.Link to="/">{this.module}</this.Link></li>
            {
              menuSource[this.module]["subItems"].map((value, index) => <li className={(currentPath==value["route"] ? "active" : "") + " fast-nav"} key={index}><this.Link to={value["route"]}>{value["title"]}</this.Link></li>)
            }
          </ul>
        </div>
        {/* ===============TABLE LIST============ */}
        <this.Table 
          rowSelection={rowSelection}
          dataSource={props.list.data}
          columns={this.state.columns}
          pagination={pagination}
          onChange={this.onChange}
          onRow={record =>({
            onDoubleClick:(e)=> this.handleEdit(record)
          })}
          loading={props.fetching}
        />

        {/* ===============MODAL============ */}

        {
          this.state.modalVisible ? 
            <this.Modal
              title={this.state.modaltitle}
              wrapClassName="vertical-center-modal"
              visible={true}
              onOk={this.onOk}
              footer={
                <div>
                  <this.Button className="danger" onClick={() => this.handleCancel()}><span className="icon-close icon-padding-right"></span>CANCEL</this.Button>
                  <this.Button  className="info" onClick={() => this.handleSubmit()}><span className="icon-checked icon-padding-right"></span>OK</this.Button>
                </div>
              }
            >
              {/* <p>{JSON.stringify(this.state.modalSource)}</p> */}
              <this.Alert message={this.requiredMessage} type="error" />
              {this.state.modalConten}
            </this.Modal>
            :
            ""
        }
      </div>
    );
  }
}

