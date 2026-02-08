import React from "react";
import { Button, Result } from "antd";
import history from "@router/index";

export default function FormItem404() {
  return (
    <Result
      status="404"
      title="Item Not Found"
      subTitle="The item you're looking for does not exist in the ERP system."
      extra={
        <>
          <Button type="primary" onClick={() => history.goBack()}>
            Go to Item List
          </Button>
          <Button
            onClick={() =>  history.push("/inventories/items/create")}
            style={{ marginLeft: 8 }}
          >
            Create New Item
          </Button>
        </>
      }
    />
  );
}
