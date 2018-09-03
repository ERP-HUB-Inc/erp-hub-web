import Listiew from "../../../common/components/shares/List";
import Supplier from "../shares/Component/SupplierSelect";
import Brand from "../shares/Component/Brand";
import ProductType from "../shares/Component/ProductTypeSelect";
import StoreLocation from "../shares/Component/StoreLocationSelect";
export default class List extends Listiew {
  constructor(props){   
    super(props);
    this.module = "stocks";
    this.Supplier = Supplier;
    this.StoreLocation = StoreLocation;
    this.Brand = Brand;
    this.ProductType = ProductType;
  }
    
}

