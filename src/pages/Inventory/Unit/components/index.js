import React from "react";
import swal from "sweetalert";
import Datatable from "@layout/datatable";
import Enum from "@enums/index";
import UnitService from "@services/UnitService";
import Constant from "../redux/constant";
import UnitAction from "../redux/action";
import FormCreate from "../FormCreate";
import FormUpdate from "../FormUpdate";

export default class UnitPage extends Datatable {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="text_number_in_unit" />,
        dataIndex: "multiple",
        key: "multiple",
        sorter: true,
        render: (text,render) => `${render.multiple} ${render.label ? render.label : ""}`
      },
      this.columnStatus
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = UnitService;
    this.localStorageKey = Enum.LOCAL_SCHEMA.UNIT;
    this.action = UnitAction;
    this.RESET_CONSTANT = Constant.RESET_UNIT;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added && nextProps.add.response) {
      const newAddedUnit = nextProps.add.response.data;
      let existingUnits = localStorage.getItem(Enum.LOCAL_SCHEMA.UNIT);
      existingUnits = JSON.parse(existingUnits);
      existingUnits.push(newAddedUnit);
      localStorage.setItem(Enum.LOCAL_SCHEMA.UNIT, JSON.stringify(existingUnits));
    }
  }

  /**
   * handle procedd delete
  */
  handleDelete() {
    if (this.service) {
      this.setState({deleting: true});
      this.service.archive(this.state.selectedListIds)
        .then(() => {
          this.props.dispatch(this.action.fetch(this.pageSize, (this.state.current - 1) * this.pageSize));
          this.setState({
            selectedRowKeys: [],
            modalVisible: false,
            deleting: false
          });
        })
        .catch(err => {
          if (err.response && err.response.data && err.response.data.error && err.response.data.error) {
            swal({
              icon: "error",
              title: err.response.data.error.message,
              dangerMode: true
            });
          }

          this.setState({
            deleting: false,
            modalVisible: false
          });
        });
    }
  }
}