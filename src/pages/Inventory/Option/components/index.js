import React from "react";
import List from "../../List";
import FormCreate from "../../../containers/products/VariantAttribute/FormCreate";
import FormUpdate from "../../../containers/products/VariantAttribute/FormUpdate";
import Constant from "../../../constants/products/variantAttribute";
import AttributeAction from "../../../actions/products/variantAttribute";
import AttributeService from "../../../services/products/VariantAttributeService";
import "./index.css";

export default class AttributeList extends List {
  constructor(props) {
    super(props);
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name"
      }
    ];
    this.fetchingProp = "variantAttributes";
    this.addingProp = "variantAttributes";
    this.updatingProp = "variantAttributeAdd";
    this.service = AttributeService;
    this.columnFilterWithKey = ["name"];
    this.action = AttributeAction;
    this.RESET_CONSTANT = Constant.RESET_VARIANT_ATTRIBUTE;
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.variantAttributeUpdate.updated) {
      this.props.dispatch(AttributeAction.fetch(this.pageSize));
      this.props.dispatch(AttributeAction.reset(Constant.RESET_VARIANT_ATTRIBUTE));
    }
  }

  handleShowFormAdd() {
    const { dispatch } = this.props;
    dispatch(AttributeAction.showForm());
    this.setState({
      modalConten: <FormCreate/>
    });
  }

  handleShowFormEdit(rowData) {
    const { dispatch } = this.props;
    dispatch(AttributeAction.showForm(rowData));
    this.setState({
      modalConten: <FormUpdate/>
    });
  }
}