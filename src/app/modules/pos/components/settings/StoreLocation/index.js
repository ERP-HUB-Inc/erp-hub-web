import React from "react";
import List from "../List";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import Constant from "../../../constants/settings/storeLocation";
import LocationAction from "../../../action/settings/storeLocation";
import LocationService from "../../../services/settings/StoreLocationService";

export default class LocationList extends List {
  constructor(props) {
    super(props);
    this.columns = new Column();
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = LocationService;
    this.action = LocationAction;
    this.RESET_CONSTANT = Constant.RESET_STORE_LOCATION;
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      nextProps.dispatch(LocationAction.fetch(this.pageSize));
      this.props.dispatch(LocationAction.reset());
    }
  }

  checkIsAllowEditRecordOrNot() {}
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
        title: <this.Translate id="text_receipt_template" />,
        dataIndex: "receiptTemplate",
        sorter: true,
        render: receiptTemplate => receiptTemplate ? receiptTemplate.name : this.emptyCell
      },
      {
        title: <this.Translate id="text_address" />,
        dataIndex: "address",
        sorter: true
      },
      this.columnStatus
    ];
  }
}