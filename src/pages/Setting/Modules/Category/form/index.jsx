import React from "react";
import Enum from "@enums/index";
import Datatable from "@layout/datatable";
import CategoryService from "@services/CategoryService";
import { Translate } from "@redux/index";
import { PageHeader } from "@components/PageHeader";
import { Row, Col, Input, Icon, Table } from "@components/index";
import FormCreate from "../form.create";
import FormUpdate from "../form.update";
import Constant from "../redux/constant";
import CategoryAction from "../redux/action";

export default class CategoryPage extends Datatable {
  constructor(props) {
    super(props);
    this.module = "products";
    this.title = <Translate id="text_categories" />;
    this.placeholder = "Search categories...";
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      },
      {
        title: <this.Translate id="text_parent_category" />,
        dataIndex: "parentId",
        key: "parentId",
        render: (parentId, record) => record.parent && record.parent.name ? record.parent.name : this.emptyCell
      },
      {
        title: <this.Translate id="text_feature_category" />,
        dataIndex: "isFeature",
        key: "isFeature",
        render: isFeature => {
          const isFeatureObj = isFeature ? { title: "check", color: "#87d068" } : { title: "close", color: "#bfbfbf" };
          return <this.Tag style={{width: 90, textAlign: "center"}} color={isFeatureObj.color}><this.Icon type={isFeatureObj.title} /></this.Tag>;
        }
      }
    ].concat([this.renderActionColumn()]);
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.callBackOnShowEditForm = this.showFormEdit;
    this.localStorageKey = Enum.LOCAL_SCHEMA.PRODUCT_TYPE;
    this.service = CategoryService;
    this.action = CategoryAction;
    this.RESET_CONSTANT = Constant.RESET_CATEGORY;
    this.handleShowFormEdit = this.showFormEdit.bind(this);
    this.columnFilterWithKey = ["name"];
    this.searchTimer = null;
  }

  showFormEdit(rowData) {
    this.props.dispatch(CategoryAction.requestAndShowForm(rowData));
  }

  handleConfirm(rowData) {
    if (rowData && rowData.id) {
      this.setState({
        selectedListIds: [rowData.id],
        selectedRowKeys: [rowData.id],
        modalVisible: true
      });
      return;
    }

    super.handleConfirm();
  }

  onSearch = event => {
    const value = event.target.value;
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(() => {
      const searchKey = value ? JSON.stringify({column: this.columnFilterWithKey, value}) : "";
      this.props.dispatch(this.action.fetch(this.pageSize, 0, "", "", "", searchKey));
      this.setState({current: 1});
    }, 300);
  }

  componentWillUnmount() {
    clearTimeout(this.searchTimer);
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      this.props.dispatch(CategoryAction.reset());
      this.props.dispatch(CategoryAction.reset(Constant.RESET_DETAIL_CATEGORY));
      this.props.dispatch(this.action.fetch(this.pageSize));
    }
  }

  render() {
    const fetchingProps = this.props[this.fetchingProp];
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        name: record.name
      })
    };

    return (
      <div className="content-list">
        <div className="table-wrapper">
          <PageHeader
            title={<Translate id="text_categories" />}
            subtitle="Manage product categories and category details"
            breadcrumbs={[
              { text: "Dashboard", href: "/dashboard" },
              { text: <Translate id="text_categories" /> }
            ]}
            actions={[
              {
                text: "New Category",
                type: "primary",
                icon: "plus",
                onClick: this.handleShowFormAdd
              }
            ]}
          />

          <div style={{ paddingLeft: 40, paddingRight: 40, paddingTop: 25 }}>
            <Row style={{ marginBottom: 10 }}>
              <Col md={24}>
                <Input
                  name="search"
                  placeholder={this.placeholder}
                  suffix={<Icon type="search" />}
                  style={{width: 380, marginRight: 10}}
                  allowClear={true}
                  onChange={this.onSearch}
                />
              </Col>
            </Row>

            <Table
              rowKey="id"
              bordered
              rowSelection={rowSelection}
              loading={fetchingProps.fetching}
              columns={this.columns}
              dataSource={fetchingProps.list}
              onChange={this.onChange}
              onRow={record => ({
                onDoubleClick: () => this.handleShowFormEdit(record),
                onClick: event => this.handleOnTapHandler(event, record)
              })}
              pagination={{
                total: fetchingProps.pagination.total,
                pageSize: fetchingProps.pagination.limit,
                current: this.state.current,
                pageSizeOptions: this.pageSizeOptions,
                showTotal: total => `${this.CATranslate("text_total", this.props.locale)} ${total} ${this.CATranslate("text_records", this.props.locale)}`,
                showSizeChanger: true,
                onShowSizeChange: this.onShowSizeChange,
                onChange: this.onChangePagination
              }}
              locale={{emptyText: <this.Translate id="table_empty_data"/>}}
              size="middle"
            />
          </div>

          {this.formCreate}
          {this.formUpdate}
          {this.renderModalConfirmDelete()}
        </div>
      </div>
    );
  }
}
