import React from "react";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({
      hasError: true
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#6351BF",
          padding: 30
        }}>
          <div style={{
            width: "fit-content",
            height: "fit-content",
            margin: "auto",
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            top: 0
          }}>
            <div style={{
              textAlign: "center",
              fontSize: "40pt",
              color: "white"
            }}>OOPS!</div>
            <h2 style={{color: "white"}}>Looks like we're having some server issues.</h2>
          </div>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}