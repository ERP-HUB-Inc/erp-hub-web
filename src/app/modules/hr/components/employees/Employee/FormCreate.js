import React from "react";
import {
  Form,
  PageHeader
} from "antd";
import FormItem from "./FormItem";
import EmployeeAction from "../../../actions/employees/employee";
import Component from "../../../../common/components/Component";
import history from "../../../../common/router/history";

export default class FormCreate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: [],
      locationId: ""
    };
    this.title = <this.Translate id="text_employee"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAccessLocation = this.getAccessLocation.bind(this);
    this.getDefaultLocation = this.getDefaultLocation.bind(this);
  }

  componentDidUpdate(nextProps) {
    if (this.props.manageEmployeeAdd.added && nextProps.manageEmployeeAdd.adding) {
      history.goBack();
    }
  }

  handleCancel() {
    history.goBack();
  }

  getAccessLocation(locations) {
    this.setState({locations});
  }

  getDefaultLocation(locationId) {
    this.setState({locationId});
  }

  handleSubmit (e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["photo"] = this.getImageFromUpload(values, "photo");
        values["status"] = this.Enum.ACTIVE;
        values["locationId"] = this.state.locationId;
        values["locations"] = this.state.locations;
        if(values["autogenerate"] === undefined){
          values["autogenerate"] = 1;
        }
        this.dispatch(EmployeeAction.add(values));   
      }

    });
  }

  render() {
    return <div>
      <PageHeader
        style={{
            backgroundColor: "#f7f7f7",
            paddingLeft: 0,
            paddingRight: 0
        }}
        onBack={() => history.goBack()}
        title={<this.Translate id="text_employee" />}
        subTitle={<this.Translate id="text_new_employee" />}
        extra={[]} />
        <Form autoComplete="off" onSubmit={this.handleSubmit}>
          <FormItem
            roles={this.props.roles.list}
            locations={this.props.locations.list}
            callBack={this.getAccessLocation}
            callBackDefaultLocation={this.getDefaultLocation}
            dispatch={this.props.dispatch}
            form={this.props.form}
            locale={this.props.locale} />

          <this.Row style={{justifyContent: "center", marginTop: 25}}>
            <this.Button className="danger" onClick={this.handleCancel}>
              <span className="icon-cancel icon-padding-right"></span><this.Translate id="text_back" />
            </this.Button>  
            <this.Button htmlType="submit" loading={this.props.manageEmployeeAdd.adding} className="info" style={{marginLeft: 15}} id="btnSubmit">
              <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
            </this.Button>
          </this.Row>
        </Form>
    </div>;
  }
}