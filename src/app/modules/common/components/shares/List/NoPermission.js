import React from "react";
import {Button, Result} from "antd";
import history from "../../../router/history";

export default function () {
    return (
        <Result
            status="403"
            title="403"
            subTitle="Sorry, you are not authorized to access this page."
            extra={<Button type="primary" onClick={() => history.goBack()}>Back Home</Button>}
        />
    );

}