import React from "react";
export default class StartUp extends React.Component {
  render() {
    return (
      <div className="start-up" style={{width: "100%", height: "100%", backgroundColor: "white", position: "relative"}}>
        <img alt="" style={{width: 120,
          height: 84,
          position: "absolute",
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          margin: "auto"}} 
        src="https://storeveinresource.sgp1.digitaloceanspaces.com/loading.gif"/>
      </div>
    );
  }
}