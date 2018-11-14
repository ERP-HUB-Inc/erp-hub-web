import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import Constant from "../../../constants/settings/storeLocation";
import StoreLocationAction from "../../../action/settings/storeLocation";
import StoreLocationService from "../../../services/settings/StoreLocationService";

export default class StoreLocationList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = StoreLocationService;
    this.action = StoreLocationAction;
    this.RESET_CONSTANT = Constant.RESET_STORE_LOCATION;
  }
}

class Column extends List {
  constructor(props) {
    super(props);
    return [
      this.columnCreatedAt,
      this.columnNo,
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        render: (text, record, index) => {
          return <div>
            <span>{record.name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        },
        sorter: true
      },
      {
        title: <this.Translate id="col_store_location_code" />,
        dataIndex: "code",
        sorter: true
      },
      {
        title: <this.Translate id="col_store_location_address" />,
        dataIndex: "address",
        sorter: true
      },
      this.columnUpdatedAt,
      this.columnStatus
    ];
  }
}