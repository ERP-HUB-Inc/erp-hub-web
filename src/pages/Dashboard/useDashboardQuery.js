import React from "react";
import { payloadOf } from "./dashboardModel";

// Each widget owns its request lifecycle so one failure does not erase others.
export default function useDashboardQuery(load, dependencies, enabled = true) {
  const [retry, setRetry] = React.useState(0);
  const [state, setState] = React.useState({
    data: null,
    loading: false,
    error: "",
    updatedAt: null,
  });
  React.useEffect(() => {
    if (!enabled) {
      setState({ data: null, loading: false, error: "", updatedAt: null });
      return undefined;
    }
    let active = true;
    setState({ data: null, loading: true, error: "", updatedAt: null });
    Promise.resolve()
      .then(load)
      .then((response) => {
        if (active) setState({ data: payloadOf(response), loading: false, error: "", updatedAt: new Date() });
      })
      .catch(() => {
        if (active)
          setState({
            data: null,
            loading: false,
            error: "Unable to load this section. Please try again.",
            updatedAt: null,
          });
      });
    return () => {
      active = false;
    };
  }, [...dependencies, enabled, retry]);
  return { ...state, retry: () => setRetry((value) => value + 1) };
}
