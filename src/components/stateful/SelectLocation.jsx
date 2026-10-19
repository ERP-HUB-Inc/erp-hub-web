import React from "react";
import LocationService from "@services/LocationService";
import { Translate } from "@redux/index";
import RemoteRecordSelect from "./RemoteRecordSelect";

const SelectLocation = React.forwardRef((props, ref) => (
  <RemoteRecordSelect
    service={LocationService}
    limit={50}
    defaultValue={0}
    size="default"
    placeholder={<Translate id="text_all_location" />}
    allLabel={<Translate id="text_all_warehouse" />}
    {...props}
    ref={ref}
  />
));

export { SelectLocation };
