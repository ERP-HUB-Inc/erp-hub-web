import React from "react";
import List from "../List";
import Enum from "../../../enums";
import FormWarning from "../../../containers/settings/StoreLocation/FormWarning";
import FormCreate from "../../../containers/settings/StoreLocation/FormCreate";
import FormUpdate from "../../../containers/settings/StoreLocation/FormUpdate";
import Constant from "../../../constants/settings/storeLocation";
import LocationAction from "../../../action/settings/location";
import LocationService from "../../../services/settings/LocationService";

export default class LocationList extends List {
  constructor(props) {
    super(props);
    this.state = {
      ...this.state,
      isShowFilter: false
    };
    this.columns = [
      {
        title: <this.Translate id="text_name" />,
        dataIndex: "name",
        key: "name",
        render: (name, record) => {
          return <div>
            <span>{name}</span>{ record.isDefault === this.Enum.IS_DEFAULT  ? <this.TagLabel color="blue" style={{marginLeft: 10}}><this.Translate id="text_is_default" /></this.TagLabel> : "" }
          </div>;
        }
      },
      {
        title: <this.Translate id="text_sort" />,
        dataIndex: "sort",
        key: "sort"
      }
    ];
    this.formCreate = <FormCreate/>;
    this.formUpdate = <FormUpdate/>;
    this.columnFilterWithKey = ["name"];
    this.service = LocationService;
    this.action = LocationAction;
    this.RESET_CONSTANT = Constant.RESET_STORE_LOCATION;
  }

  handleShowFormAdd() {
    if (this.action && this.formCreate) {
      this.setState({loadingPopup: true});
      this.PrivilegeService.checkPermission(this.service.createRoute)
        .then(() => {
          this.props.dispatch(this.action.showForm());
          this.setState({
            modalConten: this.formCreate,
            loadingPopup: false
          });
        })
        .catch(error => {
          const errorCode = this.Util.getErrorCodeFromState(error.response);
          if (errorCode === Enum.LITE_PLAN_NOT_ALLOW_CREAE_LOCATION) {
            this.props.dispatch(this.action.showForm());

            this.setState({
              modalConten: <FormWarning errorCode={errorCode} />,
              loadingPopup: false
            });
          } else if (errorCode === Enum.PRO_PLAN_NOT_ALLOW_CREAE_LOCATION) {
            this.props.dispatch(this.action.showForm());

            this.setState({
              modalConten: <FormWarning errorCode={errorCode} />,
              loadingPopup: false
            });
          }  else {
            this.Message.warning(this.CATranslate(this.messageNoPermissionKey, this.props.locale));
            this.setState({loadingPopup: false});
          }
        });
    }
  }

  componentWillUpdate(nextProps) {
    if (nextProps.add.added || nextProps.update.updated) {
      nextProps.dispatch(LocationAction.fetch(this.pageSize));
      this.props.dispatch(LocationAction.reset());
    }
  }

  checkIsAllowEditRecordOrNot() {

  }
}