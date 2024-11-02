import React from "react";

export class Image extends React.Component {
  mounted = false;
  constructor(props) {
    super(props);
    this.state = {
      image: this.getGeneralImage("storeVein/no-image.png").url
    };
  }

  validImage(url, callback, timeout) {
    timeout = timeout || 5000;
    var timedOut = false,
      timer;
    var img = new Image();
    img.onerror = img.onabort = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("error");
      }
    };
    img.onload = () => {
      if (!timedOut) {
        clearTimeout(timer);
        callback("success");
      }
    };
    img.src = url;
    timer = setTimeout(() => {
      timedOut = true;
      callback("timeout");
    }, timeout);
  }

  getGeneralImage(fileName) {
    return {
      url: `${process.env.REACT_APP_RESOURCE_HOST}/${fileName}`,
    };
  }

  componentDidMount() {
    this.mounted = true;
    if (this.mounted) {
      let imageUrl = this.props.url;
      const findIndex = imageUrl.search(process.env.REACT_APP_RESOURCE_HOST);
      if (findIndex !== 0) {
        imageUrl = imageUrl.substring(findIndex, imageUrl.lenght);
      }
      this.validImage(imageUrl, this.initializeImage);
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  initializeImage = (status) => {
    if (status === "success") {
      this.setState({image: this.props.url});
    }
  }
  
  render() {
    return <img alt="PPP" src={this.state.image} style={this.props.style}/>;
  }
}