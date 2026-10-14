import React from "react";
import Util from "../../../../../common/util";
import "./business-logo.css";

export default function BusinessLogo({clientId, logo, businessName, className = "", imageStyle, placeholderStyle}) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const util = new Util();
  const logoUrl = clientId && logo
    ? util.getGeneralImage(`${clientId}/general/${logo}`).url
    : "";
  const initials = String(businessName || "Business")
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => Array.from(word)[0])
    .join("")
    .toUpperCase() || "B";
  const classes = `invoice-business-logo ${className}`.trim();

  if (logoUrl && !imageFailed) {
    return (
      <img
        className={classes}
        src={logoUrl}
        alt={`${businessName || "Business"} logo`}
        style={imageStyle}
        onError={() => setImageFailed(true)}
      />
    );
  }

  return (
    <span
      className={`${classes} invoice-business-logo-placeholder`}
      style={placeholderStyle}
      role="img"
      aria-label={`${businessName || "Business"} logo unavailable`}
    >
      {initials}
    </span>
  );
}
