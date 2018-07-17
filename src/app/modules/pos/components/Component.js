import Component  from "../../common/components/Component";

export default class CComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = 2;
    this.confirmTextDelete = "Are you sure delete this task?";
    this.okText = "Yes";
    this.cancelText = "No";
  }

  sortOrder(order) {
    if (order === "descend") {
      return "DESC";
    } else {
      return "ASC";
    }
  }
}