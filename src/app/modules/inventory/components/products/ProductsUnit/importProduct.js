import React from "react";
import List from "../../List";
import "./index.css";

export default class ImportProducts extends List {
  constructor(props){
    super(props);
    this.handleForce = this.handleForce.bind(this);
  }

  handleForce(data){
    console.log(data);
  }
  
  render() {
    return (
      <this.Row>
        <div className="main_import">
          <this.CSVReader
          // label="Download sample csv file"
            onFileLoaded={this.handleForce}
          />
        </div>
      </this.Row>
    );
  }

}

