import React from "react";
import {
  Form,
  Spin,
  PageHeader
} from "antd";
import FormItem from "./FormItem";
import EmployeeAction from "../../../actions/employees/employee";
import Component from "../../../../common/components/Component";
import history from "../../../../common/router/history";

export default class FormUpdate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      locations: [],
      locationId: "",
      requiredPassword: false
    };
    this.title = <this.Translate id="text_employee"/>;
    this.dispatch = this.props.dispatch;
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
    this.getAccessLocation = this.getAccessLocation.bind(this);
    this.getDefaultLocation = this.getDefaultLocation.bind(this);
  }

  componentDidMount() {
    const { id } = this.props.match.params;
    this.props.dispatch(EmployeeAction.requestAndShowForm({id}));
  }

  componentDidUpdate(nextProps) {
    if (this.props.update.updated && nextProps.update.updating) {
      history.goBack();
    }
  }

  getAccessLocation(locations) {
    this.setState({locations});
  }

  getDefaultLocation(locationId) {
    this.setState({locationId});
  }

  onChange(checked){
    this.setState({
      disabled : checked === 1 
    });
    this.props.form.setFieldsValue({password: ""});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values["id"] = this.props.detail.data.id;
        values["userId"] = this.props.detail.data.userId; 
        values["photo"] = this.getImageFromUpload(values, "photo");
        values["locationId"] = this.state.locationId;
        values["locations"] = this.state.locations;
        values["status"] = this.Enum.ACTIVE;
        this.dispatch(EmployeeAction.update(values));
      }
    });
  }
    
  handleCancel() {
    history.goBack();
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
        subTitle={<this.Translate id="text_edit_employee" />} />
        {
          this.props.detail.fetched ? 
          <Form autoComplete="off" onSubmit={this.handleSubmit}>
            <FormItem
              formData={this.props.detail.data}
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
                <this.Button htmlType="submit" loading={this.props.update.updating} className="info" style={{marginLeft: 15}} id="btnSubmit">
                  <span className="icon-save icon-padding-right"></span><this.Translate id="text_save" />
                </this.Button>
              </this.Row>
          </Form>
          :
          <div style={{width: 30, margin: "0 auto"}}>
            <Spin />
          </div>
        }
    </div>;
  }
}