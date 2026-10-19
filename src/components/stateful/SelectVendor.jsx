import React from "react";
import VendorService from "@services/VendorService";
import { Translate } from "@redux/index";
import RemoteRecordSelect from "./RemoteRecordSelect";

const SelectVendor = React.forwardRef((props, ref) => (
  <RemoteRecordSelect
    service={VendorService}
    limit={20}
    size="large"
    placeholder={<Translate id="text_all_vendors" />}
    allLabel={<Translate id="text_all_vendors" />}
    {...props}
    ref={ref}
  />
));

export { SelectVendor };
