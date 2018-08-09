import React from "react";

export default class CRUD extends React.Component {
  render() {
    return (
      <div style={{
        margin: "0 auto",
        width: 300
      }}>
        <h1>CRUD</h1>
        <div>
          <input type="text" name="module" placeholder="Module"/>
        </div>
        <div>
          <input type="text" name="subModule" placeholder="subModule"/>
        </div>
        <div>
          <input type="text" name="constant" placeholder="Constant"/>
        </div>
        <div>
          <input type="text" name="action" placeholder="Action"/>
        </div>
        <div>
          <input type="text" name="reducer" placeholder="Reducer"/>
        </div>
        <div>
          <input type="text" name="service" placeholder="Service"/>
        </div>
        <button type="button">GENERATE</button>
      </div>
    );
  }
}