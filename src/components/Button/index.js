import React from "react";
import { Button as AntButton } from "antd";
import "./index.css";

export function Button(props) {
  return <AntButton
      type={props.type}
      icon={props.icon}
      disabled={props.disabled}
      onClick={props.onClick}
      loading={props.loading}
      className={props.type + " " + props.className}
      id={props.id}
      style={{width: props.width, ...props.style}}
      htmlType={props.htmlType}>
      {props.children}
    </AntButton>
}