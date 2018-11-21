import React from "react";
import Element from "../../common/Element";
import { Switch } from "antd";
import "./index.css";

export class Switchs extends Element {

  constructor(props) {
    super(props);
    const checked =  this.props.checked === 1;
    this.state = {
      ...this.props,      
      checked
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(checked) {
    this.setState({checked});
    const value  = checked ? 1 : 0;
    const onChange = this.props.onChange;
    onChange && onChange(value);
  }

  render(){
    const { getFieldDecorator } = this.props.form;
    const { icon,checkedicon } = this.props;
    return(
      <div className="main-switch">
        <this.FormItem label={ this.props.label }>
          {
            getFieldDecorator(this.props.name, { initialValue: this.props.checked })(
              <div>
                { checkedicon ?
                
                  <Switch
                    disabled={false}
                    checkedChildren={<span className={icon}></span>} 
                    unCheckedChildren={<span className={icon}></span>} 
                    defaultChecked {...this.state}    
                    onChange={ this.onChange }
                  />
                    
                  : 
                  <Switch
                    disabled={false}
                    defaultChecked {...this.state}    
                    onChange={ this.onChange }
                  />
                }
              </div>
            )
          }
        </this.FormItem>
      </div>
    );  
  }
}
