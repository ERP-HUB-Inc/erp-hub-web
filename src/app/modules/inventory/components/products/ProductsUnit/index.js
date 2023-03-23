import React from "react";
import swal from "sweetalert";
import List from "../../List";
import Enum from "../../../enums";
import FormCreate from "../../../containers/products/ProductsUnit/FormCreate";
import FormUpdate from "../../../containers/products/ProductsUnit/FormUpdate";
import Constant from "../../../constants/products/productsUnit";
import ProductsUnitAction from "../../../actions/products/productsUnit";
import ProductsUnitService from "../../../services/products/ProductsUnitService";

export default class Lists extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = ProductsUnitService;
    this.localStorageKey = Enum.LOCAL_SCHEMA.UNIT;
    this.action = ProductsUnitAction;
    this.RESET_CONSTANT = Constant.RESET_PRODUCTS_UNIT;
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

class Column extends List {
  constructor(props) {
    super(props);
    return [
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
  }
}