import React from "react";
import { Button, Result } from "antd";

export default function NotFound() {
  return (
    <Result
      status="404"
      title="Item Not Found"
      subTitle="The item you're looking for does not exist in the ERP system."
      extra={
        <>
          <Button type="primary" onClick={() => console.log("hello world")}>
            Go to Item List
          </Button>
          <Button
            onClick={() => console.log("hello world")}
            style={{ marginLeft: 8 }}
          >
            Create New Item
          </Button>
        </>
      }
    />
  );
}
