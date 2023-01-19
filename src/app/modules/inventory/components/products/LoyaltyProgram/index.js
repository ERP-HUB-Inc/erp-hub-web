import React from "react";
import { connect } from "react-redux";
import { 
  Form, 
  Table,
  Pagination,
  Menu,
  Dropdown
} from "antd";
import LoyaltyProgramService from "../../../services/products/LoyaltyProgramService";
import history from "../../../../common/router/history";
import List from "../../List";

class LoyaltyProgram extends List {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      data: [],
      pagination: {},
      loading: false,
      selectedRowKeys: [],
      selectedListIds: []
    };
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        width: 500,
        render: (name, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/loyalty-program/update/${record.id}`}>
                  <this.Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );
  
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {name}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <this.Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_point_per_amount" />,
        dataIndex: "pointPerAmount",
        key: "pointPerAmount",
        render: (pointPerAmount) => this.Util.formatCurrency(pointPerAmount)
      },
      {
        title: <this.Translate id="text_point_per_order" />,
        dataIndex: "pointPerOrder",
        key: "pointPerOrder",
      },
      {
        title: <this.Translate id="text_point_per_product" />,
        dataIndex: "pointPerProduct",
        key: "pointPerProduct"
      },
      {
        title: <this.Translate id="text_point_increament" />,
        dataIndex: "pointIncreament",
        key: "pointIncreament"
      }
    ];
    this.service = LoyaltyProgramService;
  }

  componentDidMount() {
    this.fetchList();
  }

  componentDidUpdate() {

  }

  fetchList() {
    let limit = this.pageSize;
    let offset = this.state.current;
    let search = "";
    let filter = {};
    let locationId = 0;

    const params = new URLSearchParams(window.location.search);

    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    offset = (offset - 1) * limit;
    this.setState({loading: true});
    this.service.lists(limit, offset, "", "", filter, search, "", locationId)
    .then(response => {
      this.setState({
        data: response.data.data,
        pagination: response.data.pagination
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  handleDelete() {
    if (this.service) {
      this.setState({loading: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.fetchList();
          this.setState({
            selectedRowKeys: [],
            modalVisible: false,
          });
        })
        .finally(() => this.setState({loading: false}));
    }
  }

  onTableChange = (current, pageSize) => {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  renderPagination(pagination = this.state.pagination) {
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
          <Pagination size="small" 
            showTotal={showTotal} 
            showSizeChanger 
            onShowSizeChange={this.onTableChange} 
            onChange={this.onTableChange} 
            {...pagination} />
        </div>
        :
        ""
    );
  }

  renderButtonAddNew() {
    return <this.Button
      type="info"
      id="btnAdd"
      className="mg-right"
      onClick={() => history.push({pathname: "/loyalty-program/create"})}>
      <span className="icon-add icon-padding-right"></span>
      <this.Translate id="text_add_new" />
    </this.Button>;
  }

  renderTable() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
      })
    };

    return (
      <Table
        rowKey="id"
        columns={this.columns}
        rowSelection={this.rowSelection ? rowSelection : null}
        loading={this.state.loading}
        dataSource={this.state.data}
        bordered={true}
        pagination={false}
        onChange={this.onChange}
      />
    );
  }
}

function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const loyaltyProgram = Form.create(mapPropsToFields)(LoyaltyProgram);

export default connect(mapStateToProps)(loyaltyProgram);