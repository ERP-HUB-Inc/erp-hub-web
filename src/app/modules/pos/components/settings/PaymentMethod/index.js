import List from "../../List";
import columns from "./column";
import PaymentMethod from "../../../action/settings/paymentMethod";
import "./index.css";

export default class PaymentMethodList extends List {
  constructor(props) {
    super(props);
    this.state = {
      modaltitle: "Payment Method",
      columns
    };

    this.title = "Payment Method";
    this.reducerProp ="paymentMethods";
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(PaymentMethod.fetchPaymentMethods(this.pageSize));
  }

  onChange(pagination, filters, sorter) {
    const { dispatch } = this.props;
    super.onChange(pagination, filters, sorter);
    dispatch(PaymentMethod.fetchPaymentMethods(...this.filter));
  }

  handleAdd() {
    super.handleAdd();
  }

  handleDelete() {
    const { dispatch } = this.props;

    dispatch(PaymentMethod.archivePaymentMethods(this.state.selectedListIds));

    this.Message.info(this.messageSuccess);

    dispatch(PaymentMethod.fetchPaymentMethods(this.pageSize, this.state.current));
    
    this.setState({selectedRowKeys: []});
  }

  render() {
    return super.render();
  }
}
