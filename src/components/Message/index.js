import React from "react";
import sweetalert from "sweetalert";
import { Translate } from "@redux/index";

export class MessageV2 {
  static swal(...arg) {
    return sweetalert(...arg);
  }

  static warning(text, title = "Warning Information") {
    return sweetalert({
        title,
        text,
        icon: "warning",
        button: <span style={{ textTransform: "uppercase" }}><Translate id="text_warning_info" /></span>,
        dangerMode: true
      });
  }

  static error(text, title = "Error Information") {
    return sweetalert({
      title,
      text,
      icon: "error",
      button: <span style={{ textTransform: "uppercase" }}><Translate id="text_close" /></span>,
      dangerMode: true
    });
  }
}