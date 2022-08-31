import React from "react";
import {
  Menu,
  Icon,
  Dropdown,
  Tag
} from "antd";
import List from "../List";
import history from "../../../../common/router/history";
import SaleOrderService from "../../../services/transactions/SaleOrderService";
import Enum from "../../../enums";
import { message } from "antd";

export default class SaleOrder extends List {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: false
    };
    this.SALE_ORDER_STATUS_STR = {
      [Enum.SALE_ORDER_STATUS.DRAFT]: { title: <this.Translate id="text_draft" />, color: "#bfbfbf" },
      [Enum.SALE_ORDER_STATUS.CONFIRMED]: { title: <this.Translate id="text_confirm" />, color: "#1890ff" },
      [Enum.SALE_ORDER_STATUS.CLOSED]: { title: <this.Translate id="text_close" />, color: "#f50"},
      [Enum.SALE_ORDER_STATUS.VOID]: {title: <this.Translate id="text_void"/>, color: "#d9d9d9"}
    };
    this.columns = [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "registerDate",
        key: "registerDate",
        render: (registerDate) => this.Util.formatDate(registerDate, "DD/MM/YYYY")
      },
      {
        title: <this.Translate id="text_status" />,
        dataIndex: "status",
        key: "status",
        render: (status) => {
          const statusValue = this.SALE_ORDER_STATUS_STR[status];
          const statusColor = statusValue.color;
          const stepTitle = statusValue.title;
          return <Tag color={statusColor} style={{width: 100, textAlign: "center"}}>{stepTitle}</Tag>;
        }
      },
      {
        title: <this.Translate id="text_sale_order_no" />,
        dataIndex: "number",
        key: "number",
        width: 180,
        render: (number, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/update/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
              <Menu.Item>
                <this.Link to={`/transactions/sale-order/detail/${record.id}`}>
                  <Icon type="eye" style={{marginRight: 10}} /> <this.Translate id="text_view_detail" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );
          return <div className="wrap-product-name" style={{display: "flex"}}>
            {number}
            <Dropdown className="product-row-option" overlay={menu}>
              {/*eslint-disable-next-line*/}
              <a className="ant-dropdown-link" href="#" onClick={e => e.preventDefault()} style={{marginLeft: 10}}>
                <this.Translate id="text_option" /> <Icon type="down" />
              </a>
            </Dropdown>
          </div>;
        }
      },
      {
        title: <this.Translate id="text_customer" />,
        dataIndex: "firstName",
        key: "firstName",
        render: (firstName, record) => `${firstName} ${record.lastName}`,
        sorter: true
      },
      {
        title: <this.Translate id="text_sub_total" />,
        dataIndex: "totalExcludeTax",
        key: "totalExcludeTax",
        align: "right",
        render: (totalExcludeTax, record) => {
          if (!totalExcludeTax) {
            totalExcludeTax = record.total;
          }
          return this.Util.formatCurrency(totalExcludeTax);
        }
      },
      {
        title: <this.Translate id="text_vat" />,
        dataIndex: "tax",
        key: "tax",
        align: "right",
        render: (text, record) => {
          if (!record.totalExcludeTax) record.totalExcludeTax = record.total;
          return this.formatCurrency(record.total - record.totalExcludeTax);
        }
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        align: "right",
        render: (discount, record) => this.Util.formatCurrency(this.getDiscount(record))
      },
      {
        title: <this.Translate id="text_sale_total" />,
        dataIndex: "total",
        key: "totalSale",
        align: "right",
        render: (total, record) => {
          total = total - this.Util.floor(this.getDiscount(record));
          if (total < 0) total = 0;
          return this.Util.formatCurrency(total);
        }
      },
    ];
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList() {
    this.setState({loading: true});
    SaleOrderService.lists(this.pageSize)
    .then(response => {
      this.setState({data: response.data});
    })
    .catch(err => message.error("Error"))
    .finally(() => this.setState({loading: false}));
  }

  getDiscount(data) {
    let discount = Number(data.discount);
    if (data.discountType === Enum.DISCOUNT_TYPE.PERCENTAGE) {
      discount = this.Util.getValueFromPercentage(data.totalExcludeTax, discount);
    }

    if (!discount) 
      discount = 0;

    return discount;
  }

  buttonActionCollection() {
    return [this.renderButtonAddNew()];
  }

  renderButtonAddNew() {
    return <this.Button
        type="info"
        id="btnAdd"
        className="mg-right text-uppercase"
        onClick={() => history.push({pathname: "/transactions/sale-order/create"})}>
        <span className="icon-add icon-padding-right"></span>
        <this.Translate id="text_add_new" />
      </this.Button>;
  }

  renderPagination(data, className = "float-right") {
    return <div />;
  }


  renderTable() {
    return <this.Table 
      rowKey="id"
      loading={this.state.loading}
      columns={this.columns}
      dataSource={this.state.data}
      onChange={this.onChange}
    />;
  }
}