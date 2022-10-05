import React from "react";
import moment from "moment";
import { 
  Table,
  Form,
  Tag,
  Pagination
} from "antd";
import { connect } from "react-redux";
import Util from "../../../../common/util";
import StockConsignmentService from "../../../services/stock/StockConsignmentService";
import LocationService from "../../../../pos/services/settings/LocationService";
import history from "../../../../common/router/history";
import List from "../List";

class StockConsignment extends List {
  state = {
    data: [],
    selectedRowKeys: [],
    selectedListIds: [],
    locations: [],
    isShowFilter: true,
    loading: false,
    loadingFilter: false,
    current: 1
  }
  util = new Util();
  consignmentStatus = {
    "Draft": {title: <this.Translate id="text_draft" />, color: "#bfbfbf"},
    "Received": {title: <this.Translate id="text_received" />, color: "#1890ff"},
    "Returned": {title: <this.Translate id="text_returned" />, color: "#f50"}
  }
  columns = [
    {
      title: <this.Translate id="text_date" />,
      dataIndex: "date",
      key: "date",
      render: (date) => this.util.formatDate(date, "DD/MM/YYYY")
    },
    {
      title: <this.Translate id="text_location" />,
      dataIndex: "location",
      key: "location"
    },
    {
      title: <this.Translate id="text_seller" />,
      dataIndex: "seller",
      key: "seller"
    },
    {
      title: <this.Translate id="text_status" />,
      dataIndex: "status",
      key: "status",
      width: 150,
      render: (status) => {
        const statusValue = this.consignmentStatus[status];
        return <Tag color={statusValue.color} style={{width: 120, textAlign: "center"}}>{statusValue.title}</Tag>;
      }
    }
  ];
  pathname = "/stock/consignment/list";

  componentDidMount() {
    const params = new URLSearchParams(document.location.search);
    if (params.get("limit")) {
      this.pageSize = params.get("limit");
    }

    if (params.get("offset")) {
      this.setState({current: params.get("offset")});
    }

    if (params.get("searchKey")) {
      this.props.form.setFieldsValue({status: params.get("searchKey")});
    }

    if (params.get("date")) {
      this.props.form.setFieldsValue({date: moment(params.get("date"))});
    }

    this.fetchList();
    LocationService.lists(this.pageSize)
    .then(response => this.setState({locations: response.data.data}));
  }

  fetchList() {
    let limit = this.pageSize;
    let offset = this.state.current;
    let searchKey = "";
    let date = "";
    const params = new URLSearchParams(window.location.search);
    if (params.get("limit")) {
      limit = Number(params.get("limit"));
    }

    if (params.get("offset")) {
      offset = Number(params.get("offset"));
    }

    if (params.get("searchKey")) {
      searchKey = params.get("searchKey");
    }

    if (params.get("date")) {
      date = this.Util.formatDateForMYSQL(params.get("date"));
    }

    offset = (offset - 1) * limit;
    this.setState({loading: true});
    StockConsignmentService.lists(limit, offset, searchKey, date)
    .then(response => {
      this.setState({data: response.data});
    })
    .finally(() => this.setState({loading: false}));
  }

  handleSubmitFilter = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = new URLSearchParams(document.location.search);
        if (values.searchKey) {
          params.set("searchKey", values.searchKey);
        } else {
          params.delete("searchKey");
        }

        if (values.date) {
          params.set("date", this.Util.formatDateForMYSQL(values.date));
        } else {
          params.delete("date");
        }

        this.Util.pushParamsToURL(this.pathname, params.toString());
        this.fetchList();
      }
    });
  }

  onShowSizeChange(current, pageSize) {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  onChangePagination(current, pageSize) {
    const params = new URLSearchParams(document.location.search);
    params.set("limit", pageSize);
    params.set("offset", current);

    this.setState({current});
    this.Util.pushParamsToURL(this.pathname, params.toString());
    this.fetchList();
  }

  handleShowFormEdit = (record) => {
    history.push(`/stock/consignment/update/${record.id}`);
  }

  handleDelete() {
    this.setState({loading: true});
    console.log("selected delete ids", this.state.selectedListIds);
    StockConsignmentService.archive(this.state.selectedListIds)
    .then(() => {
      this.fetchList();
      this.setState({
        selectedRowKeys: [],
        modalVisible: false,
      });
    })
    .finally(() => this.setState({loading: false}));
  }

  renderFilterStatus() {
    return <this.Col md={2}>
      <this.Select
        name="status"
        label={<this.Translate id="text_status" />}
        dataSource={[
          {value: "", name: <this.Translate id="text_all_status" />},
          {value: "Draft", name: <this.Translate id="text_draft" />},
          {value: "Received", name: <this.Translate id="text_received" />},
          {value: "Returned", name: <this.Translate id="text_returned" />}
        ]}
        defaultValue=""
        form={this.props.form}/>
    </this.Col>;
  }

  renderFilterRecord() {
    return (
      <this.Form onSubmit={this.handleSubmitFilter}>
          <this.Row className="main-search-layout">
            <this.Col md="2">
              <this.InputText
                name="searchKey"
                label={<this.Translate id={this.generalSearchLabel}/>}
                placeholder={this.CATranslate("text_search_by_seller", this.props.locale)}
                form={this.props.form}
                allowClear={true} />
            </this.Col>
            <this.Col md="2">
              <this.DatePickers
                name="date"
                label={<this.Translate id="text_date" />}
                form={this.props.form} />
            </this.Col>
            <this.Col md="2" className="wrap-btn-search">
              <div className="ant-form-item-label" style={{visibility: "hidden"}}>
                <label htmlFor="status" className="" title="">Filter</label>
              </div>
              <this.Button htmlType="submit" type="info" loading={this.state.loadingFilter}>
                <span className="icon-search icon-padding-right text-uppercase"></span><this.Translate id="button_text_search" />
              </this.Button>
            </this.Col>
          </this.Row>
        </this.Form>
    );
  }

  renderButtonAddNew() {
    return <this.Button
      type="info"
      id="btnAdd"
      className="mg-right text-uppercase"
      onClick={() => history.push({pathname: "/stock/consignment/create"})}>
      <span className="icon-add icon-padding-right"></span>
      <this.Translate id="text_add_new" />
    </this.Button>;
  }

  renderPagination(fetchingProp, className = "float-right") {
    const data = this.state.data && this.state.data.pagination;
    let pagination = {
      total: data && data.total,
      pageSize: data && data.limit,
      current: this.state.current,
      pageSizeOptions: this.pageSizeOptions
    };

    const showTotal = total => {
      return `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`;
    };

    return( 
      pagination.total > 0 ?
        <div className={className}>
          <Pagination 
            size="small" 
            showTotal={showTotal} 
            showSizeChanger
            defaultCurrent={this.state.current}
            defaultPageSize={this.pageSize}
            onShowSizeChange={this.onShowSizeChange} 
            onChange={this.onChangePagination} 
            {...pagination} />
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

    return (
      <Table
        rowKey="id"
        columns={this.columns}
        rowSelection={this.rowSelection ? rowSelection : null}
        loading={this.state.loading}
        locale={{emptyText: <this.Translate id="table_empty_data"/>}}
        bordered
        dataSource={this.state.data.data}
        onChange={this.onChange}
        onRow={record => ({
          onDoubleClick: () => this.handleShowFormEdit(record)
        })}
        pagination={false}
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

const stockConsignment = Form.create(mapPropsToFields)(StockConsignment);

export default connect(mapStateToProps)(stockConsignment);