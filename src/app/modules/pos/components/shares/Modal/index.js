import React from "react";
import Component from "../../Component";
import "./index.css";

export default class Modal extends Component {
  constructor(props) {
    super(props);
    this.title = this.props.title;
    this.dispatch = this.props.dispatch;
    this.content = "";
    this.requiredMessage = "Please input all required field.";
    this.addingPropReducer = "";
    this.statusDataSource = [
      {
        name: "Active",
        value: 1
      },
      {
        name: "Deactive",
        value: 0
      }
    ];
  }
  handleSubmit() {
    console.log("submit modal");
  }
    
  handleCancel() {}

  render() {
    console.log("My Props:", this.props[this.addingPropReducer]);
    return (
      <this.Modal
        title={this.title}
        wrapClassName="vertical-center-modal"
        visible={true}
        footer={
          <div>
            <this.Button className="danger" onClick={() => this.handleCancel()}>
              <span className="icon-close icon-padding-right"></span>CANCEL
            </this.Button>
            <this.Button loading={this.props[this.addingPropReducer].adding} className="info" onClick={() => this.handleSubmit()}>
              <span className="icon-checked icon-padding-right"></span>OK
            </this.Button>
          </div>
        }
      >
        {this.content}
      </this.Modal>
    );
  }
}