import React from "react";
import FormAdd from "./FormAdd";
import columns from "./column";
import List from "../../List";
import TaxAction from "../../../action/settings/tax";

export default class TaxList extends List {
  constructor(props) {
    super(props);

    this.state = ({
      modaltitle: "TAX",
      columns
    });

    this.title = "Tax";

    this.fetchingProp = "tax";
    this.addingProp = "taxAdd";
  }
  
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(TaxAction.fetch(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);

    dispatch(TaxAction.fetch(...this.filter));
  }

  handleAdd() {
    super.handleAdd();
    this.setState({
      modalConten: <FormAdd/>
    });
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(TaxAction.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(TaxAction.fetch(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}