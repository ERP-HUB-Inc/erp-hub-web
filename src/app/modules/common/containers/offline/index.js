import React from "react";
import PouchDB from "pouchdb";

export default class Offline extends React.Component {
  constructor(props) {
    super(props);
    var db = new PouchDB("POSDB");
  }

  render() {
    return (<h1>Offline DB</h1>);
  }
}