import React from "react";
import Element from "../../common/Element";

export class Image extends Element {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      image: this.Util.getGeneralImage("storeVein/no-image.png").url
    };
    this.initializeImage = this.initializeImage.bind(this);
  }

  componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let imageUrl = this.props.url;
      const findIndex = imageUrl.search(process.env.REACT_APP_RESOURCE_HOST);
      if (findIndex !== 0) {
        imageUrl = imageUrl.substring(findIndex, imageUrl.lenght);
      }
      this.Util.validImage(imageUrl, this.initializeImage);
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
    return <img alt="PPP" src={this.state.image} style={this.props.style}/>;
  }
}