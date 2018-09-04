import Supplier from "../Component/SupplierSelect";
import StoreLocation from "../Component/StoreLocationSelect";
import Brand from "../Component/Brand";
import Modals from "../../../../common/components/shares/Modal";
import "./index.css";

export class Modal extends Modals {
  constructor(props) {
    super(props);
    this.Supplier = Supplier;
    this.StoreLocation = StoreLocation;
    this.Brand = Brand;
  }
}
