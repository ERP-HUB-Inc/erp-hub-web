import React from "react";
import moment from "moment";
import List from "../List";
import FormCreate from "../../../containers/settings/OperationRecord/FormCreate";
import FormUpdate from "../../../containers/settings/OperationRecord/FormUpdate";
import Constant from "../../../constants/settings/operationRecord";
import OperationRecordAction from "../../../action/settings/operationRecord";
import OperatinRecordService from "../../../services/settings/OperationRecordService";

export default class IncomeExpense extends List {
  constructor(props) {
    super(props);
    this.module = "transactions";
    this.columns = new Column();
    this.formCreate = <FormCreate />;
    this.formUpdate = <FormUpdate />;
    this.generalSearchLabel = "text_search";
    this.placeHolderForGeneralSearch = "text_description";
    this.columnFilterWithKey = ["name"];
    this.service = OperatinRecordService;
    this.action = OperationRecordAction;
    this.RESET_CONSTANT = Constant.RESET_OPERATION_RECORD;
  }

  componentDidMount() {
    this.props.dispatch(
      OperationRecordAction.fetch(this.pageSize, 0, "", "", "", "", "")
    );
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added) {
      nextProps.dispatch(OperationRecordAction.fetch(this.pageSize));
      this.props.dispatch(OperationRecordAction.reset());
    }
  }

  renderFilterStatus() {}

  checkIsAllowDeleteRecordOrNot() {
    if (
      this.state.selectedListIds &&
      this.state.selectedListIds.length > 0 &&
      this.props[this.fetchingProp]
    ) {
      let isHasSystemRecord = false;
      this.state.selectedListIds.forEach((selectedId) => {
        const result = this.props[this.fetchingProp].list.find(
          (record) => record.id === selectedId
        );

        if (result && result.isSystem === this.Enum.IS_SYSTEM) {
          isHasSystemRecord = true;
          this.Message.warning(
            this.CATranslate(
              "text_warning_delete_system_record",
              this.props.locale
            )
          );
        }
      });
      return isHasSystemRecord;
    }
  }

  handleSubmitFilter(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const searchKey = JSON.stringify({
          column: this.columnFilterWithKey,
          value: values.key ? values.key : "",
        });
        const dates =
          values.dates && values.dates.length > 0
            ? `${moment(values.dates[0]).format("YYYY-MM-DD")},${moment(
                values.dates[1]
              ).format("YYYY-MM-DD")}`
            : "";

        this.props.dispatch(
          OperationRecordAction.fetch(
            this.pageSize,
            (this.state.current - 1) * this.pageSize,
            "",
            "",
            "",
            searchKey,
            dates
          )
        );
        this.setState({ isClickFilter: true });
      }
    });
  }

  renderFilterRecord() {
    const { form } = this.props;
    const fetchingProps = this.props[this.fetchingProp];
    return form == null ? (
      ""
    ) : (
      <this.Form onSubmit={this.handleSubmitFilter}>
        <this.Row className="main-search-layout">
          {this.renderFilterGeneralKey()}
          <this.DateRangePicker
            name="dates"
            label={<this.Translate id="text_date" />}
            ranges={[]}
            form={this.props.form}
          />
          <this.Col md="2" className="wrap-btn-search">
            <div
              className="ant-form-item-label"
              style={{ visibility: "hidden" }}
            >
              <label htmlFor="status" className="" title="">
                Filter
              </label>
            </div>
            <this.Button
              htmlType="submit"
              type="default"
              loading={this.state.isClickFilter && fetchingProps.fetching}
            >
              <span className="icon-search icon-padding-right text-uppercase"></span>
              <this.Translate id="button_text_search" />
            </this.Button>
          </this.Col>
        </this.Row>
      </this.Form>
    );
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    this.colorOperationType = ["#4cb64c", "#c72727"];

    return [
      {
        title: <this.Translate id="text_date" />,
        dataIndex: "date",
        key: "date",
        width: 160,
        render: (date) => this.Util.formatDate(date, "DD/MM/YYYY"),
      },
      {
        title: <this.Translate id="text_category" />,
        dataIndex: "name",
        key: "name",
        render: (name, record) => {
          if (record.type === this.Enum.OPERATION_TYPE.EXPENSE) {
            return (
              <div>
                <div
                  style={{
                    color: "#c72727",
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 5,
                  }}
                >
                  <this.Translate id="text_expense" />
                </div>
                <div>
                  {record.category}: {name}
                </div>
              </div>
            );
          } else {
            return (
              <div>
                <div
                  style={{
                    color: "#4cb64c",
                    fontSize: 16,
                    fontWeight: 500,
                    marginBottom: 5,
                  }}
                >
                  <this.Translate id="text_income" />
                </div>
                <div>
                  {record.category}: {name}
                </div>
              </div>
            );
          }
        },
      },
      {
        title: <this.Translate id="text_recorded_by" />,
        dataIndex: "user",
        key: "user",
        width: 180,
      },
      {
        title: <this.Translate id="text_recorded_date" />,
        dataIndex: "registerDate",
        key: "registerDate",
        width: 180,
        render: (registerDate) =>
          this.Util.formatDate(registerDate, "DD/MM/YYYY"),
      },
      {
        title: <this.Translate id="text_amount" />,
        dataIndex: "amount",
        align: "right",
        width: 180,
        render: (amount) => this.Util.formatCurrency(amount),
      },
    ];
  }
}
