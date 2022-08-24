import React from "react";
import { 
  Dropdown, 
  Form, 
  Menu, 
  message, 
  Table,
  Tag,
  Icon,
  Pagination
} from "antd";
import { connect } from "react-redux";
import moment from "moment";
import history from "../../../../common/router/history";
import List from "../../List";
import PromotionService from "../../../services/products/PromotionService";
import EnumPos from "../../../../pos/enums";

class Promotion extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      data: [],
      loading: false,
      isShowFilter: false
    };
    this.columns = [
      {
        title: <this.Translate id="text_promotion_name" />,
        dataIndex: "name",
        key: "name",
        width: 500,
        render: (name, record) => {
          const menu = (
            <Menu>
              <Menu.Item>
                <this.Link to={`/promotions/update/${record.id}`}>
                  <Icon type="edit" style={{marginRight: 10}} /> <this.Translate id="text_edit" />
                </this.Link>
              </Menu.Item>
            </Menu>
          );
  
          return <div className="wrap-product-name" style={{display: "flex"}}>
          {name}
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
        title: <this.Translate id="text_date" />,
        dataIndex: "startDate",
        key: "startDate",
        render: (startDate, record) => {
          return <React.Fragment>
            {`${this.Util.formatDate(startDate, "DD/MM/YYYY")} ~ ${this.Util.formatDate(record.endDate, "DD/MM/YYYY")}`}
            {
              moment(record.endDate).isBefore(moment()) ? 
                <Tag color="#e85757" style={{marginLeft: 10}}>Expired</Tag>
                :
                (
                  moment(record.startDate).isAfter(moment()) ? 
                  <Tag color="#f50" style={{marginLeft: 10}}>Upcoming</Tag>
                  :
                  <Tag color="#87d068" style={{marginLeft: 10}}>In Progress</Tag>
                )
            }
          </React.Fragment>;
        }
      },
      {
        title: <this.Translate id="text_location" />,
        dataIndex: "locationId",
        key: "locationId",
        render: (locationId, record) => locationId ? record.location.name : <this.Translate id="text_all_location" />
      },
      {
        title: <this.Translate id="text_discount" />,
        dataIndex: "discount",
        key: "discount",
        render: (discount, record) => {
          let label = "%";
          if (record.discountType === EnumPos.DISCOUNT_TYPE.AMOUNT) {
            label = "$";
          }
          return `${this.Util.formatCurrency(discount, "")}${label}`;
        }
      },
      {
        title: <this.Translate id="text_target_product" />,
        dataIndex: "targetProduct",
        key: "targetProduct",
        render: targetProduct => targetProduct === "all" ? "គ្រប់ផលិតផល់ទាំងអស់" : "សម្រាប់ផលិតផលមួយចំនួន"
      }
    ];
    this.service = PromotionService;
  }

  componentDidMount() {
    this.fetchList();
  }

  fetchList() {
    this.setState({loading: true});
    this.service.lists(this.pageSize)
    .then(response => {
      this.setState({data: response.data});
    })
    .catch(() => message.error("Error"))
    .finally(() => this.setState({loading: false}));
  }

  handleDelete() {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.fetchList();
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

  renderButtonAddNew() {
    return <this.Button
      type="info"
      id="btnAdd"
      className="mg-right text-uppercase"
      onClick={() => history.push({pathname: "/promotions/create"})}>
      <span className="icon-add icon-padding-right"></span>
      <this.Translate id="text_add_new" />
    </this.Button>;
  }

  renderPagination(data0, classsName = "float-right") {
    const {data} = this.state;
    let pagination = {
      total: data.pagination && data.pagination.total,
      pageSize: data.pagination && data.pagination.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      data && pagination.total > 0 ?
        <div className={classsName}>
          <Pagination size="small" showTotal={showTotal} showSizeChanger onShowSizeChange={this.onShowSizeChange} onChange={this.onChangePagination} {...pagination} />
        </div>
        :
        ""
    );
  }

  renderTable() {
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name,
      })
    };

    return <Table 
      rowKey="id"
      rowSelection={this.rowSelection ? rowSelection : null}
      columns={this.columns}
      dataSource={this.state.data.data}
      loading={this.state.loading}
      onChange={this.onChange}
    />;
  }
}

export function mapStateToProps(state) {
  return {
    locale: state.locale
  };
}

function mapPropsToFields(props) {
  return {
    form: props.form
  };
}

const promotion = Form.create(mapPropsToFields)(Promotion);

export default connect(mapStateToProps)(promotion);