import React from "react";
import Modal from "../../../../common/components/shares/Modal";

export default class FormSelectType extends Modal {
  constructor(props) {
    super(props);
    this.state = {
      type: 1
    };
    this.maskClosable = true;
    this.handleSelectType = this.handleSelectType.bind(this);
  }

  renderCrudAction() {}

  handleSelectType(type) {
    this.setState({type});
  }

  handleCancel() {
    this.props.handleCancel();
  }

  render() {
    this.content = <div className="wrap-income-exp-box">
      { [{title: "QR", value: 1}, {title: "Barcode", value: 2}].map((typeOfPrint, key) => 
        <div key={key} className={`text-center ca-box ${this.state.type === typeOfPrint.value ? "active" : ""}`}  onClick={() => this.handleSelectType(typeOfPrint.value)}>
          {typeOfPrint.title}
        </div> 
      ) 
      }
    </div>;
    return super.render();
  }
}