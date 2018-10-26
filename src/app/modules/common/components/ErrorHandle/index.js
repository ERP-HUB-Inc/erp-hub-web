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
        <div>
          <h2>Something went wrong.</h2>
        </div>
      );
    }
    // Normally, just render children
    return this.props.children;
  }  
}