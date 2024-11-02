import React from "react";
import {Spin as ASpin} from "antd";

export function Spin() {
    return <div style={{width: 30, margin: "0 auto"}}>
        <ASpin />
    </div>;
}