import React from "react";
import { Pagination } from "antd";
import List from "../../List";
import menuSource from "../../../../common/components/layout/SiderBar/datasource";

export default class ListRole extends List {
  render() {
    // role access
    const showListRoles = this.props[this.showListRole];
    const Layout = this.props[this.Layout];

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


        <this.Row className="main-row-role-access">
          <this.Col md="6">      
            <div className="table-wrapper">
              {/* ===============ACTION BUTTON============ */}
              <div className="float-left">
                <this.Button type="info" className="mg-right" onClick={() => this.handleShowFormAdd()}>
                  <span className="icon-add icon-padding-right"></span>Add New
                </this.Button>
                <this.Button disabled={this.state.selectedRowKeys.length <= 0} type="danger" onClick={() => this.handleConfirm()}>
                  <span className="icon-bin icon-padding-right"></span>Delete
                </this.Button>
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
            

          </this.Col>
          
          {  showListRoles !=null ? 
            <this.Col md="6"> 
              { this.state.ListRoles }
            </this.Col>
            : ""
          }

        </this.Row>
            
    
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
              <span className="icon-close icon-padding-right"></span>NO
            </this.Button>
            <this.Button onClick={() => this.handleDelete()} loading={false} className="info">
              <span className="icon-checked icon-padding-right"></span>YES
            </this.Button>
          </div>
        </this.Modal>
      </div>
      
    );
  }
}
