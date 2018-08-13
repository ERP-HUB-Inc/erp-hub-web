import React from "react";
import  Lists from "../../common/components/shares/List";

export default class List extends Lists {
  constructor(props){
    super(props);
    this.module = "customers";
    this.showExpend = true;
  }

}