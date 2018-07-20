import Component  from "../../common/components/Component";

export default class CComponent extends Component {
  constructor(props) {
    super(props);
    this.pageSize = 10;
    this.confirmTextDelete = "Are you sure delete this record?";
    this.okText = "Yes";
    this.cancelText = "No";
    this.AnimationInput;
    this.Selects;
  }

  sortOrder(order) {
    if (order === "descend") {
      return "DESC";
    } else {
      return "ASC";
    }
  }

  mapSelectedListIds(values) {
    return values.map(value => value.id);
  }
}