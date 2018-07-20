import List from "../../List";
import TaxMethod from "../../../action/settings/tax";
import columns from "./column";

export default class TaxList extends List {
  constructor(props) {
    super(props);

    this.state = ({
      modaltitle: "TAX",
      columns
    });

    this.title = "Tax";

    this.reducerProp ="tax";
  }
  
  componentDidMount() {
    const { dispatch } = this.props;

    dispatch(TaxMethod.fetchTax(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;

    super.onChange(pagination, filters, sorter);

    dispatch(TaxMethod.fetchTax(...this.filter));
  }

  handleAdd() {
    super.handleAdd();
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(TaxMethod.archive(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(TaxMethod.fetchTax(this.pageSize, this.state.current));

    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}