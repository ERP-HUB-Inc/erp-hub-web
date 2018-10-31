import React from "react";
import Element from "../../common/Element";

export class Image extends Element {
  constructor(props) {
    super(props);
    this.state = {
      image: this.Util.getGeneralImage("storeVein/no-image.png").url
    };
    this.mounted = false;
    this.initializeImage = this.initializeImage.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      this.Util.validImage(this.props.url, this.initializeImage);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  initializeImage(status) {
    if (status === "success") {
      this.setState({image: this.props.url});
    }
  }
  
  render() {
    return <img alt="PPP" src={this.state.image} />;
  }
}